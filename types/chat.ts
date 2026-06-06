export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export type VoiceChatStatus =
  | "idle"
  | "listening"
  | "processing"
  | "speaking"
  | "error";

export type CrisisLevel = "high" | "medium" | null;
