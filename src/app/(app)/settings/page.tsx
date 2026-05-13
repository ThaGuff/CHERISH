"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface UserData {
  id: string; name: string; email: string; username: string | null;
  bio: string | null; theme: string; isPublic: boolean; tier: string;
  useCases: string[];
}

const themes = [
  { id: "MINIMAL", label: "Minimal", icon: "◻️", desc: "Clean, modern, white space" },
  { id: "JOURNAL", label: "Journal", icon: "📓", desc: "Warm, classic, vintage paper" },
  { id: "PLAYFUL", label: "Playful", icon: "🎨", desc: "Colorful, fun, rounded shapes" },
  { id: "PREMIUM", label: "Premium", icon: "✨", desc: "Dark mode, gold accents, elegant" },
];

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("MINIMAL");
  const [isPublic, setIsPublic] = useState(false);

  // Notification prefs (client-side only for now)
  const [notifOnThisDay, setNotifOnThisDay] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifCircle, setNotifCircle] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setUsername(data.user.username || "");
          setBio(data.user.bio || "");
          setTheme(data.user.theme || "MINIMAL");
          setIsPublic(data.user.isPublic || false);
        }
        setLoading(false);
      });
  }, []);

  async function saveSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="page-container pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cherish-100 rounded w-1/3" />
          <div className="h-40 bg-cherish-100 rounded-2xl" />
          <div className="h-40 bg-cherish-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pt-6 animate-in">
      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-2xl shadow-xl toast-enter">
          ✓ Settings saved
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-cherish-900">Settings</h1>
        <Link href="/profile" className="text-xs text-cherish-500 font-medium">← Profile</Link>
      </div>

      {/* Profile Section */}
      <div className="card mb-4">
        <p className="label-upper mb-3">Profile</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-cherish-900/60 block mb-1">Display Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-cherish-900/60 block mb-1">Username</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-cherish-900/30">@</span>
              <input className="input-field" placeholder="choose a username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} />
            </div>
            <p className="text-[10px] text-cherish-900/30 mt-1">Used for your public profile and collabs</p>
          </div>
          <div>
            <label className="text-xs font-medium text-cherish-900/60 block mb-1">Bio</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Tell the world about you..." value={bio} onChange={(e) => setBio(e.target.value)} maxLength={160} />
            <p className="text-[10px] text-cherish-900/30 text-right">{bio.length}/160</p>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="card mb-4">
        <p className="label-upper mb-3">Visual Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-3 rounded-xl border-[1.5px] text-left transition-all ${
                theme === t.id ? "border-cherish-500 bg-cherish-50 shadow-sm" : "border-cherish-300/40"
              }`}
            >
              <span className="text-xl block mb-1">{t.icon}</span>
              <p className="text-xs font-semibold text-cherish-900">{t.label}</p>
              <p className="text-[9px] text-cherish-900/35">{t.desc}</p>
            </button>
          ))}
        </div>
        {theme !== "MINIMAL" && user?.tier === "FREE" && (
          <p className="text-[10px] text-amber-600 mt-2 bg-amber-50 rounded-lg p-2">
            ⭐ Themes beyond Minimal require Pro. <Link href="/profile" className="font-medium underline">Upgrade</Link>
          </p>
        )}
      </div>

      {/* Privacy */}
      <div className="card mb-4">
        <p className="label-upper mb-3">Privacy</p>
        <label className="flex items-center justify-between py-2 cursor-pointer">
          <div>
            <p className="text-xs font-medium text-cherish-900">Public profile</p>
            <p className="text-[10px] text-cherish-900/30">Others can find you and see your public memories</p>
          </div>
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="w-5 h-5 accent-cherish-500 rounded" />
        </label>
        <div className="border-t border-cherish-300/15 pt-2 mt-1">
          <p className="text-xs font-medium text-cherish-900 mb-1">Default memory privacy</p>
          <p className="text-[10px] text-cherish-900/30 mb-2">New memories will use this setting</p>
          <div className="flex gap-2">
            {[
              { id: "PRIVATE", label: "🔒 Private", desc: "Only you" },
              { id: "FAMILY_CIRCLE", label: "👨‍👩‍👧 Family", desc: "Your circle" },
              { id: "PUBLIC", label: "🌍 Public", desc: "Everyone" },
            ].map((p) => (
              <button key={p.id} className="flex-1 py-2.5 rounded-xl border-[1.5px] border-cherish-300/40 text-center text-[10px]">
                <span className="block text-sm">{p.label.split(" ")[0]}</span>
                <span className="text-cherish-900/30">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card mb-4">
        <p className="label-upper mb-3">Notifications</p>
        {[
          { label: "On This Day memories", desc: "Daily reminder of past memories", value: notifOnThisDay, set: setNotifOnThisDay },
          { label: "Streak reminders", desc: "Don't break your streak", value: notifStreak, set: setNotifStreak },
          { label: "Weekly recap", desc: "Summary of your week", value: notifWeekly, set: setNotifWeekly },
          { label: "Family Circle activity", desc: "When someone shares or reacts", value: notifCircle, set: setNotifCircle },
        ].map((n) => (
          <label key={n.label} className="flex items-center justify-between py-2.5 border-b border-cherish-300/10 last:border-0 cursor-pointer">
            <div>
              <p className="text-xs font-medium text-cherish-900">{n.label}</p>
              <p className="text-[10px] text-cherish-900/30">{n.desc}</p>
            </div>
            <input type="checkbox" checked={n.value} onChange={(e) => n.set(e.target.checked)} className="w-4 h-4 accent-cherish-500 rounded" />
          </label>
        ))}
      </div>

      {/* Account */}
      <div className="card mb-4">
        <p className="label-upper mb-3">Account</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-cherish-900/50">Email</span>
            <span className="text-cherish-900 font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-cherish-900/50">Plan</span>
            <span className="text-cherish-900 font-medium">{user?.tier === "FREE" ? "Free" : "Pro"}</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <button onClick={saveSettings} disabled={saving} className="btn-primary w-full mb-4">
        {saving ? "Saving..." : "Save All Settings"}
      </button>

      {/* Danger zone */}
      <div className="card !border-red-200/50 mb-4">
        <p className="label-upper text-red-400 mb-3">Danger Zone</p>
        <button onClick={handleLogout} className="w-full py-2.5 rounded-xl border border-red-200 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors mb-2">
          Sign Out
        </button>
        <button className="w-full py-2.5 rounded-xl border border-red-200 text-sm text-red-400 font-medium hover:bg-red-50 transition-colors">
          Delete Account
        </button>
      </div>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
