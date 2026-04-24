import { NextFunction, Request, Response } from "express";

type Bucket = { count: number; resetAt: number };

const hourBuckets = new Map<string, Bucket>();
const dayBuckets = new Map<string, Bucket>();
const activeStreams = new Map<string, number>();

export function getClientIp(req: Request): string {
  const xf = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
  return xf || req.ip || "unknown";
}

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const hourLimit = Number(process.env.RATE_LIMIT_PER_HOUR || 20);
  const dayLimit = Number(process.env.RATE_LIMIT_PER_DAY || 100);
  const now = Date.now();
  const ip = getClientIp(req);

  const hb = hourBuckets.get(ip);
  if (!hb || hb.resetAt < now) {
    hourBuckets.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
  } else if (hb.count >= hourLimit) {
    const retry = Math.ceil((hb.resetAt - now) / 1000);
    res.status(429).json({
      error: "rate_limited",
      message: "You've hit the hourly limit — try again in a bit!",
      retry_after_seconds: retry,
    });
    return;
  } else {
    hb.count += 1;
  }

  const db = dayBuckets.get(ip);
  if (!db || db.resetAt < now) {
    dayBuckets.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
  } else if (db.count >= dayLimit) {
    const retry = Math.ceil((db.resetAt - now) / 1000);
    res.status(429).json({
      error: "rate_limited_day",
      message: "You've hit today's limit — come back tomorrow!",
      retry_after_seconds: retry,
    });
    return;
  } else {
    db.count += 1;
  }

  next();
}

export function acquireStreamSlot(ip: string): boolean {
  const max = Number(process.env.MAX_CONCURRENT_STREAMS_PER_IP || 2);
  const current = activeStreams.get(ip) ?? 0;
  if (current >= max) return false;
  activeStreams.set(ip, current + 1);
  return true;
}

export function releaseStreamSlot(ip: string): void {
  const current = activeStreams.get(ip) ?? 0;
  if (current <= 1) activeStreams.delete(ip);
  else activeStreams.set(ip, current - 1);
}

setInterval(() => {
  const now = Date.now();
  for (const [k, b] of hourBuckets) if (b.resetAt < now) hourBuckets.delete(k);
  for (const [k, b] of dayBuckets) if (b.resetAt < now) dayBuckets.delete(k);
}, 10 * 60 * 1000).unref();
