import fs from "fs/promises";
import path from "path";
import { cosine, normalize } from "./embed";

export interface KnowledgeChunk {
  id: string;
  service: string;
  title: string;
  source_url: string;
  content: string;
  embedding: number[];
}

export interface LoadedChunk {
  id: string;
  service: string;
  title: string;
  source_url: string;
  content: string;
  vec: Float32Array;
}

export class VectorStore {
  private chunks: LoadedChunk[] = [];
  private loaded = false;

  constructor(private file: string) {}

  async load(): Promise<void> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const data = JSON.parse(raw) as KnowledgeChunk[];
      this.chunks = data.map((c) => ({
        id: c.id,
        service: c.service,
        title: c.title,
        source_url: c.source_url,
        content: c.content,
        vec: normalize(c.embedding),
      }));
      this.loaded = true;
      console.log(`[rag] loaded ${this.chunks.length} chunks from ${this.file}`);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        console.warn(`[rag] ${this.file} not found — run 'npm run ingest' to populate`);
        this.loaded = true;
        return;
      }
      throw err;
    }
  }

  async save(chunks: KnowledgeChunk[]): Promise<void> {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(chunks, null, 2), "utf8");
  }

  search(queryVec: Float32Array, topK = 5): LoadedChunk[] {
    if (!this.loaded || this.chunks.length === 0) return [];
    const qn = normalize(Array.from(queryVec));
    const scored = this.chunks.map((c) => ({ c, s: cosine(qn, c.vec) }));
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, topK).map((x) => x.c);
  }

  size(): number {
    return this.chunks.length;
  }
}
