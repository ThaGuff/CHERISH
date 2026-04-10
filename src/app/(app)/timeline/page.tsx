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

export default async function TimelinePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const memories = await prisma.memory.findMany({
    where: { userId: authUser.id },
    orderBy: { date: "desc" },
    take: 50,
    select: {
      id: true, type: true, title: true, date: true, location: true, privacy: true,
    },
  });

  // On This Day — memories from exactly 1 year ago (±1 day)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const dayBefore = new Date(oneYearAgo);
  dayBefore.setDate(dayBefore.getDate() - 1);
  const dayAfter = new Date(oneYearAgo);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const onThisDay = await prisma.memory.findMany({
    where: {
      userId: authUser.id,
      date: { gte: dayBefore, lte: dayAfter },
    },
    take: 3,
    select: { id: true, type: true, title: true, date: true },
  });

  // Group by month
  const grouped: Record<string, typeof memories> = {};
  memories.forEach((m) => {
    const key = new Date(m.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  return (
    <div className="page-container pt-6 animate-in">
      <h1 className="font-display text-2xl font-bold text-cherish-900 mb-1">
        Timeline
      </h1>
      <p className="text-xs text-cherish-900/50 mb-5">
        Every memory, in order.
      </p>

      {/* On This Day */}
      {onThisDay.length > 0 && (
        <div className="bg-gradient-to-r from-cherish-100 to-cherish-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💫</span>
            <p className="text-sm font-bold text-cherish-700">On This Day</p>
            <p className="text-[10px] text-cherish-600 ml-auto">
              {oneYearAgo.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          {onThisDay.map((m) => (
            <div key={m.id} className="bg-white/70 rounded-xl p-2.5 mt-1.5 flex items-center gap-2">
              <span>{typeIcons[m.type]}</span>
              <span className="text-xs font-medium text-cherish-900">{m.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      {Object.entries(grouped).length === 0 ? (
        <div className="card text-center py-8">
          <span className="text-3xl block mb-2">🕐</span>
          <p className="text-sm text-cherish-900/50">Your timeline is empty</p>
          <p className="text-xs text-cherish-900/30">Create memories and they&apos;ll appear here chronologically.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <p className="text-sm font-bold text-cherish-900 mb-2 font-display">
                {month}
              </p>
              <div className="space-y-1.5">
                {items.map((m) => (
                  <div
                    key={m.id}
                    className={`pl-3 border-l-[3px] ${typeBorders[m.type] || "border-l-gray-300"} py-2`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{typeIcons[m.type]}</span>
                      <span className="text-[13px] font-medium text-cherish-900 flex-1 truncate">
                        {m.title || m.type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-cherish-900/30">
                        {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    {m.location && (
                      <p className="text-[10px] text-cherish-900/40 ml-6">📍 {m.location}</p>
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
