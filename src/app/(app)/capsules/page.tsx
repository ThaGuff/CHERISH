"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Capsule {
  id: string; title: string; recipient: string; message?: string; unlocksAt: string;
  isUnlocked: boolean; unlockedAt?: string; createdAt: string;
}

export default function CapsulesPage() {
  const [locked, setLocked] = useState<Capsule[]>([]);
  const [unlocked, setUnlocked] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCapsules(); }, []);

  function loadCapsules() {
    fetch("/api/capsules").then(r => r.json()).then(data => {
      setLocked(data.locked || []);
      setUnlocked(data.unlocked || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  async function createCapsule() {
    setSaving(true);
    await fetch("/api/capsules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, recipient, message, unlocksAt: unlockDate }),
    });
    setCreating(false); setTitle(""); setRecipient(""); setMessage(""); setUnlockDate("");
    setSaving(false); loadCapsules();
  }

  function daysUntil(date: string) {
    const diff = new Date(date).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh", paddingBottom: 100 }}>
      <div className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 20, padding: "14px 16px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/home" style={{ fontSize: 13, color: "var(--c-ink-3)", textDecoration: "none" }}>← Back</Link>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, color: "var(--c-ink)" }}>Time Capsules</span>
          <button onClick={() => setCreating(true)} style={{ fontSize: 12, fontWeight: 600, color: "var(--c-brand)" }}>+ New</button>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px" }}>
        {/* Intro */}
        <div style={{
          background: "linear-gradient(135deg, #1a1310, #3a2518)",
          borderRadius: "var(--r-lg)", padding: "16px 18px", color: "#fff", marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "#f5c4b3", marginBottom: 4 }}>
            ⏳ Letters to the future
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            Lock a memory. Open it later.
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            Write a letter to your future self, save photos for your kid&apos;s 18th birthday, or capture a moment to revisit in 5 years.
          </div>
        </div>

        {/* Create form */}
        {creating && (
          <div className="card animate-scale" style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600, color: "var(--c-ink)", marginBottom: 12 }}>Lock a new capsule</p>
            <input className="input-field" placeholder="Title — e.g. Letter to future me" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 8 }} />
            <input className="input-field" placeholder="To — e.g. Me, 2030 or Theo, age 18" value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ marginBottom: 8 }} />
            <textarea className="input-field" placeholder="Your message..." rows={4} value={message} onChange={(e) => setMessage(e.target.value)} style={{ resize: "none", marginBottom: 8, fontFamily: "var(--font-hand)", fontSize: 16 }} />
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--c-ink-3)", display: "block", marginBottom: 4 }}>🔒 Unlock date</label>
              <input type="date" className="input-field" value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setCreating(false)} style={{ flex: 1, padding: 12, borderRadius: "var(--r-sm)", border: "1px solid var(--c-line)", fontSize: 13, color: "var(--c-ink-3)" }}>Cancel</button>
              <button onClick={createCapsule} disabled={saving || !title || !unlockDate} className="btn-primary" style={{ flex: 1, padding: 12 }}>
                {saving ? "Locking..." : "Lock Capsule 🔒"}
              </button>
            </div>
          </div>
        )}

        {/* Locked capsules */}
        {locked.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--c-brand)", marginBottom: 8 }}>
              Locked · {locked.length}
            </div>
            <div className="stagger-in" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {locked.map((c) => {
                const days = daysUntil(c.unlocksAt);
                return (
                  <div key={c.id} className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", overflow: "hidden", position: "relative" }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                      background: "linear-gradient(135deg, #2c1a0a, #5a3020)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 20 }}>🔒</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--c-brand)", marginBottom: 2 }}>
                        To {c.recipient}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: "var(--c-ink-3)", marginTop: 3 }}>
                        Unlocks in <b style={{ color: "var(--c-ink-2)" }}>{days.toLocaleString()} days</b>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Unlocked capsules */}
        {unlocked.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--r-laugh)", marginBottom: 8 }}>
              🔓 Unlocked · {unlocked.length}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {unlocked.map((c) => (
                <div key={c.id} className="card" style={{ background: "linear-gradient(135deg, var(--c-brand-tint), var(--c-paper))", border: "1px solid var(--c-brand-edge)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>🔓</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--c-brand)", textTransform: "uppercase", letterSpacing: 1 }}>To {c.recipient}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)" }}>{c.title}</div>
                    </div>
                  </div>
                  {c.message && (
                    <div style={{ fontFamily: "var(--font-hand)", fontSize: 18, color: "var(--c-ink-2)", lineHeight: 1.6, padding: "8px 0" }}>
                      {c.message}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: "var(--c-ink-4)", marginTop: 4 }}>
                    Locked {new Date(c.createdAt).toLocaleDateString()} · Opened {c.unlockedAt ? new Date(c.unlockedAt).toLocaleDateString() : "today"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {loading && <div style={{ textAlign: "center", padding: 40, color: "var(--c-ink-4)" }}>Loading capsules...</div>}
        {!loading && locked.length === 0 && unlocked.length === 0 && !creating && (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>⏳</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>No capsules yet</p>
            <p style={{ fontSize: 12, color: "var(--c-ink-4)", marginTop: 4, marginBottom: 16 }}>Lock a message for the future — only you decide when it opens.</p>
            <button onClick={() => setCreating(true)} className="btn-primary" style={{ fontSize: 13 }}>Lock Your First Capsule</button>
          </div>
        )}
      </div>
    </div>
  );
}
