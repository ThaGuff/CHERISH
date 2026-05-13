import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { memoryId, boardName } = await request.json();

  const existing = await prisma.savedMemory.findUnique({
    where: { userId_memoryId: { userId: authUser.id, memoryId } },
  });

  if (existing) {
    await prisma.savedMemory.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "unsaved" });
  }

  await prisma.savedMemory.create({
    data: { userId: authUser.id, memoryId, boardName: boardName || "Saved" },
  });

  return NextResponse.json({ action: "saved" });
}

export async function GET() {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await prisma.savedMemory.findMany({
    where: { userId: authUser.id },
    include: {
      memory: {
        include: {
          user: { select: { name: true, username: true, avatarUrl: true } },
          photos: { take: 1 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by board
  const boards: Record<string, typeof saved> = {};
  saved.forEach((s) => {
    if (!boards[s.boardName]) boards[s.boardName] = [];
    boards[s.boardName].push(s);
  });

  return NextResponse.json({ saved, boards });
}
