export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const typeIcons: Record<string, string> = {
  QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
};
const typeBorders: Record<string, string> = {
  QUICK_SNAP: "border-l-orange-400", JOURNAL: "border-l-blue-400",
  SCRAPBOOK: "border-l-green-400", FULL_MEMORY: "border-l-purple-400",
  VISION_BOARD: "border-l-yellow-400", CREATIVE: "border-l-sky-400",
};
const typeLabels: Record<string, string> = {
  QUICK_SNAP: "Quick Snap", JOURNAL: "Journal", SCRAPBOOK: "Scrapbook",
  FULL_MEMORY: "Full Memory", VISION_BOARD: "Vision Board", CREATIVE: "Creative",
};

export default async function TimelinePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const memories = await prisma.memory.findMany({
    where: { userId: authUser.id },
    orderBy: { date: "desc" },
    take: 100,
    include: {
      photos: { take: 1, orderBy: { order: "asc" } },
      quickSnap: { select: { note: true, starRating: true } },
      journalEntry: { select: { mood: true } },
    },
  });

  // On This Day
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const dayBefore = new Date(oneYearAgo); dayBefore.setDate(dayBefore.getDate() - 1);
  const dayAfter = new Date(oneYearAgo); dayAfter.setDate(dayAfter.getDate() + 1);
  const onThisDay = await prisma.memory.findMany({
    where: { userId: authUser.id, date: { gte: dayBefore, lte: dayAfter } },
    take: 5,
    include: { photos: { take: 1 } },
  });

  // Group by month/year
  const grouped: Record<string, typeof memories> = {};
  memories.forEach((m) => {
    const key = new Date(m.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  return (
    <div className="page-container pt-6 animate-in">
      <h1 className="font-display text-2xl font-bold text-cherish-900 mb-1">Timeline</h1>
      <p className="text-xs text-cherish-900/50 mb-5">Every memory, in order. Your story unfolding.</p>

      {/* On This Day */}
      {onThisDay.length > 0 && (
        <div className="bg-gradient-to-r from-cherish-100 via-amber-50 to-cherish-100 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💫</span>
            <div>
              <p className="text-sm font-bold text-cherish-700">On This Day</p>
              <p className="text-[10px] text-cherish-600">
                {oneYearAgo.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            {onThisDay.map((m) => (
              <div key={m.id} className="bg-white/80 backdrop-blur rounded-xl p-2.5 flex items-center gap-2.5 shadow-sm">
                {m.photos[0] ? (
                  <img src={m.photos[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <span className="text-lg w-10 text-center">{typeIcons[m.type]}</span>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-cherish-900 truncate block">{m.title}</span>
                  <span className="text-[10px] text-cherish-600">{typeLabels[m.type]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {Object.entries(grouped).length === 0 ? (
        <div className="card text-center py-10">
          <span className="text-4xl block mb-3">🕐</span>
          <p className="text-sm font-medium text-cherish-900/60 mb-1">Your timeline is empty</p>
          <p className="text-xs text-cherish-900/30">Create memories and they&apos;ll appear here chronologically.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-cherish-300/30" />
                <p className="text-xs font-bold text-cherish-900 font-display px-2">{month}</p>
                <div className="h-px flex-1 bg-cherish-300/30" />
              </div>
              <div className="space-y-2">
                {items.map((m) => (
                  <div key={m.id} className={`pl-3 border-l-[3px] ${typeBorders[m.type] || "border-l-gray-300"} py-2 ml-1`}>
                    <div className="flex items-center gap-2.5">
                      {m.photos[0] ? (
                        <img src={m.photos[0].url} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0" />
                      ) : (
                        <span className="text-lg w-12 text-center flex-shrink-0">{typeIcons[m.type]}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-semibold text-cherish-900 truncate block">
                          {m.title || typeLabels[m.type]}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-cherish-900/40">{typeLabels[m.type]}</span>
                          {m.quickSnap?.starRating ? <span className="text-[10px]">{"⭐".repeat(Math.min(m.quickSnap.starRating, 5))}</span> : null}
                          {m.journalEntry?.mood && <span className="text-[10px]">{m.journalEntry.mood}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-cherish-900/25 flex-shrink-0">
                        {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    {m.location && (
                      <p className="text-[10px] text-cherish-900/30 ml-14 mt-0.5">📍 {m.location}</p>
                    )}
                    {m.quickSnap?.note && (
                      <p className="text-[10px] text-cherish-900/40 ml-14 mt-0.5 italic truncate max-w-[250px]">
                        &ldquo;{m.quickSnap.note}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
