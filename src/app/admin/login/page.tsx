"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Invalid username or password");
        return;
      }

      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Login</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto bg-secondary p-8 rounded-lg shadow-md"
      >
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-foreground font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-foreground font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
