import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const authUser = await getUser();
  if (!authUser) return null;
  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

// GET /api/admin — dashboard stats
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [
    totalUsers,
    proUsers,
    totalMemories,
    memoriesThisMonth,
    recentUsers,
    memoryBreakdown,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: { not: "FREE" } } }),
    prisma.memory.count(),
    prisma.memory.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, tier: true, createdAt: true },
    }),
    prisma.memory.groupBy({
      by: ["type"],
      _count: true,
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalUsers,
      proUsers,
      conversionRate: totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0",
      totalMemories,
      memoriesThisMonth,
    },
    recentUsers,
    memoryBreakdown: memoryBreakdown.map((m) => ({
      type: m.type,
      count: m._count,
    })),
  });
}
