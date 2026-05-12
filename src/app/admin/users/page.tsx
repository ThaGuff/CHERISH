export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      _count: { select: { memories: true, memoryBooks: true } },
      subscriptions: {
        where: { status: "active" },
        take: 1,
        select: { stripePriceId: true, currentPeriodEnd: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-400">{users.length} users total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Memories</th>
              <th className="px-4 py-3 font-medium">Books</th>
              <th className="px-4 py-3 font-medium">Streak</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cherish-200 flex items-center justify-center text-xs font-bold text-cherish-600">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-[10px] text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.tier === "FREE"
                        ? "bg-gray-100 text-gray-500"
                        : u.tier === "FOUNDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-cherish-100 text-cherish-600"
                    }`}
                  >
                    {u.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role === "ADMIN" ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      ADMIN
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">User</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {u._count.memories}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {u._count.memoryBooks}
                </td>
                <td className="px-4 py-3">
                  {u.streakCount > 0 ? (
                    <span className="text-xs">🔥 {u.streakCount}</span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
