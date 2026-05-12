"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface ProfileProps {
  user: {
    id: string; name: string; email: string; tier: string; role: string;
    theme: string; streakCount: number; useCases: string[]; avatarUrl: string | null;
    memberSince: string; totalMemories: number; totalBooks: number; totalVoiceMemos: number;
    breakdown: Record<string, number>;
  };
  plan: { name: string; price: number; features: readonly string[] };
}

const themes = [
  { id: "MINIMAL", label: "Minimal", icon: "◻️" },
  { id: "JOURNAL", label: "Journal", icon: "📓" },
  { id: "PLAYFUL", label: "Playful", icon: "🎨" },
  { id: "PREMIUM", label: "Premium", icon: "✨" },
];

const typeIcons: Record<string, string> = {
  QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
};

export default function ProfileClient({ user, plan }: ProfileProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [name, setName] = useState(user.name);
  const [theme, setTheme] = useState(user.theme);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setActiveSection(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function exportData() {
    setExporting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.export, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cherish-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="page-container pt-6 animate-in">
      {/* Success toast */}
      {saved && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-2xl shadow-xl toast-enter">
          ✓ Changes saved
        </div>
      )}

      {/* Avatar & Name */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cherish-300 via-cherish-400 to-cherish-500 mx-auto mb-3 flex items-center justify-center text-4xl font-display font-bold text-white shadow-xl shadow-cherish-500/20 ring-4 ring-white">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="font-display text-xl font-bold text-cherish-900">{user.name}</h1>
        <p className="text-xs text-cherish-900/40">{user.email}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {user.tier !== "FREE" && (
            <span className="badge bg-gradient-to-r from-cherish-500 to-cherish-600 text-white px-3">{plan.name}</span>
          )}
          {user.role === "ADMIN" && (
            <span className="badge bg-red-100 text-red-600 px-3">Admin</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { value: user.totalMemories, label: "Memories", icon: "💾" },
          { value: user.totalBooks, label: "Books", icon: "📚" },
          { value: user.streakCount, label: "Streak", icon: "🔥" },
          { value: user.memberSince.split(" ")[0], label: "Since", icon: "📅" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <span className="text-lg block mb-0.5">{s.icon}</span>
            <p className="text-base font-bold text-cherish-900">{s.value}</p>
            <p className="text-[9px] text-cherish-900/35">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Memory Breakdown */}
      {Object.keys(user.breakdown).length > 0 && (
        <div className="card mb-4">
          <p className="label-upper mb-3">Your memory breakdown</p>
          <div className="space-y-2">
            {Object.entries(user.breakdown).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
              const pct = user.totalMemories > 0 ? Math.round((count / user.totalMemories) * 100) : 0;
              return (
                <div key={type} className="flex items-center gap-2.5">
                  <span className="text-sm w-6 text-center">{typeIcons[type] || "📄"}</span>
                  <span className="text-xs text-cherish-900/60 flex-1">{type.replace("_", " ")}</span>
                  <div className="w-24 h-1.5 bg-cherish-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cherish-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-cherish-900/35 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plan */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="label-upper mb-0.5">Current Plan</p>
            <p className="text-lg font-bold text-cherish-900">{plan.name}</p>
            <p className="text-xs text-cherish-900/40">
              {plan.price > 0 ? `$${(plan.price / 100).toFixed(2)}/mo` : "Free forever"}
            </p>
          </div>
          {user.tier === "FREE" && (
            <button className="btn-primary text-xs !py-2 !px-4 !rounded-full animate-pulse-glow">
              Upgrade →
            </button>
          )}
        </div>
        <div className="border-t border-cherish-300/20 pt-3">
          <ul className="grid grid-cols-2 gap-1.5">
            {plan.features.map((f) => (
              <li key={f} className="text-[10px] text-cherish-900/50 flex items-start gap-1">
                <span className="text-cherish-500 mt-0.5 flex-shrink-0">✓</span>{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-1.5 mb-4">
        {/* Edit Profile */}
        <button
          onClick={() => setActiveSection(activeSection === "edit" ? null : "edit")}
          className="w-full card-hover flex items-center gap-3 !p-3.5"
        >
          <span className="text-lg w-8 text-center">👤</span>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-cherish-900">Edit Profile</span>
            <p className="text-[10px] text-cherish-900/30">Name, theme, preferences</p>
          </div>
          <span className="text-cherish-900/15 text-sm">{activeSection === "edit" ? "▾" : "›"}</span>
        </button>

        {activeSection === "edit" && (
          <div className="card !p-4 animate-scale">
            <div className="mb-4">
              <label className="label-upper block mb-1.5">Display name</label>
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="label-upper block mb-1.5">Visual theme</label>
              <div className="grid grid-cols-4 gap-2">
                {themes.map((t) => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`py-2 px-1 rounded-xl border-[1.5px] text-center transition-all ${
                      theme === t.id ? "border-cherish-500 bg-cherish-50" : "border-cherish-300/50"
                    }`}>
                    <span className="text-lg block">{t.icon}</span>
                    <span className="text-[9px] font-medium text-cherish-900/60">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={saveProfile} disabled={saving} className="btn-primary w-full text-sm">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={() => setActiveSection(activeSection === "notif" ? null : "notif")}
          className="w-full card-hover flex items-center gap-3 !p-3.5"
        >
          <span className="text-lg w-8 text-center">🔔</span>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-cherish-900">Notifications</span>
            <p className="text-[10px] text-cherish-900/30">On This Day, reminders, streaks</p>
          </div>
          <span className="text-cherish-900/15 text-sm">{activeSection === "notif" ? "▾" : "›"}</span>
        </button>

        {activeSection === "notif" && (
          <div className="card !p-4 animate-scale">
            {[
              { label: "On This Day memories", desc: "Daily reminder of memories from past years", defaultOn: true },
              { label: "Streak reminders", desc: "Keep your daily streak alive", defaultOn: true },
              { label: "Weekly recap", desc: "Summary of your week's memories", defaultOn: false },
              { label: "Family Circle activity", desc: "When someone shares or reacts", defaultOn: true },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between py-2.5 border-b border-cherish-300/15 last:border-0 cursor-pointer">
                <div>
                  <p className="text-xs font-medium text-cherish-900">{n.label}</p>
                  <p className="text-[10px] text-cherish-900/30">{n.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={n.defaultOn} className="w-4 h-4 accent-cherish-500 rounded" />
              </label>
            ))}
          </div>
        )}

        {/* Privacy */}
        <button
          onClick={() => setActiveSection(activeSection === "privacy" ? null : "privacy")}
          className="w-full card-hover flex items-center gap-3 !p-3.5"
        >
          <span className="text-lg w-8 text-center">🔒</span>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-cherish-900">Privacy & Security</span>
            <p className="text-[10px] text-cherish-900/30">Password, default privacy, data</p>
          </div>
          <span className="text-cherish-900/15 text-sm">{activeSection === "privacy" ? "▾" : "›"}</span>
        </button>

        {activeSection === "privacy" && (
          <div className="card !p-4 animate-scale">
            <div className="mb-3">
              <p className="text-xs font-medium text-cherish-900 mb-1">Default memory privacy</p>
              <div className="flex gap-2">
                {["PRIVATE", "FAMILY_CIRCLE", "PUBLIC"].map((p) => (
                  <button key={p} className="flex-1 py-2 rounded-xl border text-[10px] font-medium text-center border-cherish-300/50 text-cherish-900/50">
                    {p === "PRIVATE" ? "🔒 Private" : p === "FAMILY_CIRCLE" ? "👨‍👩‍👧 Family" : "🌍 Public"}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-cherish-300/15 pt-3">
              <p className="text-xs font-medium text-cherish-900 mb-2">Account security</p>
              <p className="text-[10px] text-cherish-900/40 mb-1">Email: {user.email}</p>
              <p className="text-[10px] text-cherish-900/40">Password: ••••••••</p>
            </div>
          </div>
        )}

        {/* Export Data */}
        <button
          onClick={exportData}
          disabled={exporting}
          className="w-full card-hover flex items-center gap-3 !p-3.5"
        >
          <span className="text-lg w-8 text-center">📥</span>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-cherish-900">
              {exporting ? "Exporting..." : "Export All Data"}
            </span>
            <p className="text-[10px] text-cherish-900/30">Download everything as JSON</p>
          </div>
          <span className="text-cherish-900/15 text-sm">›</span>
        </button>

        {/* Help */}
        <div className="card-hover flex items-center gap-3 !p-3.5">
          <span className="text-lg w-8 text-center">💬</span>
          <div className="flex-1">
            <span className="text-sm font-medium text-cherish-900">Help & Support</span>
            <p className="text-[10px] text-cherish-900/30">FAQs, contact, report a bug</p>
          </div>
          <span className="text-cherish-900/15 text-sm">›</span>
        </div>
      </div>

      {/* Admin */}
      {user.role === "ADMIN" && (
        <Link href="/admin/dashboard" className="card-hover flex items-center gap-3 !p-3.5 mb-4 !border-red-200/50 !bg-red-50/30">
          <span className="text-lg w-8 text-center">⚙️</span>
          <div className="flex-1">
            <span className="text-sm font-semibold text-red-700">Admin Dashboard</span>
            <p className="text-[10px] text-red-400">Users, stats, content management</p>
          </div>
          <span className="text-red-300 text-sm">›</span>
        </Link>
      )}

      {/* Logout */}
      <button onClick={handleLogout} className="w-full text-center text-sm text-red-500 py-4 hover:text-red-600 transition-colors font-medium">
        Sign Out
      </button>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
