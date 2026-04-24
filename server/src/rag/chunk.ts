const CHARS_PER_TOKEN = 4;

export function cleanMarkdown(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*\|.*\|\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function chunkText(
  text: string,
  opts: { maxTokens?: number; overlapTokens?: number } = {},
): string[] {
  const maxTokens = opts.maxTokens ?? 500;
  const overlapTokens = opts.overlapTokens ?? 50;
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  const overlapChars = overlapTokens * CHARS_PER_TOKEN;

  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };

  for (const p of paragraphs) {
    if (p.length >= maxChars) {
      flush();
      let i = 0;
      while (i < p.length) {
        const slice = p.slice(i, i + maxChars);
        chunks.push(slice.trim());
        i += maxChars - overlapChars;
      }
      continue;
    }
    if ((current + "\n\n" + p).length > maxChars) {
      const tail = current.slice(-overlapChars);
      flush();
      current = tail ? tail + "\n\n" + p : p;
    } else {
      current = current ? current + "\n\n" + p : p;
    }
  }
  flush();

  return chunks.filter((c) => c.length > 50);
}
