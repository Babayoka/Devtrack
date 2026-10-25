
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created! You can now log in.");
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-zinc-400">Start tracking your development tasks.</p>

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
          <span>Password (at least 6 characters)</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3"
            placeholder="Choose a password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 p-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        {message && <p className="text-sm text-emerald-400">{message}</p>}

        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
          <a href="/login" className="text-emerald-400 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </main>
  );
}
