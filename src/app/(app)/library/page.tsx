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
  QUICK_SNAP: "⚡",
  JOURNAL: "📖",
  SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨",
  VISION_BOARD: "🌀",
  CREATIVE: "✍️",
};

export default async function LibraryPage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const [books, recentMemories] = await Promise.all([
    prisma.memoryBook.findMany({
      where: { userId: authUser.id },
      include: { _count: { select: { memories: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.memory.findMany({
      where: { userId: authUser.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        type: true,
        title: true,
        createdAt: true,
        privacy: true,
      },
    }),
  ]);

  return (
    <div className="page-container pt-6 animate-in">
      <h1 className="font-display text-2xl font-bold text-cherish-900 mb-1">
        Library
      </h1>
      <p className="text-xs text-cherish-900/50 mb-6">
        Your memory books and recent captures.
      </p>

      {/* Memory Books */}
      <p className="label-upper mb-2">Your Books</p>
      <div className="flex gap-3 overflow-x-auto pb-3 mb-6 -mx-4 px-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex-shrink-0 w-32 card-hover !p-3 text-center"
          >
            <div
              className="w-16 h-20 rounded-lg mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: book.coverColor + "20" }}
            >
              <span className="text-2xl">📖</span>
            </div>
            <p className="text-xs font-medium text-cherish-900 truncate">
              {book.title}
            </p>
            <p className="text-[10px] text-cherish-900/40">
              {book._count.memories} pages
            </p>
          </div>
        ))}
        <div className="flex-shrink-0 w-32 card-hover !p-3 text-center border-dashed !border-2">
          <div className="w-16 h-20 rounded-lg mx-auto mb-2 flex items-center justify-center bg-cherish-100">
            <span className="text-2xl">+</span>
          </div>
          <p className="text-xs font-medium text-cherish-900/40">New Book</p>
        </div>
      </div>

      {/* Recent Captures */}
      <p className="label-upper mb-2">Recent Captures</p>
      {recentMemories.length === 0 ? (
        <div className="card text-center py-8">
          <span className="text-3xl block mb-2">📸</span>
          <p className="text-sm text-cherish-900/50">No memories yet</p>
          <Link href="/home" className="btn-primary mt-4 inline-block text-sm">
            Create Your First Memory
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {recentMemories.map((memory) => (
            <div
              key={memory.id}
              className={`flex items-center gap-3 p-3 rounded-card border-[1.5px] ${
                typeColors[memory.type] || "bg-white border-cherish-300"
              }`}
            >
              <span className="text-lg">
                {typeIcons[memory.type] || "📄"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">
                  {memory.title || memory.type.replace("_", " ")}
                </p>
                <p className="text-[10px] opacity-60">
                  {new Date(memory.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {memory.privacy !== "PRIVATE" && ` · ${memory.privacy}`}
                </p>
              </div>
              <span className="text-base opacity-30">›</span>
            </div>
          ))}
        </div>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
