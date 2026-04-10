"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/home";
  }

  return (
    <div className="animate-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-cherish-900 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-cherish-900/50">
          Sign in to your Cherish account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label-upper block mb-1.5">Email address</label>
          <input
            className="input-field"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label-upper block mb-1.5">Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-cherish-900/50 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-cherish-500 font-medium">
          Create one free
        </Link>
      </p>
    </div>
  );
}
