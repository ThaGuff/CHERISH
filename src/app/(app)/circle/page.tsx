import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function CirclePage() {
  const authUser = await getUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { tier: true },
  });

  const memberships = await prisma.familyCircleMember.findMany({
    where: { userId: authUser.id },
    include: {
      circle: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          },
          shared: {
            take: 10,
            orderBy: { sharedAt: "desc" },
            include: {
              memory: { select: { id: true, title: true, type: true } },
              user: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  const isPro = user?.tier !== "FREE";

  return (
    <div className="page-container pt-6 animate-in">
      <h1 className="font-display text-2xl font-bold text-cherish-900 mb-1">
        Family Circle
      </h1>
      <p className="text-xs text-cherish-900/50 mb-6">
        Share memories with your closest people.
      </p>

      {!isPro && (
        <div className="card bg-gradient-to-br from-cherish-100 to-amber-50 mb-6 text-center">
          <span className="text-3xl block mb-2">👨‍👩‍👧</span>
          <p className="text-sm font-medium text-cherish-900 mb-1">
            Family Circle is a Pro feature
          </p>
          <p className="text-xs text-cherish-900/50 mb-3">
            Upgrade to share memories, react with love, and comment.
          </p>
          <a href="/profile" className="btn-primary inline-block text-sm">
            Upgrade to Pro
          </a>
        </div>
      )}

      {isPro && memberships.length === 0 && (
        <div className="card text-center py-8">
          <span className="text-3xl block mb-2">👨‍👩‍👧</span>
          <p className="text-sm font-medium text-cherish-900 mb-1">
            No circles yet
          </p>
          <p className="text-xs text-cherish-900/40 mb-4">
            Create a family circle and invite your people.
          </p>
          <button className="btn-primary text-sm">Create a Circle</button>
        </div>
      )}

      {isPro &&
        memberships.map(({ circle }) => (
          <div key={circle.id} className="card mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-cherish-900">
                {circle.name}
              </h2>
              <span className="text-[10px] text-cherish-900/40">
                {circle.members.length} members
              </span>
            </div>

            {/* Members */}
            <div className="flex -space-x-2 mb-4">
              {circle.members.map(({ user: member }) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full bg-cherish-200 border-2 border-white flex items-center justify-center text-xs font-bold text-cherish-700"
                  title={member.name}
                >
                  {member.name.charAt(0)}
                </div>
              ))}
              <button className="w-8 h-8 rounded-full bg-cherish-100 border-2 border-white border-dashed flex items-center justify-center text-xs text-cherish-400">
                +
              </button>
            </div>

            {/* Shared Feed */}
            <p className="label-upper mb-2">Shared Memories</p>
            {circle.shared.length === 0 ? (
              <p className="text-xs text-cherish-900/30 py-2">
                No shared memories yet. Share something!
              </p>
            ) : (
              <div className="space-y-1.5">
                {circle.shared.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2 py-1.5 border-b border-cherish-300/20 last:border-0"
                  >
                    <span className="text-xs font-medium text-cherish-900">
                      {s.user.name}
                    </span>
                    <span className="text-[10px] text-cherish-900/30">shared</span>
                    <span className="text-xs text-cherish-700 flex-1 truncate">
                      {s.memory.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
