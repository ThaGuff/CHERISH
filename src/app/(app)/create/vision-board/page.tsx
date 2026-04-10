"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const canvasTypes = [
  { id: "free_canvas", icon: "🎨", name: "Free Canvas", desc: "No rules. Pure creative freedom." },
  { id: "vision_board", icon: "🌟", name: "Vision Board", desc: "Goals, dreams, and aspirations." },
  { id: "magazine_collage", icon: "📰", name: "Magazine Collage", desc: "Cut-and-paste magazine style." },
  { id: "photo_collage", icon: "📸", name: "Photo Collage", desc: "Photos layered and overlapping." },
  { id: "goal_board", icon: "🎯", name: "Goal Board", desc: "Track and visualize your goals." },
];

const powerWords = ["DREAM", "CREATE", "BELIEVE", "INSPIRE", "GROW", "SHINE", "BOLD", "RISE", "THRIVE", "LOVE"];
const feelingWords = ["Grateful", "Excited", "Peaceful", "Hopeful", "Proud", "Free", "Alive", "Joyful"];
const goalPhrases = ["This year I will...", "I am becoming...", "My next chapter:", "I choose to..."];

export default function VisionBoardPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [elements, setElements] = useState<{ id: string; type: string; content: string; x: number; y: number; rotation: number }[]>([]);
  const [saving, setSaving] = useState(false);

  function addWord(word: string, type: string) {
    setElements((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}-${Math.random()}`,
        type,
        content: word,
        x: 20 + Math.random() * 200,
        y: 50 + Math.random() * 250,
        rotation: Math.random() * 30 - 15,
      },
    ]);
  }

  function shuffle() {
    setElements((prev) =>
      prev.map((el) => ({
        ...el,
        x: Math.random() * 250,
        y: Math.random() * 300,
        rotation: Math.random() * 40 - 20,
      }))
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "VISION_BOARD",
          title: `${canvasTypes.find((t) => t.id === selectedType)?.name || "Vision Board"}`,
          visionBoard: {
            canvasType: selectedType,
            canvasData: { elements },
          },
        }),
      });
      router.push("/home");
    } finally {
      setSaving(false);
    }
  }

  if (!selectedType) {
    return (
      <div className="page-container pt-6 animate-in">
        <Link href="/home" className="inline-flex items-center gap-1 text-xs text-vision-text mb-4">‹ Home</Link>
        <h1 className="font-display text-xl font-bold text-cherish-900 mb-1">Vision Board & Collage</h1>
        <p className="text-xs text-cherish-900/50 mb-5">Choose your canvas style.</p>
        <div className="flex flex-col gap-2">
          {canvasTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className="flex items-center gap-3 p-3 rounded-card border-[1.5px] border-vision-border bg-vision-light text-left transition-all hover:-translate-y-0.5"
            >
              <span className="text-xl w-8 text-center">{t.icon}</span>
              <div>
                <div className="text-[13px] font-medium text-vision-text">{t.name}</div>
                <div className="text-[10px] text-vision-text/70">{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="bottom-nav-spacer" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cherish-50 flex flex-col">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button onClick={() => setSelectedType(null)} className="text-xs text-vision-text">‹ Back</button>
        <span className="font-display text-sm font-bold text-cherish-900">
          {canvasTypes.find((t) => t.id === selectedType)?.name}
        </span>
        <button onClick={handleSave} disabled={saving} className="text-xs font-medium text-white bg-vision-text px-3 py-1.5 rounded-lg">
          {saving ? "..." : "Save"}
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 mx-4 rounded-2xl border-2 border-dashed border-vision-border bg-vision-light relative overflow-hidden min-h-[350px]">
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute select-none cursor-move"
            style={{
              left: el.x,
              top: el.y,
              transform: `rotate(${el.rotation}deg)`,
            }}
          >
            {el.type === "power" && (
              <span className="text-2xl font-black text-cherish-500 tracking-tight">{el.content}</span>
            )}
            {el.type === "feeling" && (
              <span className="text-base font-hand text-cherish-700 italic">{el.content}</span>
            )}
            {el.type === "goal" && (
              <span className="text-sm font-body bg-white/80 backdrop-blur px-2 py-1 rounded-lg text-cherish-900 shadow-sm">{el.content}</span>
            )}
          </div>
        ))}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-vision-text/30">
            <span className="text-4xl mb-2">🌀</span>
            <p className="text-sm font-medium">Your canvas awaits</p>
            <p className="text-xs">Add words, photos & more below</p>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="border-t border-cherish-300/30 bg-white p-3 space-y-3 max-h-56 overflow-y-auto">
        <div className="flex gap-2">
          <button onClick={shuffle} className="px-3 py-1.5 rounded-lg bg-vision-light border border-vision-border text-[11px] font-medium text-vision-text">
            🔀 Shuffle Chaos
          </button>
          <button onClick={() => setElements([])} className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-[11px] font-medium text-red-600">
            🗑️ Clear
          </button>
        </div>

        <div>
          <p className="label-upper mb-1">Power Words</p>
          <div className="flex flex-wrap gap-1">
            {powerWords.map((w) => (
              <button key={w} onClick={() => addWord(w, "power")} className="px-2 py-1 rounded bg-cherish-500/10 text-[11px] font-bold text-cherish-500 hover:bg-cherish-500/20 transition-colors">
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label-upper mb-1">Feelings</p>
          <div className="flex flex-wrap gap-1">
            {feelingWords.map((w) => (
              <button key={w} onClick={() => addWord(w, "feeling")} className="px-2 py-1 rounded bg-purple-50 text-[11px] font-medium text-purple-600 hover:bg-purple-100 transition-colors">
                {w}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label-upper mb-1">Goal Phrases</p>
          <div className="flex flex-wrap gap-1">
            {goalPhrases.map((w) => (
              <button key={w} onClick={() => addWord(w, "goal")} className="px-2 py-1 rounded bg-amber-50 text-[11px] font-medium text-amber-700 hover:bg-amber-100 transition-colors">
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
