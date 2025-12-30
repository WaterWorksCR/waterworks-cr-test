import { getOrders, saveOrder, deleteOrder } from "@/lib/orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  if (!isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const order = await req.json();
  saveOrder(order);
  return NextResponse.json({ message: "Order saved successfully" });
}

export async function DELETE(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  if (!isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    deleteOrder(parseInt(id));
    return NextResponse.json({ message: "Order deleted successfully" });
  }
  return NextResponse.json({ message: "ID not found" }, { status: 400 });
}
