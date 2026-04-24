import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { ClubDataRepository } from "../data/repository";
import { ChatLog } from "../types";

const MAX_LOG_BYTES = 10 * 1024 * 1024;
const RETAIN_DAYS = 7;

export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

async function rotateIfNeeded(dataDir: string): Promise<void> {
  const logsPath = path.join(dataDir, "logs.json");
  try {
    const st = await fs.stat(logsPath);
    if (st.size < MAX_LOG_BYTES) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const rotated = path.join(dataDir, `logs.${stamp}.json`);
    await fs.rename(logsPath, rotated);
    await pruneOld(dataDir);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") console.error("log rotate failed", err);
  }
}

async function pruneOld(dataDir: string): Promise<void> {
  try {
    const files = await fs.readdir(dataDir);
    const cutoff = Date.now() - RETAIN_DAYS * 24 * 60 * 60 * 1000;
    for (const f of files) {
      if (!f.startsWith("logs.") || !f.endsWith(".json") || f === "logs.json") continue;
      const st = await fs.stat(path.join(dataDir, f));
      if (st.mtimeMs < cutoff) await fs.unlink(path.join(dataDir, f));
    }
  } catch (err) {
    console.error("log prune failed", err);
  }
}

export async function writeLog(
  repo: ClubDataRepository,
  dataDir: string,
  entry: Omit<ChatLog, "id" | "timestamp">,
): Promise<void> {
  await rotateIfNeeded(dataDir);
  const log: ChatLog = {
    id: uuid(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  try {
    await repo.appendLog(log);
  } catch (err) {
    console.error("log write failed", err);
  }
}
