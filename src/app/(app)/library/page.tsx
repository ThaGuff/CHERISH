export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

const typeColors: Record<string, string> = {
  QUICK_SNAP: "bg-snap-light text-snap-text border-snap-border",
  JOURNAL: "bg-journal-light text-journal-text border-journal-border",
  SCRAPBOOK: "bg-scrap-light text-scrap-text border-scrap-border",
  FULL_MEMORY: "bg-full-light text-full-text border-full-border",
  VISION_BOARD: "bg-vision-light text-vision-text border-vision-border",
  CREATIVE: "bg-creative-light text-creative-text border-creative-border",
};
const typeIcons: Record<string, string> = {
  QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
};
const typeLabels: Record<string, string> = {
  QUICK_SNAP: "Quick Snap", JOURNAL: "Journal", SCRAPBOOK: "Scrapbook",
  FULL_MEMORY: "Full Memory", VISION_BOARD: "Vision Board", CREATIVE: "Creative",
};

export default async function LibraryPage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const [books, recentMemories, memoryCounts] = await Promise.all([
    prisma.memoryBook.findMany({
      where: { userId: authUser.id },
      include: { _count: { select: { memories: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.memory.findMany({
      where: { userId: authUser.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        photos: { take: 1, orderBy: { order: "asc" } },
        quickSnap: { select: { note: true, starRating: true } },
        journalEntry: { select: { template: true, mood: true } },
      },
    }),
    prisma.memory.groupBy({
      by: ["type"],
      where: { userId: authUser.id },
      _count: true,
    }),
  ]);

  const totalMemories = memoryCounts.reduce((sum, m) => sum + m._count, 0);
  const bookColors = ["#c84820", "#1a5a30", "#1a3880", "#5a1880", "#6a4a00", "#0a3870"];

  return (
    <div className="page-container pt-6 animate-in">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-cherish-900">Library</h1>
        <span className="text-xs text-cherish-900/30">{totalMemories} total memories</span>
      </div>
      <p className="text-xs text-cherish-900/50 mb-5">Your memory books and captures.</p>

      {/* Stats bar */}
      {memoryCounts.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
          {memoryCounts.map((m) => (
            <div key={m.type} className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-[10px] font-medium ${typeColors[m.type]}`}>
              {typeIcons[m.type]} {typeLabels[m.type]}: {m._count}
            </div>
          ))}
        </div>
      )}

      {/* Memory Books */}
      <p className="label-upper mb-2">Your Books</p>
      <div className="flex gap-3 overflow-x-auto pb-3 mb-5 -mx-4 px-4">
        {books.map((book, i) => (
          <div key={book.id} className="flex-shrink-0 w-36 card-hover !p-3 text-center">
            <div className="w-20 h-24 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md"
              style={{ backgroundColor: bookColors[i % bookColors.length] + "20", borderLeft: `4px solid ${bookColors[i % bookColors.length]}` }}>
              <span className="text-3xl">📖</span>
            </div>
            <p className="text-xs font-semibold text-cherish-900 truncate">{book.title}</p>
            <p className="text-[10px] text-cherish-900/40">{book._count.memories} pages</p>
          </div>
        ))}
        <div className="flex-shrink-0 w-36 card-hover !p-3 text-center border-dashed !border-2 flex flex-col items-center justify-center">
          <span className="text-3xl mb-1 text-cherish-300">+</span>
          <p className="text-xs font-medium text-cherish-900/30">New Book</p>
        </div>
      </div>

      {/* Recent Memories */}
      <p className="label-upper mb-2">All Memories</p>
      {recentMemories.length === 0 ? (
        <div className="card text-center py-10">
          <span className="text-4xl block mb-3">📸</span>
          <p className="text-sm font-medium text-cherish-900/60 mb-1">No memories yet</p>
          <p className="text-xs text-cherish-900/30 mb-4">Create your first memory to see it here.</p>
          <Link href="/home" className="btn-primary inline-block text-sm">Start Creating</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recentMemories.map((memory) => (
            <div key={memory.id} className={`flex items-center gap-3 p-3 rounded-2xl border-[1.5px] transition-all hover:shadow-sm ${typeColors[memory.type] || "bg-white border-cherish-300"}`}>
              {/* Thumbnail */}
              {memory.photos[0] ? (
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/50 shadow-sm">
                  <img src={memory.photos[0].url} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl bg-white/50">
                  {typeIcons[memory.type] || "📄"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">
                  {memory.title || typeLabels[memory.type]}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] opacity-50">
                    {typeLabels[memory.type]}
                  </span>
                  {memory.quickSnap?.starRating ? (
                    <span className="text-[10px]">{"⭐".repeat(memory.quickSnap.starRating)}</span>
                  ) : null}
                  {memory.journalEntry?.mood && (
                    <span className="text-[10px]">{memory.journalEntry.mood}</span>
                  )}
                </div>
                <p className="text-[10px] opacity-40 mt-0.5">
                  {new Date(memory.createdAt).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric", year: "numeric",
                  })}
                  {memory.privacy !== "PRIVATE" && ` · ${memory.privacy.toLowerCase()}`}
                </p>
              </div>

              {memory.quickSnap?.note && (
                <p className="text-[10px] opacity-40 max-w-[80px] truncate hidden sm:block italic">
                  &ldquo;{memory.quickSnap.note}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
