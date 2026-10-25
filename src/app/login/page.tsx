
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-zinc-400">Log in to continue tracking your progress.</p>

        <label className="block space-y-2">
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-2">
          <span>Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
            placeholder="Your password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 p-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {message && <p className="text-sm text-red-400">{message}</p>}

        <p className="text-sm text-zinc-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-emerald-400 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
