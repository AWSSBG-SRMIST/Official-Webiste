import fs from "fs/promises";
import path from "path";

interface Counters {
  date: string;
  groq_requests: number;
  jina_tokens: number;
}

const today = () => new Date().toISOString().slice(0, 10);

export class QuotaTracker {
  private counters: Counters = { date: today(), groq_requests: 0, jina_tokens: 0 };
  private saveTimer: NodeJS.Timeout | null = null;

  constructor(private file: string) {}

  async load(): Promise<void> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const parsed = JSON.parse(raw) as Counters;
      if (parsed.date === today()) this.counters = parsed;
    } catch {
      /* ignore missing file */
    }
  }

  private rollIfNewDay(): void {
    if (this.counters.date !== today()) {
      this.counters = { date: today(), groq_requests: 0, jina_tokens: 0 };
    }
  }

  private scheduleSave(): void {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.persist();
    }, 1000);
  }

  private async persist(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.file), { recursive: true });
      await fs.writeFile(this.file, JSON.stringify(this.counters, null, 2), "utf8");
    } catch (err) {
      console.error("quota persist failed", err);
    }
  }

  checkGroq(cap: number): { ok: boolean; used: number; cap: number } {
    this.rollIfNewDay();
    return {
      ok: this.counters.groq_requests < cap,
      used: this.counters.groq_requests,
      cap,
    };
  }

  checkJina(cap: number, estTokens = 0): { ok: boolean; used: number; cap: number } {
    this.rollIfNewDay();
    return {
      ok: this.counters.jina_tokens + estTokens < cap,
      used: this.counters.jina_tokens,
      cap,
    };
  }

  addGroq(n = 1): void {
    this.rollIfNewDay();
    this.counters.groq_requests += n;
    this.scheduleSave();
  }

  addJinaTokens(n: number): void {
    this.rollIfNewDay();
    this.counters.jina_tokens += n;
    this.scheduleSave();
  }

  snapshot(): Counters {
    this.rollIfNewDay();
    return { ...this.counters };
  }
}
