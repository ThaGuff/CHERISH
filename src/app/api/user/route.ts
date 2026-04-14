import { prisma } from "@/lib/prisma";
import { getUser, createSupabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

// GET /api/user — get current user profile
export async function GET() {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      _count: { select: { memories: true, memoryBooks: true, voiceMemos: true } },
      memoryBooks: { orderBy: { updatedAt: "desc" } },
    },
  });

  return NextResponse.json({ user });
}

// PATCH /api/user — update profile
export async function PATCH(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, theme, useCases, avatarUrl } = body;
  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (theme !== undefined) data.theme = theme;
  if (useCases !== undefined) data.useCases = useCases;
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;

  const user = await prisma.user.update({ where: { id: authUser.id }, data });
  return NextResponse.json({ user });
}

// DELETE /api/user — export data and account info
export async function DELETE() {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Export all user data
  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      memoryBooks: true,
      memories: {
        include: {
          photos: true,
          quickSnap: true,
          journalEntry: true,
          scrapPage: true,
          visionBoard: true,
          creativePost: true,
          tags: true,
          voiceMemos: true,
        },
      },
    },
  });

  return NextResponse.json({ export: user });
}
