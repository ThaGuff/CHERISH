import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

// POST /api/reactions — add a love or comment
export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { memoryId, type, comment } = await request.json();

  if (!memoryId) return NextResponse.json({ error: "memoryId required" }, { status: 400 });

  // Check the memory is public or user has access
  const memory = await prisma.memory.findUnique({
    where: { id: memoryId },
    select: { privacy: true, userId: true },
  });

  if (!memory) return NextResponse.json({ error: "Memory not found" }, { status: 404 });
  if (memory.privacy !== "PUBLIC" && memory.userId !== authUser.id) {
    return NextResponse.json({ error: "Cannot react to private memory" }, { status: 403 });
  }

  // For loves — toggle (add if not exists, remove if exists)
  if (type === "love") {
    const existing = await prisma.reaction.findFirst({
      where: { memoryId, userId: authUser.id, type: "love" },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }

    await prisma.reaction.create({
      data: { memoryId, userId: authUser.id, type: "love" },
    });
    return NextResponse.json({ action: "added" });
  }

  // For comments
  if (type === "comment" && comment) {
    await prisma.reaction.create({
      data: { memoryId, userId: authUser.id, type: "comment", comment },
    });
    return NextResponse.json({ action: "commented" });
  }

  return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
}

// GET /api/reactions?memoryId=xxx — get reactions for a memory
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memoryId = searchParams.get("memoryId");

  if (!memoryId) return NextResponse.json({ error: "memoryId required" }, { status: 400 });

  const [loveCount, comments] = await Promise.all([
    prisma.reaction.count({ where: { memoryId, type: "love" } }),
    prisma.reaction.findMany({
      where: { memoryId, type: "comment" },
      include: { user: { select: { name: true, username: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return NextResponse.json({ loveCount, comments });
}
