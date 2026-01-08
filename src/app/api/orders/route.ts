import { deleteOrder, getOrders, saveOrder, updateOrder } from "@/lib/orders";
import {
  orderInputSchema,
  orderUpdateSchema,
} from "@/lib/api-schemas";
import { getAdminSessionFromRequest } from "@/lib/admin-session";
import { createRequestLogger, formatError } from "@/lib/logger";
import { getClientIp } from "@/lib/request-meta";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

const ORDER_LIMIT =
  Number.parseInt(process.env.ORDER_RATE_LIMIT ?? "6", 10) || 6;
const ORDER_WINDOW_MS =
  Number.parseInt(process.env.ORDER_RATE_WINDOW_MS ?? "60000", 10) || 60000;

export async function GET(req: NextRequest) {
  const log = createRequestLogger(req, "orders.get");
  let status = 200;
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    status = 401;
    log.warn("orders.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }
  const orders = getOrders();
  log.end(status, { count: orders.length });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "orders.post");
  let status = 200;
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit({
      key: `orders_post:${ip}`,
      limit: ORDER_LIMIT,
      windowMs: ORDER_WINDOW_MS,
    });
    if (!rate.allowed) {
      status = 429;
      log.warn("orders.rate_limited", { ip });
      return NextResponse.json(
        { message: "Too many requests. Try again shortly." },
        { status, headers: rateLimitHeaders(rate) }
      );
    }

    const payload = await req.json();
    const parsed = orderInputSchema.safeParse(payload);
    if (!parsed.success) {
      status = 400;
      log.warn("orders.validation_failed", {
        issues: parsed.error.flatten(),
      });
      return NextResponse.json(
        { message: "Invalid order payload", errors: parsed.error.flatten() },
        { status }
      );
    }
    saveOrder(parsed.data);
    status = 201;
    return NextResponse.json({ message: "Order saved successfully" }, { status });
  } catch (error) {
    status = 500;
    log.error("orders.post_error", { error: formatError(error) });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status }
    );
  } finally {
    log.end(status);
  }
}

export async function DELETE(req: NextRequest) {
  const log = createRequestLogger(req, "orders.delete");
  let status = 200;
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    status = 401;
    log.warn("orders.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    deleteOrder(parseInt(id));
    log.end(status, { orderId: Number(id) });
    return NextResponse.json({ message: "Order deleted successfully" });
  }
  status = 400;
  log.warn("orders.delete_missing_id");
  log.end(status);
  return NextResponse.json({ message: "ID not found" }, { status });
}

export async function PATCH(req: NextRequest) {
  const log = createRequestLogger(req, "orders.patch");
  let status = 200;
  let orderId: number | null = null;
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    status = 401;
    log.warn("orders.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }
  try {
    const payload = await req.json();
    const parsed = orderUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      status = 400;
      log.warn("orders.update_validation_failed", {
        issues: parsed.error.flatten(),
      });
      return NextResponse.json(
        { message: "Invalid update payload", errors: parsed.error.flatten() },
        { status }
      );
    }
    updateOrder(parsed.data.id, {
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes,
    });
    orderId = parsed.data.id;
    return NextResponse.json({ message: "Order updated successfully" }, { status });
  } catch (error) {
    status = 500;
    log.error("orders.patch_error", { error: formatError(error) });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status }
    );
  } finally {
    log.end(status, orderId ? { orderId } : undefined);
  }
}
