import { NextRequest, NextResponse } from "next/server";
import {
  deleteMessage,
  getMessages,
  saveMessage,
  updateMessage,
} from "@/lib/messages";
import {
  messageInputSchema,
  messageUpdateSchema,
} from "@/lib/api-schemas";
import { getAdminSessionFromRequest } from "@/lib/admin-session";
import { createRequestLogger, formatError } from "@/lib/logger";
import { getClientIp } from "@/lib/request-meta";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const CONTACT_LIMIT =
  Number.parseInt(process.env.CONTACT_RATE_LIMIT ?? "6", 10) || 6;
const CONTACT_WINDOW_MS =
  Number.parseInt(process.env.CONTACT_RATE_WINDOW_MS ?? "60000", 10) || 60000;

export async function GET(req: NextRequest) {
  const log = createRequestLogger(req, "contact.get");
  let status = 200;
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    status = 401;
    log.warn("contact.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }
  const messages = await getMessages();
  log.end(status, { count: messages.length });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "contact.post");
  let status = 200;
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit({
      key: `contact_post:${ip}`,
      limit: CONTACT_LIMIT,
      windowMs: CONTACT_WINDOW_MS,
    });
    if (!rate.allowed) {
      status = 429;
      log.warn("contact.rate_limited", { ip });
      return NextResponse.json(
        { message: "Too many requests. Try again shortly." },
        { status, headers: rateLimitHeaders(rate) }
      );
    }

    const payload = await req.json();
    const parsed = messageInputSchema.safeParse(payload);
    if (!parsed.success) {
      status = 400;
      log.warn("contact.validation_failed", {
        issues: parsed.error.flatten(),
      });
      return NextResponse.json(
        { message: "Invalid contact payload", errors: parsed.error.flatten() },
        { status }
      );
    }

    saveMessage(parsed.data);
    status = 201;
    return NextResponse.json(
      { message: "Message received successfully" },
      { status }
    );
  } catch (error) {
    status = 500;
    log.error("contact.post_error", { error: formatError(error) });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status }
    );
  } finally {
    log.end(status);
  }
}

export async function DELETE(req: NextRequest) {
  const log = createRequestLogger(req, "contact.delete");
  let status = 200;
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      status = 401;
      log.warn("contact.unauthorized");
      return NextResponse.json({ message: "Unauthorized" }, { status });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      status = 400;
      return NextResponse.json(
        { message: "Message ID is required" },
        { status }
      );
    }

    const messages = await getMessages();
    const filteredMessages = messages.filter((msg) => msg.id.toString() !== id);

    if (messages.length === filteredMessages.length) {
      status = 404;
      return NextResponse.json(
        { message: "Message not found" },
        { status }
      );
    }

    deleteMessage(Number(id));

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status }
    );
  } catch (error) {
    status = 500;
    log.error("contact.delete_error", { error: formatError(error) });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status }
    );
  } finally {
    log.end(status);
  }
}

export async function PATCH(req: NextRequest) {
  const log = createRequestLogger(req, "contact.patch");
  let status = 200;
  let messageId: number | null = null;
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    status = 401;
    log.warn("contact.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }
  try {
    const payload = await req.json();
    const parsed = messageUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      status = 400;
      log.warn("contact.update_validation_failed", {
        issues: parsed.error.flatten(),
      });
      return NextResponse.json(
        { message: "Invalid update payload", errors: parsed.error.flatten() },
        { status }
      );
    }
    updateMessage(parsed.data.id, {
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes,
    });
    messageId = parsed.data.id;
    return NextResponse.json(
      { message: "Message updated successfully" },
      { status }
    );
  } catch (error) {
    status = 500;
    log.error("contact.patch_error", { error: formatError(error) });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status }
    );
  } finally {
    log.end(status, messageId ? { messageId } : undefined);
  }
}
