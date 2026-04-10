"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowser();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Create user record via API
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    window.location.href = "/onboarding";
  }

  return (
    <div className="animate-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-cherish-900 mb-2">
          Create your account
        </h1>
        <p className="text-sm text-cherish-900/50">
          Free forever. Takes 30 seconds.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="label-upper block mb-1.5">Your name</label>
          <input
            className="input-field"
            placeholder="First name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Continue →"}
        </button>
      </form>

      <p className="text-center text-sm text-cherish-900/50 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-cherish-500 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
