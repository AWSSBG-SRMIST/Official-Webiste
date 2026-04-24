import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { ChatLog, ClubInfo, Event } from "../types";
import { ClubDataRepository, EventFilter } from "./repository";

export class JsonRepo implements ClubDataRepository {
  private eventsPath: string;
  private clubPath: string;
  private logsPath: string;

  constructor(dataDir: string) {
    this.eventsPath = path.join(dataDir, "events.json");
    this.clubPath = path.join(dataDir, "club_info.json");
    this.logsPath = path.join(dataDir, "logs.json");
  }

  private async readJson<T>(file: string, fallback: T): Promise<T> {
    try {
      const raw = await fs.readFile(file, "utf8");
      return JSON.parse(raw) as T;
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
      throw err;
    }
  }

  private async writeJson(file: string, data: unknown): Promise<void> {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
  }

  async getEvents(filter: EventFilter = {}): Promise<Event[]> {
    const all = await this.readJson<Event[]>(this.eventsPath, []);
    let out = all;
    if (filter.id) out = out.filter((e) => e.id === filter.id);
    if (filter.status && filter.status !== "all") {
      out = out.filter((e) => e.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      out = out.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.recap ?? "").toLowerCase().includes(q) ||
          (e.tags ?? []).some((t) => t.toLowerCase().includes(q)),
      );
    }
    return out.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async getEventById(id: string): Promise<Event | null> {
    const all = await this.readJson<Event[]>(this.eventsPath, []);
    return all.find((e) => e.id === id) ?? null;
  }

  async createEvent(data: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event> {
    const all = await this.readJson<Event[]>(this.eventsPath, []);
    const now = new Date().toISOString();
    const ev: Event = { ...data, id: uuid(), created_at: now, updated_at: now };
    all.push(ev);
    await this.writeJson(this.eventsPath, all);
    return ev;
  }

  async updateEvent(id: string, patch: Partial<Event>): Promise<Event | null> {
    const all = await this.readJson<Event[]>(this.eventsPath, []);
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updated: Event = {
      ...all[idx],
      ...patch,
      id: all[idx].id,
      created_at: all[idx].created_at,
      updated_at: new Date().toISOString(),
    };
    all[idx] = updated;
    await this.writeJson(this.eventsPath, all);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const all = await this.readJson<Event[]>(this.eventsPath, []);
    const next = all.filter((e) => e.id !== id);
    if (next.length === all.length) return false;
    await this.writeJson(this.eventsPath, next);
    return true;
  }

  async getClubInfo(): Promise<ClubInfo> {
    return this.readJson<ClubInfo>(this.clubPath, {
      about: "",
      mission: "",
      team: [],
      contact_email: "",
    });
  }

  async updateClubInfo(info: ClubInfo): Promise<ClubInfo> {
    await this.writeJson(this.clubPath, info);
    return info;
  }

  async appendLog(log: ChatLog): Promise<void> {
    const all = await this.readJson<ChatLog[]>(this.logsPath, []);
    all.push(log);
    await this.writeJson(this.logsPath, all);
  }

  async getLogs(limit = 100, offset = 0): Promise<ChatLog[]> {
    const all = await this.readJson<ChatLog[]>(this.logsPath, []);
    return all.slice().reverse().slice(offset, offset + limit);
  }
}
