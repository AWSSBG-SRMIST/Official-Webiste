const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+|the\s+)?(previous|prior|above|your|these)\s+(instructions?|rules?|prompts?|system)/i,
  /forget\s+(your|all|the|previous|prior)\s+(instructions?|rules?|prompts?|system\s*prompt|training)/i,
  /disregard\s+(all\s+|the\s+)?(previous|prior|above|your)\s+(instructions?|rules?)/i,
  /(override|bypass|break)\s+(your|the)?\s*(instructions?|rules?|guardrails?|safety)/i,
  /<\|(?:im_start|im_end|system|assistant|user|endoftext)\|>/i,
  /\b(?:jailbreak|DAN\s+mode|developer\s+mode|god\s+mode)\b/i,
  /you\s+are\s+now\s+(?:a|an)\s+(?!aws\b|the\s+aws\b|club\b|assistant\b|helpful\b)/i,
  /pretend\s+(?:to\s+be|you\s+are|that\s+you)/i,
  /reveal\s+(?:your|the)\s+(?:system\s+prompt|instructions|rules)/i,
  /print\s+(?:your|the)\s+(?:system\s+prompt|instructions)/i,
];

export function detectInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((re) => re.test(text));
}

function isBadChar(code: number): boolean {
  if (code < 0x20 && code !== 0x09 && code !== 0x0a) return true;
  if (code === 0x7f) return true;
  if (code >= 0x200b && code <= 0x200f) return true;
  if (code >= 0x202a && code <= 0x202e) return true;
  if (code >= 0x2060 && code <= 0x206f) return true;
  if (code === 0xfeff) return true;
  return false;
}

function stripBadChars(input: string): string {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    if (!isBadChar(input.charCodeAt(i))) out += input[i];
  }
  return out;
}

export function sanitizeInput(raw: string): string {
  let s = raw.normalize("NFKC");
  s = stripBadChars(s);
  s = s.replace(/\r\n/g, "\n");
  s = s.replace(/\n{6,}/g, "\n\n\n\n\n");
  s = s.replace(/ {4,}/g, "   ");
  return s.trim();
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOOSE_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

export function isValidSessionId(id: string): boolean {
  return UUID_RE.test(id) || LOOSE_ID_RE.test(id);
}
