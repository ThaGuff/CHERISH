export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { PLANS } from "@/lib/stripe";
import Link from "next/link";

export default async function ProfilePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      _count: { select: { memories: true, memoryBooks: true } },
      subscriptions: { where: { status: "active" }, take: 1 },
    },
  });

  if (!user) redirect("/signup");

  const currentPlan = PLANS[user.tier as keyof typeof PLANS] || PLANS.FREE;

  return (
    <div className="page-container pt-6 animate-in">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cherish-200 to-cherish-300 mx-auto mb-3 flex items-center justify-center text-3xl font-display font-bold text-cherish-600">
          {user.name.charAt(0)}
        </div>
        <h1 className="font-display text-xl font-bold text-cherish-900">
          {user.name}
        </h1>
        <p className="text-xs text-cherish-900/40">{user.email}</p>
        {user.tier !== "FREE" && (
          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cherish-500 text-white">
            {currentPlan.name}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card text-center !p-3">
          <p className="text-xl font-bold text-cherish-900">
            {user._count.memories}
          </p>
          <p className="text-[10px] text-cherish-900/40">Memories</p>
        </div>
        <div className="card text-center !p-3">
          <p className="text-xl font-bold text-cherish-900">
            {user._count.memoryBooks}
          </p>
          <p className="text-[10px] text-cherish-900/40">Books</p>
        </div>
        <div className="card text-center !p-3">
          <p className="text-xl font-bold text-cherish-900">
            {user.streakCount}
          </p>
          <p className="text-[10px] text-cherish-900/40">Day Streak</p>
        </div>
      </div>

      {/* Current Plan */}
      <div className="card mb-4">
        <p className="label-upper mb-2">Current Plan</p>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-base font-bold text-cherish-900">
              {currentPlan.name}
            </p>
            <p className="text-xs text-cherish-900/40">
              ${(currentPlan.price / 100).toFixed(2)}
              {currentPlan.price > 0 ? "/mo" : ""}
            </p>
          </div>
          {user.tier === "FREE" && (
            <button className="btn-primary text-xs !py-2 !px-4">
              Upgrade
            </button>
          )}
        </div>
        <ul className="space-y-1">
          {currentPlan.features.map((f) => (
            <li key={f} className="text-[11px] text-cherish-900/50 flex items-start gap-1.5">
              <span className="text-cherish-500 mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Settings Links */}
      <div className="space-y-1.5 mb-6">
        {[
          { label: "Edit Profile", icon: "👤" },
          { label: "Notification Settings", icon: "🔔" },
          { label: "Privacy & Security", icon: "🔒" },
          { label: "Export Data", icon: "📥" },
          { label: "Help & Support", icon: "💬" },
        ].map((item) => (
          <div
            key={item.label}
            className="card-hover flex items-center gap-3 !p-3"
          >
            <span>{item.icon}</span>
            <span className="text-sm text-cherish-900 flex-1">
              {item.label}
            </span>
            <span className="text-cherish-900/20">›</span>
          </div>
        ))}
      </div>

      {/* Admin link */}
      {user.role === "ADMIN" && (
        <Link
          href="/admin/dashboard"
          className="card-hover flex items-center gap-3 !p-3 mb-4 !border-red-200 !bg-red-50"
        >
          <span>⚙️</span>
          <span className="text-sm text-red-700 flex-1 font-medium">
            Admin Dashboard
          </span>
          <span className="text-red-300">›</span>
        </Link>
      )}

      {/* Logout */}
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="w-full text-center text-sm text-red-500 py-3"
        >
          Sign Out
        </button>
      </form>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
