import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();

  // Auto-unlock any capsules that have reached their date
  await prisma.timeCapsule.updateMany({
    where: { userId: authUser.id, unlocksAt: { lte: now }, isUnlocked: false },
    data: { isUnlocked: true, unlockedAt: now },
  });

  const capsules = await prisma.timeCapsule.findMany({
    where: { userId: authUser.id },
    orderBy: { unlocksAt: "asc" },
  });

  const locked = capsules.filter((c) => !c.isUnlocked);
  const unlocked = capsules.filter((c) => c.isUnlocked);

  return NextResponse.json({ locked, unlocked, total: capsules.length });
}

export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, recipient, message, photoUrls, unlocksAt } = await request.json();

  if (!unlocksAt) return NextResponse.json({ error: "Unlock date required" }, { status: 400 });

  const capsule = await prisma.timeCapsule.create({
    data: {
      userId: authUser.id,
      title: title || "Time Capsule",
      recipient: recipient || "Future me",
      message,
      photoUrls: photoUrls || [],
      unlocksAt: new Date(unlocksAt),
    },
  });

  return NextResponse.json({ capsule }, { status: 201 });
}
