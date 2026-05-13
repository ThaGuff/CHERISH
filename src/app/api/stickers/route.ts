import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/stickers — list all sticker packs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const packId = searchParams.get("packId");

  // Single pack detail
  if (packId) {
    const pack = await prisma.stickerPack.findUnique({
      where: { id: packId },
      include: { stickers: true, _count: { select: { stickers: true } } },
    });
    return NextResponse.json({ pack });
  }

  // List all packs
  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = category;

  const packs = await prisma.stickerPack.findMany({
    where,
    include: {
      stickers: { take: 6 },
      _count: { select: { stickers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.stickerPack.findMany({
    where: { isActive: true },
    select: { category: true },
    distinct: ["category"],
  });

  return NextResponse.json({
    packs,
    categories: categories.map((c) => c.category),
  });
}
