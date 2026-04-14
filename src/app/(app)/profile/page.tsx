export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { PLANS } from "@/lib/stripe";
import Link from "next/link";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      _count: { select: { memories: true, memoryBooks: true, voiceMemos: true } },
      memories: {
        select: { type: true },
      },
      memoryBooks: { select: { id: true, title: true } },
    },
  });

  if (!user) redirect("/login");

  const currentPlan = PLANS[user.tier as keyof typeof PLANS] || PLANS.FREE;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Memory type breakdown
  const breakdown: Record<string, number> = {};
  user.memories.forEach((m) => {
    breakdown[m.type] = (breakdown[m.type] || 0) + 1;
  });

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        tier: user.tier,
        role: user.role,
        theme: user.theme,
        streakCount: user.streakCount,
        useCases: user.useCases,
        avatarUrl: user.avatarUrl,
        memberSince,
        totalMemories: user._count.memories,
        totalBooks: user._count.memoryBooks,
        totalVoiceMemos: user._count.voiceMemos,
        breakdown,
      }}
      plan={currentPlan}
    />
  );
}
