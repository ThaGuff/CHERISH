import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ memories: [] });

  const now = new Date();
  const memories = [];

  // Check 1-10 years back
  for (let yearsAgo = 1; yearsAgo <= 10; yearsAgo++) {
    const target = new Date(now);
    target.setFullYear(target.getFullYear() - yearsAgo);
    const dayBefore = new Date(target);
    dayBefore.setDate(dayBefore.getDate() - 1);
    const dayAfter = new Date(target);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const found = await prisma.memory.findMany({
      where: {
        userId: authUser.id,
        date: { gte: dayBefore, lte: dayAfter },
      },
      take: 3,
      include: {
        photos: { take: 1, orderBy: { order: "asc" } },
      },
    });

    if (found.length > 0) {
      memories.push({
        yearsAgo,
        date: target.toISOString(),
        items: found,
      });
    }
  }

  return NextResponse.json({ memories });
}
