import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetId } = await request.json();
  if (!targetId || targetId === authUser.id) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: authUser.id, followingId: targetId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "unfollowed" });
  }

  await prisma.follow.create({
    data: { followerId: authUser.id, followingId: targetId },
  });

  // Notify
  const user = await prisma.user.findUnique({ where: { id: authUser.id }, select: { name: true } });
  await prisma.notification.create({
    data: {
      userId: targetId,
      type: "follow",
      title: `${user?.name} started following you`,
      fromId: authUser.id,
      linkType: "profile",
      linkId: authUser.id,
    },
  });

  return NextResponse.json({ action: "followed" });
}

export async function GET(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || authUser.id;

  const [followers, following] = await Promise.all([
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  let isFollowing = false;
  if (userId !== authUser.id) {
    const f = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: authUser.id, followingId: userId } },
    });
    isFollowing = !!f;
  }

  return NextResponse.json({ followers, following, isFollowing });
}
