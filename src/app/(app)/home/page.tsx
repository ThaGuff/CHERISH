export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import ModeCards from "@/components/creation/ModeCards";
import Link from "next/link";

export default async function HomePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  // Find or create user in our DB
  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      memoryBooks: { where: { isDefault: true }, take: 1 },
      memories: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, type: true, title: true, createdAt: true },
      },
    },
  });

  // Auto-create user record if it doesn't exist (handles race conditions)
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        onboarded: false,
        memoryBooks: {
          create: { title: "My First Memory Book", isDefault: true },
        },
      },
      include: {
        memoryBooks: { where: { isDefault: true }, take: 1 },
        memories: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, type: true, title: true, createdAt: true },
        },
      },
    });
  }

  if (!user.onboarded) redirect("/onboarding");

  const greeting = getGreeting();
  const defaultBook = user.memoryBooks[0];
  const typeIcons: Record<string, string> = {
    QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
    FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
  };

  return (
    <div className="page-container pt-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-[22px] font-bold text-cherish-500">Cherish.</span>
        <div className="flex gap-2">
          <Link href="/library" className="w-8 h-8 rounded-full bg-cherish-100 border border-cherish-300/50 flex items-center justify-center text-sm">🔍</Link>
          <Link href="/profile" className="w-8 h-8 rounded-full bg-cherish-100 border border-cherish-300/50 flex items-center justify-center text-sm">👤</Link>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-2">
        <p className="text-xs text-cherish-400 font-medium">{greeting}, {user.name}</p>
        <h1 className="font-display text-xl font-bold text-cherish-900 leading-tight">
          What will you<br />create today?
        </h1>
      </div>

      {/* Streak */}
      {user.streakCount > 0 && (
        <div className="inline-flex items-center gap-1.5 bg-cherish-100 border border-cherish-300/50 rounded-full px-3 py-1 mb-4">
          <span className="text-sm">🔥</span>
          <span className="text-[11px] text-cherish-600 font-medium">
            {user.streakCount}-day streak — keep it going!
          </span>
        </div>
      )}

      <p className="label-upper text-cherish-400 mb-2">Choose your experience</p>
      <ModeCards />

      {/* Recent Activity */}
      {user.memories.length > 0 && (
        <div className="mt-5">
          <p className="label-upper text-cherish-400 mb-2">Recent memories</p>
          <div className="space-y-1.5">
            {user.memories.map((m) => (
              <div key={m.id} className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white border border-cherish-300/30">
                <span className="text-sm">{typeIcons[m.type] || "📄"}</span>
                <span className="text-xs font-medium text-cherish-900 flex-1 truncate">{m.title}</span>
                <span className="text-[10px] text-cherish-900/30">
                  {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nudge */}
      {defaultBook && (
        <Link href="/library" className="flex items-center gap-2 mt-4 bg-cherish-500/7 rounded-xl p-3">
          <span className="text-base">📚</span>
          <p className="text-[11px] text-cherish-700 leading-snug">
            <strong className="font-medium">{defaultBook.title}</strong>
            {user.memories.length > 0
              ? ` — ${user.memories.length} memories and counting!`
              : " — start adding memories!"}
          </p>
        </Link>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
