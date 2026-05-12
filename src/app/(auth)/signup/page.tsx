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

  async function handleOAuth(provider: "google" | "apple") {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (authError) { setError(authError.message); setLoading(false); return; }
      if (!data.user) { setError("Signup failed. Please try again."); setLoading(false); return; }

      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      window.location.href = "/onboarding";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="animate-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-cherish-900 mb-2">
          Create your account
        </h1>
        <p className="text-sm text-cherish-900/50">
          Free forever. Unlimited memories. No credit card.
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-2.5 mb-5">
        <button
          onClick={() => handleOAuth("google")}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-[1.5px] border-cherish-300/70 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-cherish-900"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("apple")}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-[1.5px] border-cherish-300/70 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-cherish-900"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Continue with Apple
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-cherish-300/30" />
        <span className="text-xs text-cherish-900/30 font-medium">or sign up with email</span>
        <div className="h-px flex-1 bg-cherish-300/30" />
      </div>

      <form onSubmit={handleSignup} className="space-y-3.5">
        <div>
          <label className="label-upper block mb-1.5">Your name</label>
          <input className="input-field" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label-upper block mb-1.5">Email address</label>
          <input className="input-field" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label-upper block mb-1.5">Password</label>
          <input className="input-field" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Free Account →"}
        </button>
      </form>

      <p className="text-center text-sm text-cherish-900/50 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-cherish-500 font-medium">Sign in</Link>
      </p>
    </div>
  );
}
