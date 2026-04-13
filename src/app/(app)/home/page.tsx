export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import ModeCards from "@/components/creation/ModeCards";
import Link from "next/link";

export default async function HomePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      memoryBooks: { where: { isDefault: true }, take: 1 },
      memories: {
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, type: true, title: true, createdAt: true },
      },
    },
  });

  if (!user) redirect("/signup");
  if (!user.onboarded) redirect("/onboarding");

  const greeting = getGreeting();
  const defaultBook = user.memoryBooks[0];

  return (
    <div className="page-container pt-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-[22px] font-bold text-cherish-500">
          Cherish.
        </span>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-cherish-100 border border-cherish-300/50 flex items-center justify-center text-sm">
            🔍
          </button>
          <button className="w-8 h-8 rounded-full bg-cherish-100 border border-cherish-300/50 flex items-center justify-center text-sm">
            🔔
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-2">
        <p className="text-xs text-cherish-400 font-medium">{greeting},</p>
        <h1 className="font-display text-xl font-bold text-cherish-900 leading-tight">
          What will you
          <br />
          create today?
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

      {/* Mode Label */}
      <p className="label-upper text-cherish-400 mb-2">
        Choose your experience
      </p>

      {/* Creation Mode Cards */}
      <ModeCards />

      {/* Nudge Bar */}
      {defaultBook && (
        <Link
          href="/library"
          className="flex items-center gap-2 mt-4 bg-cherish-500/7 rounded-xl p-3"
        >
          <span className="text-base">📚</span>
          <p className="text-[11px] text-cherish-700 leading-snug">
            <strong className="font-medium">{defaultBook.title}</strong>
            {user.memories.length > 0
              ? ` — ${user.memories.length} recent captures ready to explore.`
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
