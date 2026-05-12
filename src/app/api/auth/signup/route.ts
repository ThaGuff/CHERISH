import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ user: existing });

    const authUser = await getUser();
    const user = await prisma.user.create({
      data: {
        id: authUser?.id ?? undefined,
        email,
        name,
        memoryBooks: {
          create: { title: "My First Memory Book", isDefault: true },
        },
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authUser = await getUser();
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { theme, useCases, onboarded, tier } = body;
    const data: Record<string, unknown> = {};
    if (theme !== undefined) data.theme = theme;
    if (useCases !== undefined) data.useCases = useCases;
    if (onboarded !== undefined) data.onboarded = onboarded;
    if (tier !== undefined) data.tier = tier;

    const user = await prisma.user.update({ where: { id: authUser.id }, data });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
