// Shared in-memory message store for the chat API routes
// In production, replace with a real database (e.g., PostgreSQL, MongoDB)

export interface ChatMessage {
  id: string;
  sessionId: string;
  userEmail: string;
  userName: string;
  text: string;
  from: "user" | "admin";
  timestamp: string;
}

// Module-level array acts as in-memory store (resets on server restart)
export const messages: ChatMessage[] = [];
