"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Chain {
  id: string; title: string; description?: string; maxSlots: number; isOpen: boolean; deadline?: string;
  host: { id: string; name: string; username?: string };
  entries: { id: string; note?: string; photoUrl?: string; user: { name: string } }[];
  _count: { entries: number };
}

export default function ChainsPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSlots, setNewSlots] = useState(10);
  const [saving, setSaving] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [addNote, setAddNote] = useState("");

  useEffect(() => { loadChains(); }, []);

  function loadChains() {
    fetch("/api/chains").then(r => r.json()).then(data => {
      setChains(data.chains || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  async function createChain() {
    setSaving(true);
    await fetch("/api/chains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDesc, maxSlots: newSlots }),
    });
    setCreating(false); setNewTitle(""); setNewDesc(""); setSaving(false);
    loadChains();
  }

  async function addEntry(chainId: string) {
    await fetch("/api/chains", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chainId, note: addNote }),
    });
    setAddingTo(null); setAddNote("");
    loadChains();
  }

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh", paddingBottom: 100 }}>
      <div className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 20, padding: "14px 16px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/home" style={{ fontSize: 13, color: "var(--c-ink-3)", textDecoration: "none" }}>← Back</Link>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, color: "var(--c-ink)" }}>Memory Chains</span>
          <button onClick={() => setCreating(true)} style={{ fontSize: 12, fontWeight: 600, color: "var(--c-brand)" }}>+ New</button>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "12px 16px" }}>
        {/* Intro */}
        <div style={{
          background: "linear-gradient(135deg, #2c1a0a, #5a2c14)",
          borderRadius: "var(--r-lg)", padding: "16px 18px", color: "#fff", marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "#f5c4b3", marginBottom: 4 }}>
            🔗 Collaborative memories
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            Build a memory together
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
            Start a chain and invite people to each add their photo, story, or voice — like &ldquo;Nana&apos;s 80th&rdquo; from 9 different perspectives.
          </div>
        </div>

        {/* Create form */}
        {creating && (
          <div className="card animate-scale" style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 600, color: "var(--c-ink)", marginBottom: 12 }}>Start a new chain</p>
            <input className="input-field" placeholder="Chain title — e.g. Stories of Nana" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ marginBottom: 8 }} />
            <textarea className="input-field" placeholder="What should people add?" rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} style={{ marginBottom: 8, resize: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "var(--c-ink-3)" }}>Max contributors:</span>
              <input type="number" className="input-field" value={newSlots} onChange={(e) => setNewSlots(parseInt(e.target.value) || 10)} style={{ width: 60, textAlign: "center" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setCreating(false)} style={{ flex: 1, padding: 12, borderRadius: "var(--r-sm)", border: "1px solid var(--c-line)", fontSize: 13, fontWeight: 600, color: "var(--c-ink-3)" }}>Cancel</button>
              <button onClick={createChain} disabled={saving || !newTitle} className="btn-primary" style={{ flex: 1, padding: 12 }}>
                {saving ? "Creating..." : "Start Chain 🔗"}
              </button>
            </div>
          </div>
        )}

        {/* Chain list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "var(--c-ink-4)" }}>Loading chains...</div>
        ) : chains.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>🔗</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>No chains yet</p>
            <p style={{ fontSize: 12, color: "var(--c-ink-4)", marginTop: 4 }}>Start one and invite your people to contribute.</p>
          </div>
        ) : (
          <div className="stagger-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {chains.map((chain) => {
              const pct = chain.maxSlots > 0 ? (chain._count.entries / chain.maxSlots) * 100 : 0;
              return (
                <div key={chain.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 12 }}>🔗</span>
                      <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "var(--c-brand)" }}>
                        {chain.isOpen ? "Open" : "Closed"} · {chain._count.entries}/{chain.maxSlots} added
                      </span>
                    </div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 600, color: "var(--c-ink)", lineHeight: 1.25, marginBottom: 4 }}>
                      {chain.title}
                    </div>
                    {chain.description && (
                      <div style={{ fontSize: 12, color: "var(--c-ink-3)", lineHeight: 1.5, marginBottom: 8 }}>{chain.description}</div>
                    )}
                    <div style={{ fontSize: 11, color: "var(--c-ink-4)" }}>by {chain.host.name}</div>

                    {/* Progress bar */}
                    <div style={{ height: 4, background: "var(--c-paper)", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "var(--c-brand)", borderRadius: 2, transition: "width 0.3s" }} />
                    </div>

                    {/* Entries preview */}
                    {chain.entries.length > 0 && (
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                        {chain.entries.slice(0, 3).map((entry) => (
                          <div key={entry.id} style={{
                            display: "flex", gap: 8, alignItems: "flex-start",
                            padding: "8px 10px", background: "var(--c-paper)", borderRadius: "var(--r-sm)",
                          }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--c-brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                              {entry.user.name.charAt(0)}
                            </div>
                            <div>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--c-ink)" }}>{entry.user.name}</span>
                              {entry.note && <p style={{ fontSize: 11, color: "var(--c-ink-3)", marginTop: 2 }}>{entry.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add entry */}
                    {addingTo === chain.id ? (
                      <div style={{ marginTop: 12 }}>
                        <textarea className="input-field" placeholder="Add your story, memory, or thought..." rows={3} value={addNote} onChange={(e) => setAddNote(e.target.value)} style={{ resize: "none", marginBottom: 8 }} />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setAddingTo(null)} style={{ flex: 1, padding: 10, borderRadius: "var(--r-sm)", border: "1px solid var(--c-line)", fontSize: 12, color: "var(--c-ink-3)" }}>Cancel</button>
                          <button onClick={() => addEntry(chain.id)} className="btn-primary" style={{ flex: 1, padding: 10, fontSize: 12 }}>Add to Chain</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAddingTo(chain.id)} style={{
                        width: "100%", marginTop: 12, padding: 10,
                        border: "1.5px dashed var(--c-brand-edge)", borderRadius: "var(--r-sm)",
                        color: "var(--c-brand)", fontSize: 12, fontWeight: 600, background: "transparent",
                      }}>+ Add your memory</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
