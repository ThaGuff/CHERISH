import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { getTierLimits } from "@/lib/tier-limits";

// GET /api/books
export async function GET() {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const books = await prisma.memoryBook.findMany({
    where: { userId: authUser.id },
    include: { _count: { select: { memories: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ books });
}

// POST /api/books — create new book
export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const limits = getTierLimits(user.tier);
  if (limits.maxBooks !== -1) {
    const count = await prisma.memoryBook.count({ where: { userId: user.id } });
    if (count >= limits.maxBooks) {
      return NextResponse.json({ error: "Book limit reached. Upgrade to Pro for unlimited books." }, { status: 403 });
    }
  }

  const { title, coverColor, theme } = await request.json();

  const book = await prisma.memoryBook.create({
    data: {
      userId: user.id,
      title: title || "New Memory Book",
      coverColor: coverColor || "#c84820",
      theme: theme || user.theme,
    },
  });

  return NextResponse.json({ book }, { status: 201 });
}

// PATCH /api/books — update a book
export async function PATCH(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, coverColor } = await request.json();

  const book = await prisma.memoryBook.updateMany({
    where: { id, userId: authUser.id },
    data: { title, coverColor },
  });

  return NextResponse.json({ book });
}
