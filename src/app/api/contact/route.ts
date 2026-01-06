import { NextRequest, NextResponse } from "next/server";
import { deleteMessage, getMessages, saveMessage } from "@/lib/messages";

export async function GET(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  if (!isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const messages = await getMessages();
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, interest, siteType, message } = await req.json();

    if (!name || !email || !interest || !siteType || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMessage = {
      name,
      email,
      interest,
      siteType,
      message,
    };

    saveMessage(newMessage);

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
    if (!isLoggedIn) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Message ID is required" },
        { status: 400 }
      );
    }

    const messages = await getMessages();
    const filteredMessages = messages.filter(
      (msg: any) => msg.id.toString() !== id
    );

    if (messages.length === filteredMessages.length) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    deleteMessage(Number(id));

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
