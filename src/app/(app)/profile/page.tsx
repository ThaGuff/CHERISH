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
      _count: { select: { memories: true, memoryBooks: true, voiceMemos: true } },
      memories: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  if (!user) redirect("/login");

  const currentPlan = PLANS[user.tier as keyof typeof PLANS] || PLANS.FREE;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const lastActive = user.memories[0]
    ? new Date(user.memories[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "Never";

  return (
    <div className="page-container pt-6 animate-in">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cherish-200 via-cherish-300 to-cherish-400 mx-auto mb-3 flex items-center justify-center text-4xl font-display font-bold text-white shadow-lg shadow-cherish-500/20">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="font-display text-xl font-bold text-cherish-900">{user.name}</h1>
        <p className="text-xs text-cherish-900/40">{user.email}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {user.tier !== "FREE" && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cherish-500 to-cherish-600 text-white">
              {currentPlan.name}
            </span>
          )}
          {user.role === "ADMIN" && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { value: user._count.memories, label: "Memories" },
          { value: user._count.memoryBooks, label: "Books" },
          { value: user.streakCount, label: "Streak 🔥" },
          { value: lastActive, label: "Last Active" },
        ].map((stat) => (
          <div key={stat.label} className="card text-center !p-2.5">
            <p className="text-lg font-bold text-cherish-900">{stat.value}</p>
            <p className="text-[9px] text-cherish-900/40 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Current Plan */}
      <div className="card mb-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="label-upper mb-0.5">Current Plan</p>
            <p className="text-lg font-bold text-cherish-900">{currentPlan.name}</p>
            <p className="text-xs text-cherish-900/40">
              {currentPlan.price > 0 ? `$${(currentPlan.price / 100).toFixed(2)}/mo` : "Free forever"}
            </p>
          </div>
          {user.tier === "FREE" && (
            <button className="btn-primary text-xs !py-2 !px-4 !rounded-full">
              Upgrade →
            </button>
          )}
        </div>
        <div className="border-t border-cherish-300/20 pt-3">
          <ul className="grid grid-cols-2 gap-1.5">
            {currentPlan.features.map((f) => (
              <li key={f} className="text-[10px] text-cherish-900/50 flex items-start gap-1">
                <span className="text-cherish-500 mt-0.5 flex-shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Account Info */}
      <div className="card mb-4">
        <p className="label-upper mb-2">Account</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-cherish-900/50">Member since</span>
            <span className="text-cherish-900 font-medium">{memberSince}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cherish-900/50">Theme</span>
            <span className="text-cherish-900 font-medium">{user.theme}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cherish-900/50">Interests</span>
            <span className="text-cherish-900 font-medium text-right max-w-[180px] truncate">
              {user.useCases.length > 0 ? user.useCases.join(", ") : "Not set"}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Links */}
      <div className="space-y-1.5 mb-4">
        {[
          { label: "Edit Profile", icon: "👤", desc: "Name, email, avatar" },
          { label: "Notifications", icon: "🔔", desc: "On This Day, reminders" },
          { label: "Privacy & Security", icon: "🔒", desc: "Password, data export" },
          { label: "Export All Data", icon: "📥", desc: "Download as PDF or JSON" },
          { label: "Help & Support", icon: "💬", desc: "FAQs, contact us" },
        ].map((item) => (
          <div key={item.label} className="card-hover flex items-center gap-3 !p-3">
            <span className="text-lg w-8 text-center">{item.icon}</span>
            <div className="flex-1">
              <span className="text-sm font-medium text-cherish-900">{item.label}</span>
              <p className="text-[10px] text-cherish-900/30">{item.desc}</p>
            </div>
            <span className="text-cherish-900/15">›</span>
          </div>
        ))}
      </div>

      {/* Admin */}
      {user.role === "ADMIN" && (
        <Link href="/admin/dashboard" className="card-hover flex items-center gap-3 !p-3 mb-4 !border-red-200 !bg-red-50/50">
          <span className="text-lg w-8 text-center">⚙️</span>
          <div className="flex-1">
            <span className="text-sm font-medium text-red-700">Admin Dashboard</span>
            <p className="text-[10px] text-red-400">Users, stats, content management</p>
          </div>
          <span className="text-red-300">›</span>
        </Link>
      )}

      {/* Logout */}
      <form action="/api/auth/logout" method="POST">
        <button type="submit" className="w-full text-center text-sm text-red-500 py-4 hover:text-red-600 transition-colors">
          Sign Out
        </button>
      </form>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
