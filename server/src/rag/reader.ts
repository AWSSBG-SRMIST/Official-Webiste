const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchMarkdown(url: string): Promise<string> {
  const key = process.env.JINA_API_KEY;
  if (!key) throw new Error("JINA_API_KEY not set");
  const readerUrl = `https://r.jina.ai/${url}`;

  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(readerUrl, {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "text/plain",
        "X-Return-Format": "markdown",
      },
    });
    if (res.ok) return res.text();
    const text = await res.text();
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === maxAttempts) {
      throw new Error(`jina reader failed: ${res.status} ${text}`);
    }
    const waitSec = res.status === 429 ? 30 : Math.min(2 ** attempt, 15);
    await sleep(waitSec * 1000);
  }
  throw new Error("jina reader unreachable");
}
