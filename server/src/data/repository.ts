import { ChatLog, ClubInfo, Event, EventStatus } from "../types";

export interface EventFilter {
  status?: EventStatus | "all";
  id?: string;
  search?: string;
}

export interface ClubDataRepository {
  getEvents(filter?: EventFilter): Promise<Event[]>;
  getEventById(id: string): Promise<Event | null>;
  createEvent(data: Omit<Event, "id" | "created_at" | "updated_at">): Promise<Event>;
  updateEvent(id: string, patch: Partial<Event>): Promise<Event | null>;
  deleteEvent(id: string): Promise<boolean>;
  getClubInfo(): Promise<ClubInfo>;
  updateClubInfo(info: ClubInfo): Promise<ClubInfo>;
  appendLog(log: ChatLog): Promise<void>;
  getLogs(limit?: number, offset?: number): Promise<ChatLog[]>;
}
