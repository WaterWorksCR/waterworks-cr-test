import { db } from "@/lib/db";
import type { OrderInput, OrderRecord, OrderStatus } from "@/lib/api-schemas";

export function getOrders(): OrderRecord[] {
  const rows = db
    .prepare(
      `
      SELECT id, name, email, phone, service, delivery_method, address, details, status, admin_notes, created_at
      FROM orders
      ORDER BY created_at DESC
    `
    )
    .all() as Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    delivery_method: string;
    address: string | null;
    details: string;
    status: string;
    admin_notes: string | null;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    deliveryMethod: row.delivery_method,
    address: row.address ?? undefined,
    details: row.details,
    status: (row.status || "new") as OrderStatus,
    adminNotes: row.admin_notes ?? "",
    createdAt: row.created_at,
  }));
}

export function saveOrder(order: OrderInput) {
  const stmt = db.prepare(`
    INSERT INTO orders
    (name, email, phone, service, delivery_method, address, details, status, admin_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    order.name,
    order.email,
    order.phone,
    order.service,
    order.deliveryMethod,
    order.address ?? null,
    order.details,
    "new",
    "",
    new Date().toISOString()
  );
}

export function deleteOrder(id: number) {
  db.prepare("DELETE FROM orders WHERE id = ?").run(id);
}

export function updateOrder(
  id: number,
  updates: { status?: OrderStatus; adminNotes?: string }
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
  db.prepare(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}
