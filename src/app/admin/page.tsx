"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBoxOpen, FaEnvelope, FaTrash } from "react-icons/fa";

interface Order {
  id: number;
  name: string;
  email: string;
  service: string;
  deliveryMethod: string;
  address?: string;
  details: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [sessionRemaining, setSessionRemaining] = useState<string>("Unknown");
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const redirectScheduled = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/admin/session");
      if (res.status === 401) {
        setSessionExpired(true);
        return;
      }
      if (!res.ok) {
        setSessionRemaining("Unknown");
        return;
      }
      const data = await res.json();
      setSessionExpiresAt(typeof data.expiresAt === "number" ? data.expiresAt : null);
      setSessionExpired(false);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (!sessionExpiresAt) {
      return;
    }
    const tick = () => {
      const remainingMs = Math.max(0, sessionExpiresAt - Date.now());
      const minutes = Math.floor(remainingMs / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);
      if (remainingMs <= 0) {
        setSessionRemaining("Expired");
        setSessionExpired(true);
        return;
      }
      setSessionRemaining(`${minutes}m ${seconds}s`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [sessionExpiresAt]);

  useEffect(() => {
    if (!sessionExpired || redirectScheduled.current) {
      return;
    }
    redirectScheduled.current = true;
    const timer = setTimeout(() => {
      router.push("/admin/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, sessionExpired]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setOrders(data);
      setAllOrders(data);
    };

    const fetchMessages = async () => {
      const res = await fetch("/api/contact");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setMessages(data);
      setAllMessages(data);
    };

    fetchOrders();
    fetchMessages();
  }, [router]);

  useEffect(() => {
    const filtered = allOrders.filter(
      (order) =>
        order.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.service.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.details.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.deliveryMethod.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (order.address && order.address.toLowerCase().includes(orderSearch.toLowerCase()))
    );
    setOrders(filtered);
  }, [orderSearch, allOrders]);

  useEffect(() => {
    const filtered = allMessages.filter(
      (message) =>
        message.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
        message.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
        message.message.toLowerCase().includes(messageSearch.toLowerCase())
    );
    setMessages(filtered);
  }, [messageSearch, allMessages]);

  const handleDelete = async (id: number) => {
    toast(
      (t) => (
        <span className="flex items-center">
          <span className="mr-4">Are you sure you want to delete this order?</span>
          <button
            onClick={() => {
              fetch(`/api/orders?id=${id}`, { method: "DELETE" }).then((res) => {
                if (res.status === 401) {
                  toast.dismiss(t.id);
                  toast.error("Session expired. Please log in again.");
                  router.push("/admin/login");
                  return;
                }
                if (!res.ok) {
                  toast.dismiss(t.id);
                  toast.error("Failed to delete order.");
                  return;
                }
                setOrders((prev) => prev.filter((order) => order.id !== id));
                setAllOrders((prev) => prev.filter((order) => order.id !== id));
                toast.dismiss(t.id);
                toast.success("Order deleted!");
              });
            }}
            className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            No
          </button>
        </span>
      ),
      {
        duration: 6000,
      }
    );
  };

  const handleDeleteMessage = async (id: number) => {
    toast(
      (t) => (
        <span className="flex items-center">
          <span className="mr-4">Are you sure you want to delete this message?</span>
          <button
            onClick={() => {
              fetch(`/api/contact?id=${id}`, { method: "DELETE" }).then((res) => {
                if (res.status === 401) {
                  toast.dismiss(t.id);
                  toast.error("Session expired. Please log in again.");
                  router.push("/admin/login");
                  return;
                }
                if (!res.ok) {
                  toast.dismiss(t.id);
                  toast.error("Failed to delete message.");
                  return;
                }
                setMessages((prev) => prev.filter((msg) => msg.id !== id));
                setAllMessages((prev) => prev.filter((msg) => msg.id !== id));
                toast.dismiss(t.id);
                toast.success("Message deleted!");
              });
            }}
            className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            No
          </button>
        </span>
      ),
      {
        duration: 6000,
      }
    );
  };

  const handlePrint = (order: Order) => {
    const printContent = `
      <html>
        <head>
          <title>Order Details</title>
          <style>
            body { font-family: sans-serif; }
            h1 { color: #0070F3; }
          </style>
        </head>
        <body>
          <h1>Order Details</h1>
          <p><strong>Name:</strong> ${order.name}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Service:</strong> ${order.service}</p>
          <p><strong>Delivery Method:</strong> ${order.deliveryMethod}</p>
          ${order.address ? `<p><strong>Address:</strong> ${order.address}</p>` : ""}
          <p><strong>Details:</strong> ${order.details}</p>
        </body>
      </html>
    `;
    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleExtendSession = async () => {
    const res = await fetch("/api/admin/refresh", { method: "POST" });
    if (res.status === 401) {
      setSessionExpired(true);
      return;
    }
    if (!res.ok) {
      toast.error("Failed to extend session.");
      return;
    }
    const sessionRes = await fetch("/api/admin/session");
    if (!sessionRes.ok) {
      return;
    }
    const data = await sessionRes.json();
    setSessionExpiresAt(typeof data.expiresAt === "number" ? data.expiresAt : null);
    setSessionExpired(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left">
          Admin Dashboard
        </h1>
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
          <div className="text-sm text-gray-400">
            Session: {sessionRemaining}
          </div>
          <button
            onClick={handleExtendSession}
            className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Extend Session
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Log Out
          </button>
        </div>
      </div>
      {sessionExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-secondary text-foreground rounded-lg p-6 max-w-sm w-full shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-2">Session expired</h2>
            <p className="text-gray-400 mb-4">
              You will be redirected to the login page in a few seconds.
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              className="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-secondary p-6 rounded-lg shadow-md flex items-center">
          <FaBoxOpen className="text-4xl text-primary mr-4" />
          <div>
            <h2 className="text-2xl font-bold">{orders.length}</h2>
            <p className="text-gray-400">Total Orders</p>
          </div>
        </div>
        <div className="bg-secondary p-6 rounded-lg shadow-md flex items-center">
          <FaEnvelope className="text-4xl text-primary mr-4" />
          <div>
            <h2 className="text-2xl font-bold">{messages.length}</h2>
            <p className="text-gray-400">Total Messages</p>
          </div>
        </div>
      </div>

      {/* Customer Orders Section */}
      <div className="bg-secondary p-8 rounded-lg shadow-md mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Customer Orders</h2>
          <input
            type="text"
            placeholder="Search orders..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="bg-background text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-background">
                <th className="px-4 py-2 text-left text-primary">Name</th>
                <th className="px-4 py-2 text-left text-primary">Email</th>
                <th className="px-4 py-2 text-left text-primary">Service</th>
                <th className="px-4 py-2 text-left text-primary">Delivery</th>
                <th className="px-4 py-2 text-left text-primary">Address</th>
                <th className="px-4 py-2 text-left text-primary">Details</th>
                <th className="px-4 py-2 text-left text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">{order.service}</td>
                  <td className="px-4 py-2">{order.deliveryMethod}</td>
                  <td className="px-4 py-2">{order.address || "N/A"}</td>
                  <td className="px-4 py-2">{order.details}</td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <a
                      href={`mailto:${order.email}`}
                      className="bg-primary text-white font-bold py-1 px-3 rounded-md hover:bg-blue-600"
                    >
                      Email
                    </a>
                    <button
                      onClick={() => handlePrint(order)}
                      className="bg-gray-600 text-white font-bold py-1 px-3 rounded-md hover:bg-gray-700"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="bg-red-600 text-white font-bold py-1 px-3 rounded-md hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Center Section */}
      <div className="bg-secondary p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Message Center</h2>
          <input
            type="text"
            placeholder="Search messages..."
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
            className="bg-background text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-background">
              <th className="px-4 py-2 text-left text-primary">Name</th>
              <th className="px-4 py-2 text-left text-primary">Email</th>
              <th className="px-4 py-2 text-left text-primary">Message</th>
              <th className="px-4 py-2 text-left text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{message.name}</td>
                <td className="px-4 py-2">{message.email}</td>
                <td className="px-4 py-2 max-w-sm truncate">{message.message}</td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  <a
                    href={`mailto:${message.email}`}
                    className="bg-primary text-white font-bold py-1 px-3 rounded-md hover:bg-blue-600"
                  >
                    Email
                  </a>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="bg-red-600 text-white font-bold py-1 px-3 rounded-md hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
