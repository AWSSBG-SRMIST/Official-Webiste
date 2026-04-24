export type EventStatus = "upcoming" | "past" | "cancelled";

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  registration_link?: string | null;
  capacity?: number | null;
  status: EventStatus;
  recap?: string | null;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  name: string;
  role: string;
  photo_url?: string;
}

export interface ClubInfo {
  about: string;
  mission: string;
  team: TeamMember[];
  contact_email: string;
  socials?: Record<string, string>;
}

export interface ChatLog {
  id: string;
  session_id: string;
  timestamp: string;
  ip_hash: string;
  user_message: string;
  bot_response: string;
  model_used: string;
  tokens_in: number;
  tokens_out: number;
  tool_calls: unknown[];
  latency_ms: number;
  flagged: boolean;
}
