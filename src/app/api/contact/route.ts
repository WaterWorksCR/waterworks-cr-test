import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const messagesFilePath = path.join(process.cwd(), "data", "messages.json");

async function getMessages() {
  try {
    const data = await fs.readFile(messagesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveMessage(message: any) {
  const messages = await getMessages();
  messages.push(message);
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2));
}

async function saveMessages(messages: any[]) {
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2));
}

export async function GET() {
  const messages = await getMessages();
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMessage = {
      id: Date.now(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    await saveMessage(newMessage);

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

    await saveMessages(filteredMessages);

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
