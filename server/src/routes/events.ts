import { Request, Response, Router } from "express";
import { ClubDataRepository } from "../data/repository";
import { EventStatus } from "../types";

export function eventsRouter(repo: ClubDataRepository): Router {
  const router = Router();

  router.get("/events", async (req: Request, res: Response) => {
    const status = req.query.status as EventStatus | "all" | undefined;
    const search = req.query.search as string | undefined;
    const events = await repo.getEvents({ status, search });
    res.json({ events });
  });

  router.get("/events/:id", async (req: Request, res: Response) => {
    const ev = await repo.getEventById(req.params.id);
    if (!ev) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json(ev);
  });

  return router;
}
