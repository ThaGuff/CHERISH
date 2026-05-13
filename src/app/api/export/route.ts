import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { getTierLimits } from "@/lib/tier-limits";

// POST /api/export — create an export/print order
export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { bookId, format, quality } = await request.json();
  // format: "pdf" | "softcover" | "hardcover"
  // quality: "standard" | "hd"

  const book = await prisma.memoryBook.findFirst({
    where: { id: bookId, userId: user.id },
    include: {
      memories: {
        include: {
          photos: true,
          journalEntry: true,
          scrapPage: true,
          quickSnap: true,
        },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  const limits = getTierLimits(user.tier);
  const pageCount = book.memories.length;

  // Pricing
  const pricing: Record<string, { base: number; perPage: number }> = {
    pdf: { base: 399, perPage: 0 },          // $3.99 flat
    softcover: { base: 1999, perPage: 50 },   // $19.99 + $0.50/page
    hardcover: { base: 3499, perPage: 75 },    // $34.99 + $0.75/page
  };

  const priceInfo = pricing[format] || pricing.pdf;
  let totalCents = priceInfo.base + (pageCount * priceInfo.perPage);

  // Apply Pro discount
  if (limits.printDiscount > 0) {
    totalCents = Math.round(totalCents * (1 - limits.printDiscount / 100));
  }

  return NextResponse.json({
    bookId: book.id,
    bookTitle: book.title,
    pageCount,
    format,
    quality: quality || "standard",
    subtotal: totalCents,
    discount: limits.printDiscount,
    total: totalCents,
    totalFormatted: `$${(totalCents / 100).toFixed(2)}`,
    pages: book.memories.map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title,
      date: m.date,
      photos: m.photos.map((p) => ({ url: p.url, caption: p.caption })),
      hasJournal: !!m.journalEntry,
      hasScrapPage: !!m.scrapPage,
    })),
  });
}
