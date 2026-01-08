import { db } from "@/lib/db";
import type {
  MessageInput,
  MessageRecord,
  MessageStatus,
} from "@/lib/api-schemas";

export function getMessages(): MessageRecord[] {
  const rows = db
    .prepare(
      `
      SELECT id, name, email, interest, site_type, message, status, admin_notes, created_at
      FROM messages
      ORDER BY created_at DESC
    `
    )
    .all() as Array<{
    id: number;
    name: string;
    email: string;
    interest: string;
    site_type: string;
    message: string;
    status: string;
    admin_notes: string | null;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    interest: row.interest,
    siteType: row.site_type,
    message: row.message,
    status: (row.status || "new") as MessageStatus,
    adminNotes: row.admin_notes ?? "",
    createdAt: row.created_at,
  }));
}

export function saveMessage(message: MessageInput) {
  db.prepare(
    `
    INSERT INTO messages
    (name, email, interest, site_type, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(
    message.name,
    message.email,
    message.interest,
    message.siteType,
    message.message,
    new Date().toISOString()
  );
}

export function deleteMessage(id: number) {
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}

export function updateMessage(
  id: number,
  updates: { status?: MessageStatus; adminNotes?: string }
) {
  const fields: string[] = [];
  const values: Array<string | number> = [];
  if (updates.status) {
    fields.push("status = ?");
    values.push(updates.status);
  }
  if (updates.adminNotes !== undefined) {
    fields.push("admin_notes = ?");
    values.push(updates.adminNotes);
  }
  if (fields.length === 0) {
    return;
  }
  values.push(id);
  db.prepare(`UPDATE messages SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}
