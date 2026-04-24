import Groq from "groq-sdk";

let client: Groq | null = null;

export function getGroq(): Groq {
  if (client) return client;
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set");
  client = new Groq({ apiKey: key });
  return client;
}

export const GROQ_MODEL = () => process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
