import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authUser = await getUser();
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const typeFilter: Record<string, string[]> = {
    all: [],
    scrapbooks: ["SCRAPBOOK", "FULL_MEMORY"],
    journals: ["JOURNAL"],
    creative: ["CREATIVE", "VISION_BOARD"],
  };

  const where: Record<string, unknown> = {
    privacy: "PUBLIC",
  };

  if (typeFilter[tab]?.length > 0) {
    where.type = { in: typeFilter[tab] };
  }

  const [memories, total] = await Promise.all([
    prisma.memory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
        photos: { take: 1, orderBy: { order: "asc" } },
        _count: { select: { reactions: true } },
      },
    }),
    prisma.memory.count({ where }),
  ]);

  // Spotlight — most loved public memory this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const spotlight = await prisma.memory.findFirst({
    where: {
      privacy: "PUBLIC",
      createdAt: { gte: weekAgo },
    },
    orderBy: { reactions: { _count: "desc" } },
    include: {
      user: {
        select: { id: true, name: true, username: true, avatarUrl: true },
      },
      photos: { take: 1 },
      _count: { select: { reactions: true } },
    },
  });

  return NextResponse.json({
    memories,
    total,
    page,
    spotlight,
    userId: authUser?.id || null,
  });
}
