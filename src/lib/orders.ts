import { db } from "@/lib/db";

export interface OrderInput {
  name: string;
  email: string;
  service: string;
  deliveryMethod: string;
  address?: string;
  details: string;
}

export interface Order extends OrderInput {
  id: number;
  createdAt: string;
}

export function getOrders(): Order[] {
  const rows = db
    .prepare(
      `
      SELECT id, name, email, service, delivery_method, address, details, created_at
      FROM orders
      ORDER BY created_at DESC
    `
    )
    .all() as Array<{
    id: number;
    name: string;
    email: string;
    service: string;
    delivery_method: string;
    address: string | null;
    details: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    service: row.service,
    deliveryMethod: row.delivery_method,
    address: row.address ?? undefined,
    details: row.details,
    createdAt: row.created_at,
  }));
}

export function saveOrder(order: OrderInput) {
  const stmt = db.prepare(`
    INSERT INTO orders
    (name, email, service, delivery_method, address, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    order.name,
    order.email,
    order.service,
    order.deliveryMethod,
    order.address ?? null,
    order.details,
    new Date().toISOString()
  );
}

export function deleteOrder(id: number) {
  db.prepare("DELETE FROM orders WHERE id = ?").run(id);
}
