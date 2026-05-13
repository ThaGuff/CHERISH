export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

const typeIcons: Record<string, string> = {
  QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
};
const typeColors: Record<string, string> = {
  QUICK_SNAP: "bg-amber-400", JOURNAL: "bg-blue-400", SCRAPBOOK: "bg-emerald-400",
  FULL_MEMORY: "bg-purple-400", VISION_BOARD: "bg-yellow-400", CREATIVE: "bg-sky-400",
};
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default async function CalendarPage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Get all memories for this month
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  const memories = await prisma.memory.findMany({
    where: {
      userId: authUser.id,
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    select: { id: true, type: true, title: true, date: true },
    orderBy: { date: "asc" },
  });

  // Group by day
  const byDay: Record<number, typeof memories> = {};
  memories.forEach((m) => {
    const day = new Date(m.date).getDate();
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(m);
  });

  // Calendar grid
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // Stats
  const daysWithMemories = Object.keys(byDay).length;
  const totalThisMonth = memories.length;

  return (
    <div className="page-container pt-6 animate-in">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-cherish-900">Calendar</h1>
        <Link href="/timeline" className="text-xs text-cherish-500 font-medium">Timeline →</Link>
      </div>
      <p className="text-xs text-cherish-900/45 mb-5">See when your memories happened.</p>

      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-cherish-900">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2 text-xs text-cherish-900/40">
          <span>{totalThisMonth} memories</span>
          <span>·</span>
          <span>{daysWithMemories} days active</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card !p-3 mb-5">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-cherish-900/30 py-1">{d}</div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} className="aspect-square" />;
            const dayMemories = byDay[day] || [];
            const isToday = day === today;
            const hasMemories = dayMemories.length > 0;

            return (
              <div
                key={i}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  isToday
                    ? "bg-cherish-500 text-white shadow-md shadow-cherish-500/20"
                    : hasMemories
                    ? "bg-cherish-50 border border-cherish-300/30"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className={`text-xs font-medium ${isToday ? "text-white" : hasMemories ? "text-cherish-900" : "text-cherish-900/40"}`}>
                  {day}
                </span>
                {hasMemories && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayMemories.slice(0, 3).map((m, j) => (
                      <div key={j} className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-white/70" : typeColors[m.type] || "bg-gray-300"}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(typeIcons).map(([type, icon]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${typeColors[type]}`} />
            <span className="text-[10px] text-cherish-900/40">{icon} {type.replace("_", " ").toLowerCase()}</span>
          </div>
        ))}
      </div>

      {/* Memories this month */}
      {memories.length > 0 && (
        <>
          <p className="label-upper mb-2">This month&apos;s memories</p>
          <div className="space-y-1.5 stagger-in">
            {memories.map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-white border border-cherish-300/30">
                <span className="text-sm">{typeIcons[m.type]}</span>
                <span className="text-xs font-medium text-cherish-900 flex-1 truncate">{m.title}</span>
                <span className="text-[10px] text-cherish-900/30">
                  {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
