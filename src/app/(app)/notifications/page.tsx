"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const typeConfig: Record<string, { icon: string; color: string }> = {
  react: { icon: "🧡", color: "var(--r-warm)" },
  comment: { icon: "💬", color: "var(--c-ink-3)" },
  chain_invite: { icon: "🔗", color: "var(--c-brand)" },
  chain_add: { icon: "🔗", color: "var(--c-brand)" },
  chain_create: { icon: "🔗", color: "var(--c-brand)" },
  capsule_unlock: { icon: "🔓", color: "var(--r-laugh)" },
  otd: { icon: "💫", color: "var(--r-cozy)" },
  follow: { icon: "👤", color: "var(--c-brand)" },
  sticker_gift: { icon: "🎁", color: "var(--r-warm)" },
  prompt: { icon: "✨", color: "var(--r-laugh)" },
};

interface Notif {
  id: string; type: string; title: string; body?: string; read: boolean; createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(data => {
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh", paddingBottom: 100 }}>
      <div className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 20, padding: "14px 16px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/home" style={{ fontSize: 13, color: "var(--c-ink-3)", textDecoration: "none" }}>← Back</Link>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, color: "var(--c-ink)" }}>Notifications</span>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ fontSize: 11, fontWeight: 600, color: "var(--c-brand)" }}>Mark all read</button>
          )}
          {unread === 0 && <div style={{ width: 60 }} />}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "8px 16px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--c-ink-4)" }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>🔔</span>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>No notifications yet</p>
            <p style={{ fontSize: 12, color: "var(--c-ink-4)", marginTop: 4 }}>When someone reacts to your memory or invites you to a chain, you&apos;ll see it here.</p>
          </div>
        ) : (
          <div className="stagger-in" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {notifications.map((n) => {
              const config = typeConfig[n.type] || { icon: "📌", color: "var(--c-ink-3)" };
              return (
                <div key={n.id} style={{
                  display: "flex", gap: 12, padding: "14px 12px",
                  background: n.read ? "transparent" : "var(--c-brand-tint)",
                  borderRadius: "var(--r-sm)", transition: "background 0.2s",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: n.read ? "var(--c-paper)" : "var(--c-brand-tint)",
                    border: `1px solid ${n.read ? "var(--c-line)" : "var(--c-brand-edge)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>{config.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: "var(--c-ink)", lineHeight: 1.4 }}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p style={{ fontSize: 12, color: "var(--c-ink-3)", marginTop: 2 }}>{n.body}</p>
                    )}
                    <p style={{ fontSize: 10.5, color: "var(--c-ink-4)", marginTop: 4 }}>{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--c-brand)", flexShrink: 0, marginTop: 6 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
