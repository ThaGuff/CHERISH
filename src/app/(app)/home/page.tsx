export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

const typeIcons: Record<string, string> = {
  QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
};

export default async function HomePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      memories: {
        orderBy: { createdAt: "desc" }, take: 10,
        include: {
          photos: { take: 1, orderBy: { order: "asc" } },
          quickSnap: { select: { note: true, starRating: true, mood: true } },
          _count: { select: { reactions: true } },
        },
      },
      _count: { select: { memories: true, memoryBooks: true } },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: authUser.id, email: authUser.email || "",
        name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        onboarded: false,
        memoryBooks: { create: { title: "My First Memory Book", isDefault: true } },
      },
      include: {
        memories: { orderBy: { createdAt: "desc" }, take: 10, include: { photos: { take: 1, orderBy: { order: "asc" } }, quickSnap: { select: { note: true, starRating: true, mood: true } }, _count: { select: { reactions: true } } } },
        _count: { select: { memories: true, memoryBooks: true } },
      },
    });
  }

  if (!user.onboarded) redirect("/onboarding");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const now = new Date();
  const dateStr = `${dayNames[now.getDay()]}, ${monthNames[now.getMonth()]} ${now.getDate()}`;

  return (
    <div style={{ background: "var(--c-bg)", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Sticky header */}
      <div className="glass-nav" style={{
        position: "sticky", top: 0, zIndex: 20,
        padding: "14px 16px 10px",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700, color: "var(--c-brand)", letterSpacing: -0.8 }}>
              Cherish.
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link href="/library" style={{ color: "var(--c-ink-2)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
              </Link>
              <Link href="/settings" style={{ position: "relative", color: "var(--c-ink-2)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M6 8a6 6 0 0112 0c0 5 2 7 2 7H4s2-2 2-7" /><path d="M10 19a2 2 0 004 0" /></svg>
                <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "var(--c-brand)", border: "2px solid var(--c-bg)" }} />
              </Link>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--c-ink-4)" }}>
            {greeting}, {user.name.split(" ")[0]}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
        {/* Daily Prompt Card */}
        <div style={{
          marginTop: 14, borderRadius: "var(--r-lg)",
          background: "linear-gradient(135deg, #2c1a0a 0%, #5a2c14 70%, #c84820 130%)",
          color: "#fff", padding: "18px 18px 16px", position: "relative", overflow: "hidden",
          boxShadow: "0 12px 28px rgba(80,30,10,0.18)",
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.08,
            backgroundImage: "radial-gradient(circle at 80% 20%, #fff 0, transparent 30%), radial-gradient(circle at 10% 80%, #fff 0, transparent 30%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 12 }}>✨</span>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: "#f5c4b3" }}>
                {dateStr} · Today&apos;s prompt
              </span>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, letterSpacing: -0.6, marginBottom: 4 }}>
              Gratitude
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.55, marginBottom: 14, fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
              &ldquo;A small thing today that you didn&apos;t want to forget.&rdquo;
            </div>
            <Link href="/create/journal" style={{
              display: "inline-block", background: "#fff", color: "var(--c-brand-2)", borderRadius: 999,
              padding: "7px 16px", fontSize: 12, fontWeight: 600, textDecoration: "none",
            }}>Add yours →</Link>
          </div>
        </div>

        {/* Streak */}
        {user.streakCount > 0 && (
          <div style={{
            marginTop: 12, background: "var(--c-card)", borderRadius: "var(--r-md)",
            border: "1px solid var(--c-line)", padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: "linear-gradient(135deg,#c84820,#e8703a)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🔥</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: "var(--c-ink)", lineHeight: 1 }}>
                  {user.streakCount}
                </div>
                <div style={{ fontSize: 12, color: "var(--c-ink-3)" }}>day streak</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto" }}>
          {[
            { href: "/create/quick-snap", label: "Quick Snap", icon: "⚡" },
            { href: "/create/journal", label: "Journal", icon: "📖" },
            { href: "/create/scrapbook", label: "Scrapbook", icon: "🎨" },
            { href: "/chains", label: "Chains", icon: "🔗" },
            { href: "/capsules", label: "Capsules", icon: "⏳" },
            { href: "/sticker-shop", label: "Stickers", icon: "⭐" },
            { href: "/export", label: "Print", icon: "📚" },
            { href: "/notifications", label: "Alerts", icon: "🔔" },
          ].map((a) => (
            <Link key={a.href} href={a.href} style={{
              flexShrink: 0, padding: "8px 14px", borderRadius: "var(--r-sm)",
              background: "var(--c-card)", border: "1px solid var(--c-line)",
              fontSize: 11.5, fontWeight: 500, color: "var(--c-ink-2)",
              display: "flex", alignItems: "center", gap: 5, textDecoration: "none",
              boxShadow: "var(--shadow-sm)",
            }}>
              <span>{a.icon}</span>{a.label}
            </Link>
          ))}
        </div>

        {/* Memory Feed */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600, color: "var(--c-ink)" }}>
              Your memories
            </div>
            <Link href="/library" style={{ fontSize: 12, color: "var(--c-brand)", fontWeight: 500, textDecoration: "none" }}>
              See all →
            </Link>
          </div>

          {user.memories.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40 }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>📸</span>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)", marginBottom: 4 }}>No memories yet</p>
              <p style={{ fontSize: 12, color: "var(--c-ink-4)", marginBottom: 16 }}>Tap the + button below to capture your first moment.</p>
              <Link href="/create/quick-snap" className="btn-primary" style={{ display: "inline-block", textDecoration: "none", fontSize: 13 }}>
                Create your first memory
              </Link>
            </div>
          ) : (
            <div className="stagger-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {user.memories.map((m) => (
                <div key={m.id} className="card card-hover" style={{ overflow: "hidden", padding: 0 }}>
                  {/* Author strip */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px 10px" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "var(--c-brand)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 600,
                    }}>{user.name.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-ink)" }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: "var(--c-ink-4)", display: "flex", gap: 6, alignItems: "center" }}>
                        <span>{typeIcons[m.type]} {m.type.replace("_", " ").toLowerCase()}</span>
                        <span>·</span>
                        <span>{new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  {m.photos[0] ? (
                    <div style={{ padding: "0 14px" }}>
                      <div style={{ borderRadius: "var(--r-md)", overflow: "hidden", height: 220 }}>
                        <img src={m.photos[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "0 14px" }}>
                      <div className="memory-img" style={{
                        height: 140,
                        background: `linear-gradient(135deg, var(--p-${(m.type.charCodeAt(0) % 8) + 1}), var(--c-paper))`,
                      }}>
                        <span style={{ fontSize: 40 }}>{typeIcons[m.type]}</span>
                      </div>
                    </div>
                  )}

                  {/* Title + body */}
                  <div style={{ padding: "12px 14px 4px" }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 600, color: "var(--c-ink)", letterSpacing: -0.3, lineHeight: 1.25 }}>
                      {m.title || m.type.replace("_", " ")}
                    </div>
                    {m.quickSnap?.note && (
                      <div style={{ fontSize: 13, color: "var(--c-ink-2)", lineHeight: 1.55, marginTop: 6 }}>
                        {m.quickSnap.note.length > 120 ? m.quickSnap.note.slice(0, 120) + "..." : m.quickSnap.note}
                      </div>
                    )}
                  </div>

                  {/* Reactions */}
                  <div style={{ padding: "10px 14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[
                        { id: "warm", glyph: "🧡" },
                        { id: "cozy", glyph: "🫖" },
                        { id: "laugh", glyph: "✨" },
                        { id: "teary", glyph: "💧" },
                      ].map((r) => (
                        <span key={r.id} style={{
                          display: "inline-flex", alignItems: "center", gap: 2,
                          padding: "3px 8px", borderRadius: 999, fontSize: 11,
                          background: "var(--c-paper)", border: "1px solid var(--c-line)",
                          color: "var(--c-ink-3)", fontWeight: 500,
                        }}>
                          {r.glyph}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--c-ink-4)", fontSize: 12 }}>
                      <span>{m._count.reactions} reactions</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* End */}
        {user.memories.length > 0 && (
          <div style={{ textAlign: "center", color: "var(--c-ink-4)", fontSize: 11, padding: "24px 0 8px", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
            you&apos;re caught up, friend.
          </div>
        )}
      </div>
    </div>
  );
}
