import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { getTierLimits } from "@/lib/tier-limits";

// GET /api/memories — list user memories
export async function GET(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const bookId = searchParams.get("bookId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { userId: authUser.id };
  if (type) where.type = type;
  if (bookId) where.bookId = bookId;

  const [memories, total] = await Promise.all([
    prisma.memory.findMany({
      where,
      include: {
        photos: { take: 4, orderBy: { order: "asc" } },
        quickSnap: true,
        journalEntry: true,
        scrapPage: true,
        visionBoard: true,
        creativePost: true,
        tags: true,
      },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.memory.count({ where }),
  ]);

  return NextResponse.json({ memories, total, page, limit });
}

// POST /api/memories — create a memory
export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check tier limits
  const limits = getTierLimits(user.tier);
  if (limits.pagesPerMonth !== -1) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const count = await prisma.memory.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    });

    if (count >= limits.pagesPerMonth) {
      return NextResponse.json(
        { error: "Monthly page limit reached. Upgrade to Pro for unlimited pages." },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const {
    type,
    title,
    bookId,
    privacy = "PRIVATE",
    location,
    date,
    // Type-specific data
    quickSnap,
    journalEntry,
    scrapPage,
    visionBoard,
    creativePost,
    tags = [],
  } = body;

  // Build nested create based on type
  const typeData: Record<string, unknown> = {};
  if (type === "QUICK_SNAP" && quickSnap) {
    typeData.quickSnap = { create: quickSnap };
  } else if (type === "JOURNAL" && journalEntry) {
    typeData.journalEntry = { create: journalEntry };
  } else if (type === "SCRAPBOOK" && scrapPage) {
    typeData.scrapPage = { create: scrapPage };
  } else if (type === "FULL_MEMORY") {
    if (scrapPage) typeData.scrapPage = { create: scrapPage };
    if (journalEntry) typeData.journalEntry = { create: journalEntry };
  } else if (type === "VISION_BOARD" && visionBoard) {
    typeData.visionBoard = { create: visionBoard };
  } else if (type === "CREATIVE" && creativePost) {
    typeData.creativePost = { create: creativePost };
  }

  const memory = await prisma.memory.create({
    data: {
      userId: user.id,
      bookId: bookId || undefined,
      type,
      title,
      privacy,
      location,
      date: date ? new Date(date) : new Date(),
      ...typeData,
      tags: tags.length > 0 ? { createMany: { data: tags.map((t: string) => ({ name: t })) } } : undefined,
    },
    include: {
      photos: true,
      quickSnap: true,
      journalEntry: true,
      scrapPage: true,
      visionBoard: true,
      creativePost: true,
      tags: true,
    },
  });

  // Update streak
  const now = new Date();
  const lastStreak = user.streakLastAt;
  const isConsecutiveDay =
    lastStreak &&
    now.getTime() - lastStreak.getTime() < 48 * 60 * 60 * 1000 &&
    now.toDateString() !== lastStreak.toDateString();
  const isSameDay = lastStreak && now.toDateString() === lastStreak.toDateString();

  if (!isSameDay) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        streakCount: isConsecutiveDay ? user.streakCount + 1 : 1,
        streakLastAt: now,
      },
    });
  }

  return NextResponse.json({ memory }, { status: 201 });
}
