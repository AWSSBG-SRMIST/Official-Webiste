import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { chunkText, cleanMarkdown } from "./chunk";
import { embed } from "./embed";
import { fetchMarkdown } from "./reader";
import { SOURCES } from "./sources";
import { KnowledgeChunk, VectorStore } from "./store";

const BATCH_SIZE = 16;
const BATCH_PAUSE_MS = 10000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function run() {
  const file = path.resolve(process.env.KNOWLEDGE_FILE || "./data/knowledge.json");
  const cacheDir = path.resolve(path.dirname(file), "raw");
  await fs.mkdir(cacheDir, { recursive: true });
  const store = new VectorStore(file);

  const allChunks: { service: string; title: string; source_url: string; content: string }[] = [];

  for (let i = 0; i < SOURCES.length; i++) {
    const src = SOURCES[i];
    process.stdout.write(`[${i + 1}/${SOURCES.length}] ${src.service}... `);
    const cacheFile = path.join(cacheDir, `${src.service}.md`);
    let md: string | null = null;
    try {
      md = await fs.readFile(cacheFile, "utf8");
      process.stdout.write(`(cached) `);
    } catch {
      /* miss */
    }
    if (!md) {
      try {
        md = await fetchMarkdown(src.url);
        await fs.writeFile(cacheFile, md, "utf8");
      } catch (err) {
        console.log(`FAILED: ${(err as Error).message}`);
        continue;
      }
    }
    const cleaned = cleanMarkdown(md);
    const chunks = chunkText(cleaned, { maxTokens: 500, overlapTokens: 50 });
    for (const content of chunks) {
      allChunks.push({ service: src.service, title: src.title, source_url: src.url, content });
    }
    console.log(`${chunks.length} chunks`);
  }

  console.log(`\ntotal chunks: ${allChunks.length}`);
  console.log(`embedding in batches of ${BATCH_SIZE}...`);

  const results: KnowledgeChunk[] = [];
  let totalTokens = 0;

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const { vectors, tokens } = await embed(
      batch.map((b) => b.content),
      "retrieval.passage",
    );
    totalTokens += tokens;
    batch.forEach((b, j) => {
      results.push({
        id: uuid(),
        service: b.service,
        title: b.title,
        source_url: b.source_url,
        content: b.content,
        embedding: vectors[j],
      });
    });
    console.log(`  batch ${Math.floor(i / BATCH_SIZE) + 1}: +${batch.length} (${tokens} tok)`);
    await store.save(results);
    if (i + BATCH_SIZE < allChunks.length) await sleep(BATCH_PAUSE_MS);
  }

  await store.save(results);
  console.log(`\nsaved ${results.length} chunks to ${file}`);
  console.log(`total embedding tokens used: ${totalTokens}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
