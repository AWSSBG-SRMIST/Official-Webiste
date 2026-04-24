const JINA_URL = "https://api.jina.ai/v1/embeddings";

export type JinaTask = "retrieval.passage" | "retrieval.query";

interface JinaResponse {
  data: { embedding: number[]; index: number }[];
  usage: { total_tokens: number; prompt_tokens: number };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function embed(
  inputs: string[],
  task: JinaTask,
): Promise<{ vectors: number[][]; tokens: number }> {
  const key = process.env.JINA_API_KEY;
  if (!key) throw new Error("JINA_API_KEY not set");
  const model = process.env.JINA_MODEL || "jina-embeddings-v3";

  const maxAttempts = 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(JINA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          task,
          input: inputs,
          truncate: true,
        }),
      });

      if (res.ok) {
        const body = (await res.json()) as JinaResponse;
        const sorted = body.data
          .slice()
          .sort((a, b) => a.index - b.index)
          .map((d) => d.embedding);
        return { vectors: sorted, tokens: body.usage?.total_tokens ?? 0 };
      }

      const text = await res.text();
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt === maxAttempts) {
        throw new Error(`jina embed failed: ${res.status} ${text}`);
      }
      const waitSec = res.status === 429 ? 60 : Math.min(2 ** attempt, 30);
      console.warn(`  jina ${res.status}, retrying in ${waitSec}s (attempt ${attempt}/${maxAttempts})`);
      await sleep(waitSec * 1000);
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const waitSec = Math.min(2 ** attempt * 2, 30);
      console.warn(`  jina network error (${(err as Error).message}), retrying in ${waitSec}s (attempt ${attempt}/${maxAttempts})`);
      await sleep(waitSec * 1000);
    }
  }
  throw new Error("jina embed unreachable");
}

export function normalize(v: number[]): Float32Array {
  const arr = new Float32Array(v);
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i] * arr[i];
  const n = Math.sqrt(sum) || 1;
  for (let i = 0; i < arr.length; i++) arr[i] /= n;
  return arr;
}

export function cosine(a: Float32Array, b: Float32Array): number {
  let s = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) s += a[i] * b[i];
  return s;
}
