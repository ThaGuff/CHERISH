"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CanvasEl {
  id: string;
  type: "photo" | "sticker" | "frame" | "ribbon" | "text" | "caption" | "shape" | "washi";
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  z: number;
  data: Record<string, string>;
}

const layouts = [
  { id: "freeform", label: "Freeform", icon: "✨" },
  { id: "grid-2x2", label: "Grid 2×2", icon: "⊞" },
  { id: "hero-bottom", label: "Hero + Row", icon: "▬" },
  { id: "filmstrip", label: "Filmstrip", icon: "🎞️" },
  { id: "polaroid", label: "Polaroids", icon: "📷" },
  { id: "full-bleed", label: "Full Bleed", icon: "▣" },
];

const bgColors = [
  "#ffffff", "#fffaf7", "#fef3c7", "#fce7f3", "#dbeafe",
  "#d1fae5", "#ede9fe", "#fef2f2", "#f0fdf4", "#fdf4ff",
  "#ecfdf5", "#1a1a1a", "#2d1b0e", "#0f172a",
];

const bgPatterns = [
  { id: "none", label: "Solid" },
  { id: "dots", label: "Dots" },
  { id: "lines", label: "Lines" },
  { id: "grid", label: "Grid" },
  { id: "kraft", label: "Kraft Paper" },
];

const stickerSets = [
  { name: "Travel", items: ["✈️","🏖️","🗺️","🧳","🌴","⛰️","🚗","📸","🌅","🏕️","🗼","🎒","🚂","⛵","🏰","🌊"] },
  { name: "Celebrations", items: ["🎉","🎂","🎈","🎁","🥂","🎆","🪅","🎊","👑","💐","🏆","🌟","🥳","🍾","🎤","🪩"] },
  { name: "Family", items: ["❤️","👨‍👩‍👧","👶","🐾","🏡","🍳","📚","🎵","💕","🤗","👨‍👩‍👧‍👦","🧸","🍼","🎶","💝","🌻"] },
  { name: "Nature", items: ["🌸","🦋","⭐","🌈","🌻","🍂","❄️","🌙","☀️","🌺","🍁","🌷","🐝","🦜","🌿","🍃"] },
  { name: "Decorative", items: ["🎀","💫","🔮","🪄","💎","🕊️","🦢","🎭","📌","🖍️","✂️","📎","🏷️","🪡","🧵","🎪"] },
  { name: "Food & Drink", items: ["🍕","🍰","🍦","☕","🧁","🍩","🍿","🥤","🍓","🍪","🧋","🍫","🎂","🧇","🥞","🍭"] },
];

const captionLabels = [
  "Favorite Memory", "Trip Details", "Funniest Moment", "Who Was There",
  "This Was Special Because...", "I Never Want to Forget", "Date & Location",
  "Best Part of the Day", "Something Unexpected", "One Thing I Don't Want to Forget",
  "How I Felt", "What We Did",
];

const frameStyles = [
  { id: "classic", label: "🖼️ Classic Frame", border: "4px solid #d4a574" },
  { id: "polaroid", label: "📷 Polaroid", border: "3px solid #fff" },
  { id: "shadow", label: "🌑 Shadow Box", border: "1px solid #e0e0e0" },
  { id: "rounded", label: "⭕ Rounded", border: "3px solid #e8d0c0" },
  { id: "torn", label: "📄 Torn Edge", border: "2px dashed #c4a882" },
  { id: "double", label: "▫️ Double Border", border: "double 5px #987" },
];

const ribbonStyles = [
  { id: "satin-red", label: "🎀 Red Satin", color: "#e74c3c" },
  { id: "satin-pink", label: "🎀 Pink Satin", color: "#e91e8c" },
  { id: "washi-floral", label: "🌸 Floral Washi", color: "#f8a5c2" },
  { id: "washi-dots", label: "⚫ Dotted Washi", color: "#fab1a0" },
  { id: "washi-stripe", label: "📏 Striped Washi", color: "#81ecec" },
  { id: "gold", label: "✨ Gold Foil", color: "#f0c040" },
];

const textStyles = [
  { id: "heading", label: "Heading", font: "'Playfair Display', serif", size: "24px", weight: "700" },
  { id: "subheading", label: "Subheading", font: "'DM Sans', sans-serif", size: "16px", weight: "600" },
  { id: "handwritten", label: "Handwritten", font: "'Caveat', cursive", size: "20px", weight: "500" },
  { id: "caption-text", label: "Caption", font: "'DM Sans', sans-serif", size: "12px", weight: "400" },
  { id: "quote", label: "Quote", font: "'Playfair Display', serif", size: "18px", weight: "400" },
];

type Tab = "photos" | "stickers" | "text" | "frames" | "captions" | "bg";

export default function ScrapbookPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [elements, setElements] = useState<CanvasEl[]>([]);
  const [history, setHistory] = useState<CanvasEl[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [layout, setLayout] = useState("freeform");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgPattern, setBgPattern] = useState("none");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; startW: number; startH: number; startX: number; startY: number } | null>(null);
  const [stickerTab, setStickerTab] = useState(0);

  // Push state to history for undo
  const pushHistory = useCallback((newEls: CanvasEl[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIdx + 1);
      return [...trimmed, newEls];
    });
    setHistoryIdx((prev) => prev + 1);
    setElements(newEls);
  }, [historyIdx]);

  function undo() {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setElements(history[historyIdx - 1]);
      setSelected(null);
    }
  }

  function redo() {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setElements(history[historyIdx + 1]);
    }
  }

  const addElement = useCallback((el: CanvasEl) => {
    pushHistory([...elements, el]);
  }, [elements, pushHistory]);

  const removeSelected = useCallback(() => {
    if (selected) {
      pushHistory(elements.filter((e) => e.id !== selected));
      setSelected(null);
    }
  }, [selected, elements, pushHistory]);

  const duplicateSelected = useCallback(() => {
    const el = elements.find((e) => e.id === selected);
    if (el) {
      const dup = { ...el, id: `${el.type}-${Date.now()}`, x: el.x + 20, y: el.y + 20, z: elements.length + 1 };
      pushHistory([...elements, dup]);
      setSelected(dup.id);
    }
  }, [selected, elements, pushHistory]);

  const rotateSelected = useCallback((deg: number) => {
    if (selected) {
      pushHistory(elements.map((e) => e.id === selected ? { ...e, rot: e.rot + deg } : e));
    }
  }, [selected, elements, pushHistory]);

  const bringForward = useCallback(() => {
    if (selected) {
      const maxZ = Math.max(...elements.map((e) => e.z));
      pushHistory(elements.map((e) => e.id === selected ? { ...e, z: maxZ + 1 } : e));
    }
  }, [selected, elements, pushHistory]);

  const sendBack = useCallback(() => {
    if (selected) {
      const minZ = Math.min(...elements.map((e) => e.z));
      pushHistory(elements.map((e) => e.id === selected ? { ...e, z: minZ - 1 } : e));
    }
  }, [selected, elements, pushHistory]);

  // Photo upload
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        addElement({
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "photo",
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          w: 180, h: 140, rot: 0,
          z: elements.length + 1,
          data: { src: ev.target?.result as string, caption: "" },
        });
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Drag handling
  function onMouseDown(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSelected(id);
    const el = elements.find((x) => x.id === id);
    if (!el || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragging({ id, ox: e.clientX - rect.left - el.x, oy: e.clientY - rect.top - el.y });
  }

  function onResizeStart(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const el = elements.find((x) => x.id === id);
    if (!el) return;
    setResizing({ id, startW: el.w, startH: el.h, startX: e.clientX, startY: e.clientY });
  }

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (dragging && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(0, e.clientX - rect.left - dragging.ox);
        const y = Math.max(0, e.clientY - rect.top - dragging.oy);
        setElements((prev) => prev.map((el) => el.id === dragging.id ? { ...el, x, y } : el));
      }
      if (resizing) {
        const dw = e.clientX - resizing.startX;
        const dh = e.clientY - resizing.startY;
        setElements((prev) => prev.map((el) =>
          el.id === resizing.id
            ? { ...el, w: Math.max(40, resizing.startW + dw), h: Math.max(30, resizing.startH + dh) }
            : el
        ));
      }
    }
    function onUp() {
      if (dragging) {
        setDragging(null);
        pushHistory([...elements]);
      }
      if (resizing) {
        setResizing(null);
        pushHistory([...elements]);
      }
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, resizing, elements, pushHistory]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SCRAPBOOK",
          title: title || "Scrapbook Page",
          scrapPage: {
            layout,
            canvasData: { elements, bgColor, bgPattern, layout },
            bgColor,
          },
        }),
      });
      if (res.ok) router.push("/library");
      else {
        const err = await res.json();
        alert(err.error || "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  const selectedEl = elements.find((e) => e.id === selected);

  const patternCSS: Record<string, string> = {
    none: "",
    dots: "radial-gradient(circle, #00000008 1px, transparent 1px)",
    lines: "repeating-linear-gradient(0deg, #00000005, #00000005 1px, transparent 1px, transparent 20px)",
    grid: "linear-gradient(#00000005 1px, transparent 1px), linear-gradient(90deg, #00000005 1px, transparent 1px)",
    kraft: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='40' height='40' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "photos", label: "Photos", icon: "📷" },
    { id: "stickers", label: "Stickers", icon: "⭐" },
    { id: "text", label: "Text", icon: "Aa" },
    { id: "frames", label: "Frames", icon: "🖼️" },
    { id: "captions", label: "Captions", icon: "💬" },
    { id: "bg", label: "Background", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between gap-2">
        <Link href="/home" className="text-xs text-scrap-text font-medium">✕</Link>
        <input
          className="font-display text-sm font-bold text-center bg-transparent outline-none text-cherish-900 flex-1 min-w-0"
          placeholder="Page title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-1">
          <button onClick={undo} disabled={historyIdx <= 0} className="w-7 h-7 rounded bg-gray-100 text-xs disabled:opacity-30" title="Undo">↩</button>
          <button onClick={redo} disabled={historyIdx >= history.length - 1} className="w-7 h-7 rounded bg-gray-100 text-xs disabled:opacity-30" title="Redo">↪</button>
          <button onClick={handleSave} disabled={saving} className="px-3 py-1 bg-scrap-text text-white rounded text-xs font-medium">
            {saving ? "..." : "Save"}
          </button>
        </div>
      </div>

      {/* Layout selector */}
      <div className="bg-white border-b border-gray-100 px-3 py-1.5 flex gap-1 overflow-x-auto">
        {layouts.map((l) => (
          <button
            key={l.id}
            onClick={() => setLayout(l.id)}
            className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-all ${
              layout === l.id ? "bg-scrap-light text-scrap-text" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      {/* Selected element toolbar */}
      {selectedEl && (
        <div className="bg-white border-b border-gray-200 px-3 py-1.5 flex items-center gap-1 overflow-x-auto">
          <span className="text-[10px] text-gray-400 mr-1">Edit:</span>
          <button onClick={() => rotateSelected(-15)} className="px-2 py-1 rounded bg-gray-100 text-[10px]">↶ Rotate</button>
          <button onClick={() => rotateSelected(15)} className="px-2 py-1 rounded bg-gray-100 text-[10px]">↷ Rotate</button>
          <button onClick={duplicateSelected} className="px-2 py-1 rounded bg-gray-100 text-[10px]">⧉ Duplicate</button>
          <button onClick={bringForward} className="px-2 py-1 rounded bg-gray-100 text-[10px]">↑ Forward</button>
          <button onClick={sendBack} className="px-2 py-1 rounded bg-gray-100 text-[10px]">↓ Back</button>
          <button onClick={removeSelected} className="px-2 py-1 rounded bg-red-100 text-red-600 text-[10px]">🗑 Delete</button>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 mx-3 my-2 rounded-xl border border-gray-300 relative overflow-hidden shadow-inner min-h-[400px]"
        style={{
          backgroundColor: bgColor,
          backgroundImage: patternCSS[bgPattern] || "",
          backgroundSize: bgPattern === "dots" ? "20px 20px" : bgPattern === "grid" ? "20px 20px" : "",
        }}
        onClick={() => setSelected(null)}
      >
        {elements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
            <span className="text-5xl mb-3">🎨</span>
            <p className="text-sm font-medium">Your canvas is ready</p>
            <p className="text-xs mt-1">Add photos, stickers, frames & more below</p>
          </div>
        )}

        {elements.map((el) => (
          <div
            key={el.id}
            className={`absolute select-none ${dragging?.id === el.id ? "cursor-grabbing" : "cursor-grab"} ${
              selected === el.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
            style={{
              left: el.x, top: el.y, width: el.w, height: el.h,
              transform: `rotate(${el.rot}deg)`,
              zIndex: el.z,
            }}
            onMouseDown={(e) => onMouseDown(el.id, e)}
          >
            {el.type === "photo" && (
              <div className="w-full h-full rounded-lg overflow-hidden shadow-lg" style={{ border: el.data.frame || "" }}>
                <img src={el.data.src} alt="" className="w-full h-full object-cover" draggable={false} />
                {el.data.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1">
                    <p className="text-white text-[9px]">{el.data.caption}</p>
                  </div>
                )}
              </div>
            )}
            {el.type === "sticker" && (
              <span className="flex items-center justify-center w-full h-full" style={{ fontSize: `${Math.min(el.w, el.h) * 0.7}px` }}>
                {el.data.emoji}
              </span>
            )}
            {el.type === "caption" && (
              <div className="bg-white/90 backdrop-blur rounded-xl p-2.5 border border-gray-200 shadow-sm w-full h-full flex flex-col">
                <p className="text-[8px] font-bold uppercase tracking-widest text-cherish-500 mb-1">{el.data.label}</p>
                <textarea
                  className="flex-1 w-full text-[11px] font-hand bg-transparent outline-none resize-none text-cherish-900 leading-relaxed"
                  placeholder="Write something..."
                  defaultValue={el.data.content}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {el.type === "text" && (
              <div
                className="w-full h-full flex items-center"
                style={{ fontFamily: el.data.font, fontSize: el.data.size, fontWeight: el.data.weight, color: el.data.color || "#2c1a0a" }}
              >
                <input
                  className="w-full bg-transparent outline-none"
                  defaultValue={el.data.text || "Click to edit"}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  style={{ fontFamily: "inherit", fontSize: "inherit", fontWeight: "inherit", color: "inherit" }}
                />
              </div>
            )}
            {el.type === "ribbon" && (
              <div
                className="w-full h-full rounded-sm opacity-80"
                style={{ backgroundColor: el.data.color }}
              />
            )}
            {el.type === "frame" && (
              <div className="w-full h-full rounded-lg" style={{ border: el.data.border, backgroundColor: "transparent" }} />
            )}

            {/* Resize handle */}
            {selected === el.id && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-tl-md cursor-se-resize"
                onMouseDown={(e) => onResizeStart(el.id, e)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-center text-[10px] font-medium transition-colors ${
                activeTab === tab.id ? "text-scrap-text border-b-2 border-scrap-text" : "text-gray-400"
              }`}
            >
              <span className="block text-sm mb-0.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-3 max-h-52 overflow-y-auto">
          {activeTab === "photos" && (
            <div className="space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-xl border-2 border-dashed border-scrap-border bg-scrap-light flex flex-col items-center gap-1 hover:bg-scrap-light/80 transition-colors"
              >
                <span className="text-2xl">📷</span>
                <span className="text-xs font-medium text-scrap-text">Upload Photos & Videos</span>
                <span className="text-[10px] text-scrap-text/50">Tap to select from camera roll</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePhotoUpload} />
              <p className="text-[10px] text-gray-400 text-center">
                Photos appear on your canvas — drag to position, resize from the corner handle
              </p>
            </div>
          )}

          {activeTab === "stickers" && (
            <div>
              <div className="flex gap-1 mb-2 overflow-x-auto">
                {stickerSets.map((set, i) => (
                  <button
                    key={set.name}
                    onClick={() => setStickerTab(i)}
                    className={`px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap ${
                      stickerTab === i ? "bg-scrap-light text-scrap-text" : "text-gray-400"
                    }`}
                  >
                    {set.name}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-8 gap-1">
                {stickerSets[stickerTab].items.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => addElement({
                      id: `sticker-${Date.now()}-${i}`, type: "sticker",
                      x: 80 + Math.random() * 120, y: 80 + Math.random() * 120,
                      w: 48, h: 48, rot: Math.random() * 20 - 10,
                      z: elements.length + 1, data: { emoji: s },
                    })}
                    className="w-9 h-9 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-lg transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "text" && (
            <div className="space-y-2">
              {textStyles.map((ts) => (
                <button
                  key={ts.id}
                  onClick={() => addElement({
                    id: `text-${Date.now()}`, type: "text",
                    x: 30, y: 40 + Math.random() * 100,
                    w: 250, h: parseInt(ts.size) + 16, rot: 0,
                    z: elements.length + 1,
                    data: { text: "", font: ts.font, size: ts.size, weight: ts.weight, color: "#2c1a0a" },
                  })}
                  className="w-full text-left p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span style={{ fontFamily: ts.font, fontSize: "14px", fontWeight: ts.weight as string }}>{ts.label}</span>
                  <span className="text-[10px] text-gray-400 ml-2">Click to add</span>
                </button>
              ))}
              <div className="mt-2">
                <p className="label-upper mb-1">Ribbons & Washi Tape</p>
                <div className="grid grid-cols-2 gap-1">
                  {ribbonStyles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => addElement({
                        id: `ribbon-${Date.now()}`, type: "ribbon",
                        x: 20 + Math.random() * 100, y: 40 + Math.random() * 200,
                        w: 180, h: 20, rot: Math.random() * 6 - 3,
                        z: elements.length + 1, data: { color: r.color, label: r.label },
                      })}
                      className="flex items-center gap-2 p-1.5 rounded bg-gray-50 hover:bg-gray-100 text-[10px]"
                    >
                      <div className="w-12 h-3 rounded-sm" style={{ backgroundColor: r.color }} />
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "frames" && (
            <div className="grid grid-cols-2 gap-2">
              {frameStyles.map((f) => (
                <button
                  key={f.id}
                  onClick={() => addElement({
                    id: `frame-${Date.now()}`, type: "frame",
                    x: 40 + Math.random() * 80, y: 40 + Math.random() * 80,
                    w: 160, h: 120, rot: 0,
                    z: elements.length + 1, data: { border: f.border, label: f.label },
                  })}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
                >
                  <div className="w-16 h-12 mx-auto rounded mb-1" style={{ border: f.border }} />
                  <span className="text-[10px] font-medium text-gray-600">{f.label}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === "captions" && (
            <div className="grid grid-cols-2 gap-1.5">
              {captionLabels.map((label) => (
                <button
                  key={label}
                  onClick={() => addElement({
                    id: `caption-${Date.now()}`, type: "caption",
                    x: 20, y: 100 + Math.random() * 150,
                    w: 200, h: 90, rot: 0,
                    z: elements.length + 1, data: { label, content: "" },
                  })}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-left transition-colors"
                >
                  <p className="text-[8px] font-bold uppercase tracking-wider text-cherish-500">{label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Tap to add</p>
                </button>
              ))}
            </div>
          )}

          {activeTab === "bg" && (
            <div className="space-y-3">
              <div>
                <p className="label-upper mb-1.5">Color</p>
                <div className="flex flex-wrap gap-2">
                  {bgColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setBgColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        bgColor === c ? "border-blue-500 scale-110 shadow-md" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="label-upper mb-1.5">Pattern Overlay</p>
                <div className="flex gap-1.5">
                  {bgPatterns.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setBgPattern(p.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                        bgPattern === p.id ? "bg-scrap-light text-scrap-text" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
