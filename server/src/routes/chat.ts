import { Request, Response, Router } from "express";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { ClubDataRepository } from "../data/repository";
import { GROQ_MODEL, getGroq } from "../llm/groqClient";
import { SYSTEM_PROMPT } from "../llm/systemPrompt";
import { runTool, toolDefs } from "../llm/tools";
import { hashIp, writeLog } from "../middleware/logger";
import { QuotaTracker } from "../middleware/quota";
import { acquireStreamSlot, getClientIp, rateLimit, releaseStreamSlot } from "../middleware/rateLimit";
import { VectorStore } from "../rag/store";
import { detectInjection, isValidSessionId, sanitizeInput } from "../utils/sanitize";

const STREAM_TOTAL_TIMEOUT_MS = 120_000;
const STREAM_IDLE_TIMEOUT_MS = 60_000;
const REFUSAL_MESSAGE =
  "I'm the AWS Cloud Clubs SRMIST assistant — I can help with club questions (events, team, how to join) or anything about AWS and its services. For that one, you'll want to look elsewhere!";

export function chatRouter(
  repo: ClubDataRepository,
  store: VectorStore,
  quota: QuotaTracker,
  dataDir: string,
): Router {
  const router = Router();

  router.post("/chat", rateLimit, async (req: Request, res: Response) => {
    const started = Date.now();
    const maxChars = Number(process.env.MAX_MESSAGE_CHARS || 1500);
    const groqCap = Number(process.env.GROQ_DAILY_CAP || 1000);
    const ip = getClientIp(req);

    const rawMessage = req.body?.message;
    const sessionId = req.body?.session_id;

    if (typeof rawMessage !== "string" || !rawMessage.trim()) {
      res.status(400).json({ error: "bad_request", message: "message required" });
      return;
    }
    if (typeof sessionId !== "string" || !isValidSessionId(sessionId)) {
      res.status(400).json({ error: "bad_request", message: "valid session_id required" });
      return;
    }

    const message = sanitizeInput(rawMessage);
    if (!message) {
      res.status(400).json({ error: "bad_request", message: "empty message after sanitization" });
      return;
    }
    if (message.length > maxChars) {
      res.status(400).json({
        error: "too_long",
        message: `Please keep your message under ${maxChars} characters.`,
      });
      return;
    }

    const groqStatus = quota.checkGroq(groqCap);
    if (!groqStatus.ok) {
      res.status(503).json({
        error: "daily_cap",
        message: "I'm at my daily limit — check back tomorrow!",
      });
      return;
    }

    if (!acquireStreamSlot(ip)) {
      res.status(429).json({
        error: "too_many_streams",
        message: "Too many open chats — close one and try again.",
      });
      return;
    }

    if (detectInjection(message)) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders?.();
      res.write(`data: ${JSON.stringify({ type: "token", content: REFUSAL_MESSAGE })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
      releaseStreamSlot(ip);
      await writeLog(repo, dataDir, {
        session_id: sessionId,
        ip_hash: hashIp(ip),
        user_message: message,
        bot_response: REFUSAL_MESSAGE,
        model_used: GROQ_MODEL(),
        tokens_in: 0,
        tokens_out: 0,
        tool_calls: [{ name: "injection_blocked" }],
        latency_ms: Date.now() - started,
        flagged: true,
      });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    let closed = false;
    const cleanup = () => {
      if (closed) return;
      closed = true;
      releaseStreamSlot(ip);
      try { res.end(); } catch { /* ignore */ }
    };

    const totalTimer = setTimeout(() => {
      if (!closed) {
        res.write(`data: ${JSON.stringify({ type: "error", message: "Response took too long. Try again." })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
        cleanup();
      }
    }, STREAM_TOTAL_TIMEOUT_MS);
    totalTimer.unref();

    let idleTimer: NodeJS.Timeout | null = null;
    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!closed) {
          res.write(`data: ${JSON.stringify({ type: "error", message: "Connection idle. Try again." })}\n\n`);
          res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
          cleanup();
        }
      }, STREAM_IDLE_TIMEOUT_MS);
      idleTimer.unref();
    };

    res.on("close", () => {
      if (totalTimer) clearTimeout(totalTimer);
      if (idleTimer) clearTimeout(idleTimer);
      cleanup();
    });

    const send = (obj: unknown) => {
      if (closed) return;
      res.write(`data: ${JSON.stringify(obj)}\n\n`);
      resetIdle();
    };

    resetIdle();

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ];

    const toolCallsLog: unknown[] = [];
    let tokensIn = 0;
    let tokensOut = 0;
    let assembled = "";
    let flagged = false;

    quota.addGroq(1);

    try {
      const groq = getGroq();
      const model = GROQ_MODEL();

      let first;
      let salvagedToolCalls: { id: string; type: "function"; function: { name: string; arguments: string } }[] = [];
      try {
        first = await groq.chat.completions.create({
          model,
          messages,
          tools: toolDefs,
          tool_choice: "auto",
          temperature: 0.5,
          max_tokens: 800,
        });
      } catch (err: unknown) {
        const e = err as {
          status?: number;
          error?: { error?: { code?: string; failed_generation?: string } };
        };
        const failed = e.error?.error?.failed_generation;
        if (e.error?.error?.code === "tool_use_failed" && failed) {
          salvagedToolCalls = salvageToolCalls(failed);
        }
        if (!salvagedToolCalls.length) throw err;
        first = null;
      }

      if (first) {
        tokensIn += first.usage?.prompt_tokens ?? 0;
        tokensOut += first.usage?.completion_tokens ?? 0;
      }

      const choice = first?.choices[0];
      const toolCalls = choice?.message.tool_calls ?? salvagedToolCalls;

      if (toolCalls.length > 0) {
        // Sanitize tool call arguments — model sometimes emits "null" as the arguments string
        const sanitizedToolCalls = toolCalls.map((tc) => ({
          ...tc,
          function: {
            ...tc.function,
            arguments: (tc.function.arguments && tc.function.arguments !== "null")
              ? tc.function.arguments
              : "{}",
          },
        }));

        const initialText = choice?.message.content || "";
        messages.push({
          role: "assistant",
          content: initialText || null,
          tool_calls: sanitizedToolCalls,
        });

        if (initialText) {
          send({ type: "token", content: initialText });
          assembled = initialText;
        }

        for (const tc of sanitizedToolCalls) {
          const name = tc.function.name;
          let parsed: Record<string, unknown> = {};
          try {
            const raw = JSON.parse(tc.function.arguments);
            parsed = (raw !== null && typeof raw === "object" && !Array.isArray(raw))
              ? (raw as Record<string, unknown>)
              : {};
          } catch {
            parsed = {};
          }
          toolCallsLog.push({ name, arguments: parsed });
          const result = await runTool(repo, store, quota, name, parsed);
          messages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(result),
          });
        }
      } else {
        const text = choice?.message.content ?? "";
        if (text) {
          send({ type: "token", content: text });
          assembled = text;
        }
        if (isRefusal(text)) flagged = true;
        send({ type: "done" });
        cleanup();
        await writeLog(repo, dataDir, {
          session_id: sessionId,
          ip_hash: hashIp(ip),
          user_message: message,
          bot_response: assembled,
          model_used: model,
          tokens_in: tokensIn,
          tokens_out: tokensOut,
          tool_calls: toolCallsLog,
          latency_ms: Date.now() - started,
          flagged,
        });
        return;
      }

      const stream = await groq.chat.completions.create({
        model,
        messages,
        temperature: 0.5,
        max_tokens: 800,
        stream: true,
      });

      for await (const chunk of stream) {
        if (closed) break;
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          assembled += delta;
          send({ type: "token", content: delta });
        }
        const u = (chunk as { x_groq?: { usage?: { prompt_tokens?: number; completion_tokens?: number } } }).x_groq?.usage;
        if (u) {
          tokensIn += u.prompt_tokens ?? 0;
          tokensOut += u.completion_tokens ?? 0;
        }
      }

      // If streaming produced no text (model silently ended after tool call), retry once
      if (!assembled && !closed) {
        messages.push({
          role: "user",
          content: "[System: You did not provide a text response after the tool call. Please answer the user now.]",
        });
        try {
          const retry = await groq.chat.completions.create({
            model,
            messages,
            temperature: 0.5,
            max_tokens: 800,
          });
          assembled = retry.choices[0]?.message.content ?? "";
          tokensIn += retry.usage?.prompt_tokens ?? 0;
          tokensOut += retry.usage?.completion_tokens ?? 0;
          if (assembled) send({ type: "token", content: assembled });
        } catch {
          /* ignore retry failure — done event still sent below */
        }
      }

      if (isRefusal(assembled)) flagged = true;
      send({ type: "done" });
      cleanup();
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 429) {
        send({ type: "error", message: "I'm a bit overwhelmed right now — try again in a moment!" });
      } else {
        console.error("chat error", err);
        send({ type: "error", message: "Something went wrong on my end. Please try again." });
      }
      send({ type: "done" });
      cleanup();
    }

    if (totalTimer) clearTimeout(totalTimer);
    if (idleTimer) clearTimeout(idleTimer);

    await writeLog(repo, dataDir, {
      session_id: sessionId,
      ip_hash: hashIp(ip),
      user_message: message,
      bot_response: assembled,
      model_used: GROQ_MODEL(),
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      tool_calls: toolCallsLog,
      latency_ms: Date.now() - started,
      flagged,
    });
  });

  return router;
}

function isRefusal(text: string): boolean {
  const t = text.toLowerCase();
  return t.includes("i'm the aws cloud clubs srmist assistant") && t.includes("look elsewhere");
}

function salvageToolCalls(
  failed: string,
): { id: string; type: "function"; function: { name: string; arguments: string } }[] {
  const out: { id: string; type: "function"; function: { name: string; arguments: string } }[] = [];
  const re = /<function=([a-zA-Z_][\w]*)[^{]*(\{[\s\S]*?\})\s*<\/function>/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(failed)) !== null) {
    const name = m[1];
    let args = "{}";
    try {
      args = JSON.stringify(JSON.parse(m[2]));
    } catch {
      args = "{}";
    }
    out.push({
      id: `salvaged_${Date.now()}_${i++}`,
      type: "function",
      function: { name, arguments: args },
    });
  }
  if (!out.length) {
    const noClose = /<function=([a-zA-Z_][\w]*)[^{]*(\{[\s\S]*?\})\s*(?:<\/function>|$)/;
    const alt = noClose.exec(failed);
    if (alt) {
      try {
        out.push({
          id: `salvaged_${Date.now()}_0`,
          type: "function",
          function: { name: alt[1], arguments: JSON.stringify(JSON.parse(alt[2])) },
        });
      } catch {
        /* ignore */
      }
    }
  }
  return out;
}
