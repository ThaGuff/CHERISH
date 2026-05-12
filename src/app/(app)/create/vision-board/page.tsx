"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const canvasTypes = [
  { id: "free_canvas", icon: "🎨", name: "Free Canvas", desc: "No rules. Pure creative freedom." },
  { id: "vision_board", icon: "🌟", name: "Vision Board", desc: "Goals, dreams, and aspirations." },
  { id: "magazine_collage", icon: "📰", name: "Magazine Collage", desc: "Cut-and-paste magazine style." },
  { id: "photo_collage", icon: "📸", name: "Photo Collage", desc: "Photos layered and overlapping." },
  { id: "goal_board", icon: "🎯", name: "Goal Board", desc: "Track and visualize your goals." },
];

interface VEl { id: string; type: string; content: string; x: number; y: number; rot: number; scale: number; src?: string }

const powerWords = ["DREAM", "CREATE", "BELIEVE", "INSPIRE", "GROW", "SHINE", "BOLD", "RISE", "THRIVE", "LOVE", "MANIFEST", "FREEDOM"];
const feelingWords = ["Grateful", "Excited", "Peaceful", "Hopeful", "Proud", "Free", "Alive", "Joyful", "Fearless", "Radiant"];
const goalPhrases = ["This year I will...", "I am becoming...", "My next chapter:", "I choose to...", "I deserve...", "Watch me..."];
const headlines = ["BREAKING NEWS:", "EXCLUSIVE:", "SPECIAL EDITION", "COVER STORY", "TOP 10", "THE FUTURE IS", "TRENDING NOW"];

export default function VisionBoardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [elements, setElements] = useState<VEl[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  function add(content: string, type: string) {
    setElements((prev) => [...prev, {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type, content,
      x: 20 + Math.random() * 220,
      y: 30 + Math.random() * 280,
      rot: Math.random() * 30 - 15,
      scale: 0.9 + Math.random() * 0.4,
    }]);
  }

  function addPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setElements((prev) => [...prev, {
        id: `photo-${Date.now()}`, type: "photo", content: "",
        x: 30 + Math.random() * 150, y: 30 + Math.random() * 150,
        rot: Math.random() * 20 - 10, scale: 1,
        src: ev.target?.result as string,
      }]);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function shuffle() {
    setElements((prev) => prev.map((el) => ({
      ...el, x: Math.random() * 260, y: Math.random() * 320,
      rot: Math.random() * 50 - 25, scale: 0.7 + Math.random() * 0.6,
    })));
  }

  function removeEl(id: string) {
    setElements((prev) => prev.filter((e) => e.id !== id));
  }

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (dragging && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setElements((prev) => prev.map((el) =>
          el.id === dragging.id ? { ...el, x: e.clientX - rect.left - dragging.ox, y: e.clientY - rect.top - dragging.oy } : el
        ));
      }
    }
    function onUp() { setDragging(null); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "VISION_BOARD",
          title: canvasTypes.find((t) => t.id === selectedType)?.name || "Vision Board",
          visionBoard: { canvasType: selectedType, canvasData: { elements } },
        }),
      });
      if (res.ok) router.push("/library");
      else { const err = await res.json(); alert(err.error || "Save failed"); }
    } finally { setSaving(false); }
  }

  if (!selectedType) {
    return (
      <div className="page-container pt-6 animate-in">
        <Link href="/home" className="inline-flex items-center gap-1 text-xs text-vision-text font-medium mb-4">‹ Back to Home</Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🌀</span>
          <h1 className="font-display text-xl font-bold text-cherish-900">Vision Board & Collage</h1>
        </div>
        <p className="text-xs text-cherish-900/50 mb-5">Choose your canvas style — no rules, pure creativity.</p>
        <div className="flex flex-col gap-2">
          {canvasTypes.map((t) => (
            <button key={t.id} onClick={() => setSelectedType(t.id)}
              className="flex items-center gap-3 p-4 rounded-2xl border-[1.5px] border-vision-border bg-vision-light text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-2xl w-10 text-center">{t.icon}</span>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-vision-text">{t.name}</div>
                <div className="text-[11px] text-vision-text/70">{t.desc}</div>
              </div>
              <span className="text-sm text-vision-text/30">›</span>
            </button>
          ))}
        </div>
        <div className="bottom-nav-spacer" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
        <button onClick={() => setSelectedType(null)} className="text-xs text-vision-text font-medium">✕</button>
        <span className="font-display text-sm font-bold text-cherish-900">{canvasTypes.find((t) => t.id === selectedType)?.name}</span>
        <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-vision-text text-white rounded text-xs font-medium">
          {saving ? "..." : "Save"}
        </button>
      </div>

      {/* Canvas */}
      <div ref={canvasRef}
        className="flex-1 mx-3 my-2 rounded-xl border border-gray-300 bg-vision-light relative overflow-hidden shadow-inner min-h-[380px]">
        {elements.map((el) => (
          <div key={el.id} className="absolute select-none cursor-grab group"
            style={{ left: el.x, top: el.y, transform: `rotate(${el.rot}deg) scale(${el.scale})` }}
            onMouseDown={(e) => {
              e.stopPropagation();
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) setDragging({ id: el.id, ox: e.clientX - rect.left - el.x, oy: e.clientY - rect.top - el.y });
            }}>
            {el.type === "power" && <span className="text-2xl font-black tracking-tight drop-shadow-sm" style={{ color: `hsl(${Math.random() * 360}, 70%, 40%)` }}>{el.content}</span>}
            {el.type === "feeling" && <span className="text-base font-hand italic text-purple-700 drop-shadow-sm">{el.content}</span>}
            {el.type === "goal" && <span className="text-sm bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm text-cherish-900 font-medium">{el.content}</span>}
            {el.type === "headline" && <span className="text-lg font-black uppercase tracking-widest text-red-600 drop-shadow">{el.content}</span>}
            {el.type === "photo" && el.src && <img src={el.src} alt="" className="w-28 h-28 object-cover rounded-xl shadow-lg" draggable={false} />}
            <button onClick={(e) => { e.stopPropagation(); removeEl(el.id); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
          </div>
        ))}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-vision-text/25">
            <span className="text-5xl mb-3">🌀</span>
            <p className="text-sm font-medium">Your canvas awaits</p>
            <p className="text-xs mt-1">Add words, photos & more below</p>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="border-t border-gray-200 bg-white p-3 space-y-3 max-h-60 overflow-y-auto">
        <div className="flex gap-2 flex-wrap">
          <button onClick={shuffle} className="px-3 py-1.5 rounded-lg bg-vision-light border border-vision-border text-[11px] font-medium text-vision-text">🔀 Shuffle</button>
          <button onClick={() => setElements([])} className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-[11px] font-medium text-red-600">🗑️ Clear All</button>
          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] font-medium text-blue-600">📷 Add Photo</button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={addPhoto} />
        </div>

        <div>
          <p className="label-upper mb-1">Power Words</p>
          <div className="flex flex-wrap gap-1">
            {powerWords.map((w) => (
              <button key={w} onClick={() => add(w, "power")} className="px-2 py-1 rounded bg-cherish-500/10 text-[11px] font-bold text-cherish-500 hover:bg-cherish-500/20 transition-colors">{w}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="label-upper mb-1">Feelings</p>
          <div className="flex flex-wrap gap-1">
            {feelingWords.map((w) => (
              <button key={w} onClick={() => add(w, "feeling")} className="px-2 py-1 rounded bg-purple-50 text-[11px] font-medium text-purple-600 hover:bg-purple-100 transition-colors">{w}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="label-upper mb-1">Goal Phrases</p>
          <div className="flex flex-wrap gap-1">
            {goalPhrases.map((w) => (
              <button key={w} onClick={() => add(w, "goal")} className="px-2 py-1 rounded bg-amber-50 text-[11px] font-medium text-amber-700 hover:bg-amber-100 transition-colors">{w}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="label-upper mb-1">Magazine Headlines</p>
          <div className="flex flex-wrap gap-1">
            {headlines.map((w) => (
              <button key={w} onClick={() => add(w, "headline")} className="px-2 py-1 rounded bg-red-50 text-[11px] font-bold text-red-600 hover:bg-red-100 transition-colors">{w}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
