export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTierLimits } from "@/lib/tier-limits";

const typeIcons: Record<string, string> = {
  QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
};
const typeLabels: Record<string, string> = {
  QUICK_SNAP: "Quick Snap", JOURNAL: "Journal", SCRAPBOOK: "Scrapbook",
  FULL_MEMORY: "Full Memory", VISION_BOARD: "Vision Board", CREATIVE: "Creative",
};

const modes = [
  { id: "quick-snap", icon: "⚡", label: "Quick Snap", desc: "60-second capture", gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
  { id: "journal", icon: "📖", label: "Journal", desc: "6 guided templates", gradient: "from-blue-400 to-indigo-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
  { id: "scrapbook", icon: "🎨", label: "Scrapbook", desc: "Full canvas builder", gradient: "from-emerald-400 to-green-500", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
  { id: "full-memory", icon: "✨", label: "Full Memory", desc: "Scrapbook + journal", gradient: "from-purple-400 to-violet-500", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" },
  { id: "vision-board", icon: "🌀", label: "Vision Board", desc: "Free-form collage", gradient: "from-yellow-400 to-amber-500", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", isNew: true },
  { id: "creative-studio", icon: "✍️", label: "Creative Studio", desc: "Write & create", gradient: "from-sky-400 to-blue-500", bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800", isNew: true },
];

export default async function HomePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      memoryBooks: { where: { isDefault: true }, take: 1 },
      memories: {
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { photos: { take: 1, orderBy: { order: "asc" } } },
      },
      _count: { select: { memories: true, memoryBooks: true } },
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
        onboarded: false,
        memoryBooks: { create: { title: "My First Memory Book", isDefault: true } },
      },
      include: {
        memoryBooks: { where: { isDefault: true }, take: 1 },
        memories: { orderBy: { createdAt: "desc" }, take: 8, include: { photos: { take: 1, orderBy: { order: "asc" } } } },
        _count: { select: { memories: true, memoryBooks: true } },
      },
    });
  }

  if (!user.onboarded) redirect("/onboarding");

  const greeting = getGreeting();
  const limits = getTierLimits(user.tier);
  const defaultBook = user.memoryBooks[0];

  // Monthly usage
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthlyCount = user.memories.filter(
    (m) => new Date(m.createdAt) >= startOfMonth
  ).length;

  return (
    <div className="page-container pt-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-display text-[26px] font-bold text-cherish-500 tracking-tight">
          Cherish.
        </span>
        <div className="flex gap-2.5">
          <Link href="/library" className="w-9 h-9 rounded-xl bg-white border border-cherish-300/40 shadow-sm flex items-center justify-center text-sm hover:shadow-md transition-shadow">
            🔍
          </Link>
          <Link href="/profile" className="w-9 h-9 rounded-xl bg-gradient-to-br from-cherish-400 to-cherish-500 shadow-sm flex items-center justify-center text-sm text-white font-bold hover:shadow-md transition-shadow">
            {user.name.charAt(0).toUpperCase()}
          </Link>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-4">
        <p className="text-xs text-cherish-400 font-medium tracking-wide">{greeting}</p>
        <h1 className="font-display text-2xl font-bold text-cherish-900 leading-tight mt-0.5">
          {user.name.split(" ")[0]}, what will you
          <br />
          <span className="text-cherish-500">create today?</span>
        </h1>
      </div>

      {/* Stats Row */}
      <div className="flex gap-2.5 mb-5">
        {user.streakCount > 0 && (
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl px-3 py-2 shadow-sm">
            <span className="text-base">🔥</span>
            <span className="text-xs font-bold text-amber-700">{user.streakCount}-day streak</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 bg-white border border-cherish-300/40 rounded-xl px-3 py-2 shadow-sm">
          <span className="text-base">📊</span>
          <span className="text-xs text-cherish-900/60">
            {limits.pagesPerMonth === -1 ? `${user._count.memories} total` : `${monthlyCount}/${limits.pagesPerMonth} this month`}
          </span>
        </div>
        {user.tier !== "FREE" && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-cherish-500 to-cherish-600 rounded-xl px-3 py-2 shadow-sm">
            <span className="text-[10px] font-bold text-white tracking-wide">PRO</span>
          </div>
        )}
      </div>

      {/* Creation Modes */}
      <p className="label-upper text-cherish-400 mb-3">Create something new</p>
      <div className="grid grid-cols-2 gap-3 mb-6 stagger-in">
        {modes.map((m) => (
          <Link
            key={m.id}
            href={`/create/${m.id}`}
            className={`${m.bg} ${m.border} border-[1.5px] rounded-2xl p-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-[0.97] relative overflow-hidden group`}
          >
            {m.isNew && (
              <span className="absolute top-2 right-2 badge bg-cherish-500 text-white">NEW</span>
            )}
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl mb-3 shadow-md group-hover:scale-110 transition-transform`}>
              {m.icon}
            </div>
            <p className={`text-[13px] font-bold ${m.text}`}>{m.label}</p>
            <p className={`text-[10px] ${m.text} opacity-60 mt-0.5`}>{m.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      {user.memories.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="label-upper text-cherish-400">Recent memories</p>
            <Link href="/library" className="text-[10px] font-medium text-cherish-500">View all →</Link>
          </div>
          <div className="space-y-2 stagger-in">
            {user.memories.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-2.5 px-3.5 rounded-2xl bg-white border border-cherish-300/30 shadow-sm hover:shadow-md transition-shadow">
                {m.photos[0] ? (
                  <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={m.photos[0].url} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-xl bg-cherish-50">
                    {typeIcons[m.type] || "📄"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-cherish-900 truncate">{m.title || typeLabels[m.type]}</p>
                  <p className="text-[10px] text-cherish-900/35">
                    {typeLabels[m.type]} · {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nudge */}
      {defaultBook && (
        <Link href="/library" className="block bg-gradient-to-r from-cherish-500/8 via-cherish-500/5 to-transparent rounded-2xl p-4 border border-cherish-300/20 hover:border-cherish-300/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-cherish-300 to-cherish-400 flex items-center justify-center text-xl shadow-sm">📖</div>
            <div>
              <p className="text-xs font-semibold text-cherish-800">{defaultBook.title}</p>
              <p className="text-[10px] text-cherish-600/60">
                {user._count.memories} memories · {user._count.memoryBooks} book{user._count.memoryBooks !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
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
