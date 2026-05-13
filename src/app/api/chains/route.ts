import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "mine";

  const where = filter === "mine"
    ? { OR: [{ hostId: authUser.id }, { entries: { some: { userId: authUser.id } } }] }
    : { isOpen: true, privacy: "PUBLIC" as const };

  const chains = await prisma.chain.findMany({
    where,
    include: {
      host: { select: { id: true, name: true, username: true, avatarUrl: true } },
      entries: { include: { user: { select: { name: true, avatarUrl: true } } }, orderBy: { order: "asc" } },
      _count: { select: { entries: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ chains });
}

export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, maxSlots, deadline, privacy } = await request.json();

  const chain = await prisma.chain.create({
    data: {
      hostId: authUser.id,
      title: title || "New Memory Chain",
      description,
      maxSlots: maxSlots || 20,
      deadline: deadline ? new Date(deadline) : null,
      privacy: privacy || "FAMILY_CIRCLE",
    },
  });

  // Notify — create notification for chain creation
  await prisma.notification.create({
    data: {
      userId: authUser.id,
      type: "chain_create",
      title: "You started a chain",
      body: title,
      linkType: "chain",
      linkId: chain.id,
    },
  });

  return NextResponse.json({ chain }, { status: 201 });
}

export async function PATCH(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chainId, note, photoUrl } = await request.json();

  const chain = await prisma.chain.findUnique({ where: { id: chainId } });
  if (!chain) return NextResponse.json({ error: "Chain not found" }, { status: 404 });

  const entryCount = await prisma.chainEntry.count({ where: { chainId } });
  if (entryCount >= chain.maxSlots) {
    return NextResponse.json({ error: "Chain is full" }, { status: 403 });
  }

  const entry = await prisma.chainEntry.create({
    data: {
      chainId,
      userId: authUser.id,
      note,
      photoUrl,
      order: entryCount,
    },
  });

  // Notify chain host
  if (chain.hostId !== authUser.id) {
    const user = await prisma.user.findUnique({ where: { id: authUser.id }, select: { name: true } });
    await prisma.notification.create({
      data: {
        userId: chain.hostId,
        type: "chain_add",
        title: `${user?.name} added to "${chain.title}"`,
        fromId: authUser.id,
        linkType: "chain",
        linkId: chainId,
      },
    });
  }

  return NextResponse.json({ entry }, { status: 201 });
}
