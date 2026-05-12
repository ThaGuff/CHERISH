"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const typeIcons: Record<string, string> = {
  QUICK_SNAP: "⚡", JOURNAL: "📖", SCRAPBOOK: "🎨",
  FULL_MEMORY: "✨", VISION_BOARD: "🌀", CREATIVE: "✍️",
};
const typeLabels: Record<string, string> = {
  QUICK_SNAP: "Quick Snap", JOURNAL: "Journal", SCRAPBOOK: "Scrapbook",
  FULL_MEMORY: "Full Memory", VISION_BOARD: "Vision Board", CREATIVE: "Creative",
};

interface ExploreMemory {
  id: string; type: string; title: string; createdAt: string; location?: string;
  user: { id: string; name: string; username?: string; avatarUrl?: string };
  photos: { url: string }[];
  _count: { reactions: number };
}

const tabs = [
  { id: "all", label: "🏆 Spotlight", icon: "🏆" },
  { id: "scrapbooks", label: "🎨 Scrapbooks", icon: "🎨" },
  { id: "journals", label: "📖 Stories", icon: "📖" },
  { id: "creative", label: "✍️ Creative", icon: "✍️" },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [memories, setMemories] = useState<ExploreMemory[]>([]);
  const [spotlight, setSpotlight] = useState<ExploreMemory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/explore?tab=${activeTab}`)
      .then((r) => r.json())
      .then((data) => {
        setMemories(data.memories || []);
        setSpotlight(data.spotlight || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="page-container pt-6 animate-in">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl font-bold text-cherish-900">Explore</h1>
        <Link href="/home" className="text-xs text-cherish-500 font-medium">← Home</Link>
      </div>
      <p className="text-xs text-cherish-900/45 mb-5">
        Discover beautiful memories from the Cherish community.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto -mx-5 px-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-cherish-500 text-white shadow-md shadow-cherish-500/20"
                : "bg-white border border-cherish-300/40 text-cherish-900/50 hover:border-cherish-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Spotlight card */}
      {activeTab === "all" && spotlight && (
        <div className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-cherish-100 border border-amber-200/50 shadow-lg">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏆</span>
              <div>
                <p className="text-xs font-bold text-amber-700 tracking-wide uppercase">Creator of the Week</p>
                <p className="text-[10px] text-amber-600/60">Most loved this week</p>
              </div>
            </div>
            {spotlight.photos[0] && (
              <div className="w-full h-40 rounded-xl overflow-hidden mb-3 shadow-md">
                <img src={spotlight.photos[0].url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <p className="font-display text-lg font-bold text-cherish-900 mb-1">{spotlight.title}</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cherish-300 to-cherish-400 flex items-center justify-center text-[10px] font-bold text-white">
                {spotlight.user.name.charAt(0)}
              </div>
              <span className="text-xs text-cherish-900/60">
                {spotlight.user.username ? `@${spotlight.user.username}` : spotlight.user.name}
              </span>
              <span className="text-xs text-cherish-900/30">·</span>
              <span className="text-xs text-red-500">❤️ {spotlight._count.reactions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Memory Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-32 bg-cherish-100 rounded-xl mb-3" />
              <div className="h-4 bg-cherish-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-cherish-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-4xl block mb-3">🌍</span>
          <p className="text-sm font-medium text-cherish-900/60 mb-1">No public memories yet</p>
          <p className="text-xs text-cherish-900/30 mb-4">
            Be the first! Set a memory to &quot;Public&quot; when creating it.
          </p>
          <Link href="/home" className="btn-primary inline-block text-sm">Create Something</Link>
        </div>
      ) : (
        <div className="space-y-4 stagger-in">
          {memories.map((m) => (
            <div key={m.id} className="card-hover overflow-hidden !p-0">
              {m.photos[0] && (
                <div className="w-full h-44 overflow-hidden">
                  <img src={m.photos[0].url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cherish-300 to-cherish-400 flex items-center justify-center text-[10px] font-bold text-white">
                    {m.user.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-medium text-cherish-900">
                      {m.user.username ? `@${m.user.username}` : m.user.name}
                    </span>
                    <span className="text-[10px] text-cherish-900/30 ml-1.5">
                      · {typeLabels[m.type]}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-cherish-900 mb-1">{m.title}</p>
                {m.location && (
                  <p className="text-[10px] text-cherish-900/35 mb-2">📍 {m.location}</p>
                )}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-xs text-cherish-900/40 hover:text-red-500 transition-colors">
                    ❤️ {m._count.reactions}
                  </button>
                  <span className="text-[10px] text-cherish-900/25">
                    {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
