export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { role: true, name: true },
  });

  if (!user || user.role !== "ADMIN") redirect("/home");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/home"
            className="font-display text-xl font-bold text-cherish-500"
          >
            Cherish.
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-2 py-0.5 rounded">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Users
          </Link>
          <Link
            href="/admin/content"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Content
          </Link>
          <Link href="/home" className="text-sm text-cherish-500">
            ← Back to App
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
