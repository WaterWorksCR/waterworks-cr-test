import { db } from "@/lib/db";

export interface MessageInput {
  name: string;
  email: string;
  message: string;
}

export interface Message extends MessageInput {
  id: number;
  createdAt: string;
}

export function getMessages(): Message[] {
  const rows = db
    .prepare(
      `
      SELECT id, name, email, message, created_at
      FROM messages
      ORDER BY created_at DESC
    `
    )
    .all() as Array<{
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  }));
}

export function saveMessage(message: MessageInput) {
  db.prepare(
    `
    INSERT INTO messages
    (name, email, message, created_at)
    VALUES (?, ?, ?, ?)
  `
  ).run(message.name, message.email, message.message, new Date().toISOString());
}

export function deleteMessage(id: number) {
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}
