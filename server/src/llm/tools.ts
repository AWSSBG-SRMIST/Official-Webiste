import type { ChatCompletionTool } from "groq-sdk/resources/chat/completions";
import { ClubDataRepository, EventFilter } from "../data/repository";
import { QuotaTracker } from "../middleware/quota";
import { embed } from "../rag/embed";
import { VectorStore } from "../rag/store";

export const toolDefs: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_events",
      description:
        "Fetch AWS Cloud Clubs SRMIST events, optionally filtered by status or searched by keyword. Always call this for any question about events, what's next, past recaps, or workshops.",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["upcoming", "past", "all"],
            description:
              "'upcoming' for future events, 'past' for completed events (with recaps), 'all' for everything.",
          },
          id: { type: "string", description: "Specific event ID if known." },
          search: {
            type: "string",
            description: "Keyword to search event title, description, recap, or tags.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_club_info",
      description:
        "Fetch static club information: about, mission, team members, contact email, social links. Call this for questions about who runs the club, how to join, mission, or contact.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "search_aws_docs",
      description:
        "Retrieve passages from AWS documentation for any technical question about AWS services, architecture, or best practices. Always call this for AWS technical questions (what/how/why about services like Lambda, S3, EC2, VPC, etc.) so answers stay grounded. Never answer AWS technical questions without calling this first.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "A focused search query capturing the user's AWS question. Rewrite colloquial questions into clear technical phrasing.",
          },
        },
        required: ["query"],
      },
    },
  },
];

export async function runTool(
  repo: ClubDataRepository,
  store: VectorStore,
  quota: QuotaTracker,
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  if (name === "get_events") {
    const filter: EventFilter = {
      status: args.status as EventFilter["status"],
      id: args.id as string | undefined,
      search: args.search as string | undefined,
    };
    return repo.getEvents(filter);
  }
  if (name === "get_club_info") {
    return repo.getClubInfo();
  }
  if (name === "search_aws_docs") {
    const query = (args.query as string | undefined)?.trim();
    if (!query) return { passages: [] };
    if (store.size() === 0) {
      return {
        passages: [],
        note:
          "Knowledge base empty. Use your built-in AWS knowledge and link to https://docs.aws.amazon.com/ when possible.",
      };
    }
    const jinaCap = Number(process.env.JINA_DAILY_TOKENS_CAP || 30000);
    const jinaStatus = quota.checkJina(jinaCap, 50);
    if (!jinaStatus.ok) {
      return {
        passages: [],
        note:
          "Documentation search is over today's budget. Fall back to built-in knowledge and link to https://docs.aws.amazon.com/.",
      };
    }
    const topK = Number(process.env.RAG_TOP_K || 5);
    const { vectors, tokens } = await embed([query], "retrieval.query");
    quota.addJinaTokens(tokens);
    const hits = store.search(new Float32Array(vectors[0]), topK);
    return {
      passages: hits.map((h) => ({
        service: h.service,
        title: h.title,
        source_url: h.source_url,
        content: h.content,
      })),
    };
  }
  return { error: `unknown tool ${name}` };
}
