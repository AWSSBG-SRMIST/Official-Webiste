import { Request, Response, Router } from "express";
import { ClubDataRepository } from "../data/repository";
import { QuotaTracker } from "../middleware/quota";
import { Event } from "../types";

export function adminRouter(repo: ClubDataRepository, quota: QuotaTracker): Router {
  const router = Router();

  router.get("/admin/usage", (_req: Request, res: Response) => {
    const snap = quota.snapshot();
    res.json({
      date: snap.date,
      groq: {
        requests: snap.groq_requests,
        daily_cap: Number(process.env.GROQ_DAILY_CAP || 1000),
      },
      jina: {
        tokens: snap.jina_tokens,
        daily_cap: Number(process.env.JINA_DAILY_TOKENS_CAP || 30000),
      },
      limits: {
        per_ip_per_hour: Number(process.env.RATE_LIMIT_PER_HOUR || 20),
        per_ip_per_day: Number(process.env.RATE_LIMIT_PER_DAY || 100),
        concurrent_streams_per_ip: Number(process.env.MAX_CONCURRENT_STREAMS_PER_IP || 2),
        message_char_cap: Number(process.env.MAX_MESSAGE_CHARS || 1500),
      },
    });
  });

  router.get("/admin/logs", async (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit || 100), 500);
    const offset = Number(req.query.offset || 0);
    const logs = await repo.getLogs(limit, offset);
    res.json({ logs });
  });

  router.post("/admin/events", async (req: Request, res: Response) => {
    const body = req.body as Omit<Event, "id" | "created_at" | "updated_at">;
    if (!body.title || !body.date || !body.venue || !body.description || !body.status) {
      res.status(400).json({ error: "bad_request", message: "title, date, venue, description, status required" });
      return;
    }
    const ev = await repo.createEvent({
      title: body.title,
      date: body.date,
      venue: body.venue,
      description: body.description,
      registration_link: body.registration_link ?? null,
      capacity: body.capacity ?? null,
      status: body.status,
      recap: body.recap ?? null,
      tags: body.tags ?? [],
    });
    res.status(201).json(ev);
  });

  router.put("/admin/events/:id", async (req: Request, res: Response) => {
    const ev = await repo.updateEvent(req.params.id, req.body);
    if (!ev) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json(ev);
  });

  router.delete("/admin/events/:id", async (req: Request, res: Response) => {
    const ok = await repo.deleteEvent(req.params.id);
    if (!ok) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.status(204).end();
  });

  router.get("/admin/club-info", async (_req: Request, res: Response) => {
    const info = await repo.getClubInfo();
    res.json(info);
  });

  router.put("/admin/club-info", async (req: Request, res: Response) => {
    const info = await repo.updateClubInfo(req.body);
    res.json(info);
  });

  return router;
}
