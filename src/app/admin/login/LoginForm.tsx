"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  redirectTo: string;
};

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

      router.push(redirectTo || "/admin");
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Login</h1>
      <form
        onSubmit={handleSubmit}
        action="/api/admin/login"
        method="post"
        className="max-w-sm mx-auto bg-secondary p-8 rounded-lg shadow-md"
      >
        <input type="hidden" name="redirect" value={redirectTo} />
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
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
            required
            autoComplete="username"
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
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground"
            required
            autoComplete="current-password"
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
