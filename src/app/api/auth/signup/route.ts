import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ user: existing });
    }

    // Get Supabase auth user for ID
    const authUser = await getUser();

    const user = await prisma.user.create({
      data: {
        id: authUser?.id ?? undefined,
        email,
        name,
        memoryBooks: {
          create: {
            title: "My First Memory Book",
            isDefault: true,
          },
        },
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
