import fs from "fs";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

export function getOrders() {
  if (!fs.existsSync(ordersFilePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(ordersFilePath, "utf-8");
  return JSON.parse(fileContent);
}

export function saveOrder(order: any) {
  const orders = getOrders();
  orders.push({ id: Date.now(), ...order });
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}

export function deleteOrder(id: number) {
  let orders = getOrders();
  orders = orders.filter((order: any) => order.id !== id);
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}
