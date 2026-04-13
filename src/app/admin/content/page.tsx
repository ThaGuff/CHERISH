export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function AdminContentPage() {
  const [templates, stickerPacks, totalMemories] = await Promise.all([
    prisma.scrapbookTemplate.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.stickerPack.findMany({
      include: { _count: { select: { stickers: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.memory.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Content Management
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pre-built Templates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">
              Scrapbook Templates
            </h2>
            <button className="text-xs font-medium text-cherish-500 hover:text-cherish-600">
              + Add Template
            </button>
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl block mb-2">🎨</span>
              <p className="text-xs text-gray-400 mb-3">
                No templates yet. Create pre-built scrapbook templates for
                users.
              </p>
              <p className="text-[10px] text-gray-300">
                Categories: vacation, birthday, holiday, baby, wedding, everyday
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg"
                >
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-lg">
                    🖼️
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t.category}
                      {t.isPremium && " · Premium"}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      t.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {t.isActive ? "ACTIVE" : "DRAFT"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticker Packs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Sticker Packs</h2>
            <button className="text-xs font-medium text-cherish-500 hover:text-cherish-600">
              + Add Pack
            </button>
          </div>

          {stickerPacks.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl block mb-2">⭐</span>
              <p className="text-xs text-gray-400 mb-3">
                No sticker packs yet. Upload sticker packs for users.
              </p>
              <p className="text-[10px] text-gray-300">
                Categories: travel, holiday, baby, wedding, seasonal, everyday
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stickerPacks.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg"
                >
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-lg">
                    ⭐
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {p._count.stickers} stickers · {p.category}
                      {p.isPremium && " · Premium"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* UGC Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">
          📊 User Generated Content Strategy
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-amber-50 rounded-xl">
            <h3 className="text-xs font-bold text-amber-800 mb-1">
              🏆 Community Challenges
            </h3>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Weekly themed challenges (e.g., &quot;Sunday Scrapbook&quot;,
              &quot;Throwback Thursday&quot;). Users opt in to share entries
              publicly. Top picks featured on a community showcase page.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <h3 className="text-xs font-bold text-blue-800 mb-1">
              📐 User Template Marketplace
            </h3>
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Let Pro users design and sell custom templates. Revenue split
              70/30 (creator/platform). Drives engagement and creates a
              creator economy within the app.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <h3 className="text-xs font-bold text-green-800 mb-1">
              🔗 Public Memory Books
            </h3>
            <p className="text-[11px] text-green-700 leading-relaxed">
              Optional public sharing via unique links. Travel bloggers share
              trip books as content. Creates organic discovery and SEO
              traffic. Private by default — always opt-in.
            </p>
          </div>
        </div>
      </div>

      {/* Platform health */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">
          Platform Health
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{totalMemories}</p>
            <p className="text-[10px] text-gray-400">Total Memories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {templates.length}
            </p>
            <p className="text-[10px] text-gray-400">Templates</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {stickerPacks.length}
            </p>
            <p className="text-[10px] text-gray-400">Sticker Packs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">✓</p>
            <p className="text-[10px] text-gray-400">System Healthy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
