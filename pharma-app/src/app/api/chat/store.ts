/**
 * Shared TypeScript types for the Live Chat API routes.
 *
 * Messages are persisted in PostgreSQL via Prisma (see /api/chat/route.ts).
 * This file no longer exports a mutable in-memory array.
 */

export interface ChatMessage {
  id: string;
  sessionId: string;
  userEmail: string;
  userName: string;
  text: string;
  from: "user" | "admin";
  timestamp: string;
}
