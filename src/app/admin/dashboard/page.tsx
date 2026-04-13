export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    totalUsers,
    proUsers,
    totalMemories,
    memoriesThisMonth,
    recentUsers,
    memoryBreakdown,
    totalBooks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: { not: "FREE" } } }),
    prisma.memory.count(),
    prisma.memory.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        createdAt: true,
        _count: { select: { memories: true } },
      },
    }),
    prisma.memory.groupBy({
      by: ["type"],
      _count: true,
    }),
    prisma.memoryBook.count(),
  ]);

  const conversionRate =
    totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0";

  const stats = [
    { label: "Total Users", value: totalUsers, icon: "👥" },
    { label: "Pro Subscribers", value: proUsers, icon: "⭐" },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: "📈" },
    { label: "Total Memories", value: totalMemories, icon: "💾" },
    { label: "This Month", value: memoriesThisMonth, icon: "📅" },
    { label: "Memory Books", value: totalBooks, icon: "📚" },
  ];

  const typeLabels: Record<string, string> = {
    QUICK_SNAP: "Quick Snap",
    JOURNAL: "Journal",
    SCRAPBOOK: "Scrapbook",
    FULL_MEMORY: "Full Memory",
    VISION_BOARD: "Vision Board",
    CREATIVE: "Creative",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Memory Type Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Memory Type Breakdown
          </h2>
          <div className="space-y-3">
            {memoryBreakdown.map((m) => {
              const pct =
                totalMemories > 0
                  ? Math.round((m._count / totalMemories) * 100)
                  : 0;
              return (
                <div key={m.type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">
                      {typeLabels[m.type] || m.type}
                    </span>
                    <span className="text-gray-400">
                      {m._count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cherish-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {memoryBreakdown.length === 0 && (
              <p className="text-xs text-gray-400">No memories created yet.</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Recent Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Tier</th>
                  <th className="pb-2 font-medium">Memories</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-2">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-gray-400 text-[10px]">{u.email}</p>
                    </td>
                    <td className="py-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          u.tier !== "FREE"
                            ? "bg-cherish-100 text-cherish-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.tier}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">{u._count.memories}</td>
                    <td className="py-2 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
