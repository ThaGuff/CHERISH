"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/store/app-store";
import type { CanvasElement } from "@/types";

const layouts = [
  { id: "single", label: "Single", icon: "▪️" },
  { id: "grid-2x2", label: "Grid 2×2", icon: "▫️▫️" },
  { id: "grid-3", label: "3-Up", icon: "▫️▫️▫️" },
  { id: "hero-2", label: "Hero + 2", icon: "▪️▫️" },
  { id: "collage", label: "Collage", icon: "🎨" },
  { id: "filmstrip", label: "Filmstrip", icon: "🎞️" },
];

const bgColors = [
  "#ffffff", "#fffaf7", "#fef3c7", "#fce7f3", "#dbeafe",
  "#d1fae5", "#ede9fe", "#fef2f2", "#f0fdf4", "#1a1a1a",
];

const stickerCategories = [
  {
    name: "Travel",
    stickers: ["✈️", "🏖️", "🗺️", "🧳", "🌴", "⛰️", "🚗", "📸", "🌅", "🏕️", "🗼", "🎒"],
  },
  {
    name: "Celebrations",
    stickers: ["🎉", "🎂", "🎈", "🎁", "🥂", "🎆", "🪅", "🎊", "👑", "💐", "🏆", "🌟"],
  },
  {
    name: "Family",
    stickers: ["❤️", "👨‍👩‍👧", "👶", "🐾", "🏡", "🍳", "📚", "🎵", "💕", "🤗", "👨‍👩‍👧‍👦", "🧸"],
  },
  {
    name: "Decorative",
    stickers: ["🌸", "🦋", "⭐", "🌈", "🌻", "🍂", "❄️", "🌙", "☀️", "🎀", "💫", "🔮"],
  },
];

const captionTypes = [
  { id: "fav_memory", label: "Favorite Memory" },
  { id: "trip_details", label: "Trip Details" },
  { id: "funniest_moment", label: "Funniest Moment" },
  { id: "who_was_there", label: "Who Was There" },
  { id: "what_happened", label: "What Happened" },
  { id: "special_because", label: "This Was Special Because..." },
  { id: "never_forget", label: "I Never Want to Forget" },
  { id: "date_location", label: "Date & Location" },
];

const decorItems = [
  { type: "frame" as const, items: ["🖼️ Classic", "📷 Polaroid", "🪟 Rounded", "✨ Sparkle"] },
  { type: "ribbon" as const, items: ["🎀 Satin", "📏 Washi Tape", "〰️ Wave", "⚡ Zigzag"] },
  { type: "shape" as const, items: ["❤️ Heart", "⭐ Star", "⬡ Hex", "○ Circle"] },
];

type Tab = "photos" | "stickers" | "decor" | "captions" | "bg";

export default function ScrapbookPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    canvasElements,
    addElement,
    updateElement,
    removeElement,
    selectedElementId,
    selectElement,
    clearCanvas,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [selectedLayout, setSelectedLayout] = useState("grid-2x2");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const addSticker = useCallback(
    (emoji: string) => {
      const el: CanvasElement = {
        id: `sticker-${Date.now()}`,
        type: "sticker",
        x: 100 + Math.random() * 100,
        y: 100 + Math.random() * 100,
        width: 48,
        height: 48,
        rotation: Math.random() * 20 - 10,
        zIndex: canvasElements.length + 1,
        data: { emoji },
      };
      addElement(el);
    },
    [addElement, canvasElements.length]
  );

  const addCaption = useCallback(
    (label: string) => {
      const el: CanvasElement = {
        id: `caption-${Date.now()}`,
        type: "caption",
        x: 20,
        y: 200 + Math.random() * 100,
        width: 200,
        height: 80,
        rotation: 0,
        zIndex: canvasElements.length + 1,
        data: { label, content: "" },
      };
      addElement(el);
    },
    [addElement, canvasElements.length]
  );

  const addDecor = useCallback(
    (type: CanvasElement["type"], label: string) => {
      const el: CanvasElement = {
        id: `${type}-${Date.now()}`,
        type,
        x: 50 + Math.random() * 150,
        y: 50 + Math.random() * 200,
        width: type === "ribbon" ? 180 : 60,
        height: type === "ribbon" ? 24 : 60,
        rotation: Math.random() * 10 - 5,
        zIndex: canvasElements.length + 1,
        data: { label },
      };
      addElement(el);
    },
    [addElement, canvasElements.length]
  );

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const el: CanvasElement = {
          id: `photo-${Date.now()}`,
          type: "photo",
          x: 20 + Math.random() * 50,
          y: 20 + Math.random() * 50,
          width: 160,
          height: 120,
          rotation: 0,
          zIndex: canvasElements.length + 1,
          data: { src: ev.target?.result },
        };
        addElement(el);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleCanvasMouseDown(elId: string, e: React.MouseEvent) {
    e.stopPropagation();
    selectElement(elId);
    const el = canvasElements.find((x) => x.id === elId);
    if (el) {
      setDragOffset({ x: e.clientX - el.x, y: e.clientY - el.y });
    }
  }

  function handleCanvasMouseMove(e: React.MouseEvent) {
    if (selectedElementId && dragOffset) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        updateElement(selectedElementId, {
          x: e.clientX - rect.left - dragOffset.x + (canvasRef.current?.scrollLeft || 0),
          y: e.clientY - rect.top - dragOffset.y + (canvasRef.current?.scrollTop || 0),
        });
      }
    }
  }

  function handleCanvasMouseUp() {
    // Keep selection but stop dragging handled by mouseMove logic
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SCRAPBOOK",
          title: title || "Scrapbook Page",
          scrapPage: {
            layout: selectedLayout,
            canvasData: { elements: canvasElements, bgColor, layout: selectedLayout },
            bgColor,
          },
        }),
      });
      clearCanvas();
      router.push("/home");
    } finally {
      setSaving(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "photos", label: "Photos", icon: "📷" },
    { id: "stickers", label: "Stickers", icon: "⭐" },
    { id: "decor", label: "Decor", icon: "🎀" },
    { id: "captions", label: "Captions", icon: "💬" },
    { id: "bg", label: "Background", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-cherish-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <Link href="/home" className="text-xs text-scrap-text">
          ‹ Home
        </Link>
        <input
          className="font-display text-base font-bold text-center bg-transparent outline-none text-cherish-900 w-40"
          placeholder="Page Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-xs font-medium text-white bg-scrap-text px-3 py-1.5 rounded-lg"
        >
          {saving ? "..." : "Save"}
        </button>
      </div>

      {/* Layout selector */}
      <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
        {layouts.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLayout(l.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap border transition-all ${
              selectedLayout === l.id
                ? "bg-scrap-light border-scrap-border text-scrap-text"
                : "border-cherish-300 text-cherish-900/40"
            }`}
          >
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 mx-4 rounded-2xl border-2 border-dashed border-scrap-border relative overflow-hidden cursor-crosshair min-h-[350px]"
        style={{ backgroundColor: bgColor }}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onClick={() => selectElement(null)}
      >
        {canvasElements.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-cherish-900/20">
            <span className="text-4xl mb-2">🎨</span>
            <p className="text-sm font-medium">Add photos, stickers & more</p>
            <p className="text-xs">Use the toolbar below to build your page</p>
          </div>
        )}

        {canvasElements.map((el) => (
          <div
            key={el.id}
            className={`absolute cursor-move select-none ${
              selectedElementId === el.id ? "ring-2 ring-cherish-500 ring-offset-1" : ""
            }`}
            style={{
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              transform: `rotate(${el.rotation}deg)`,
              zIndex: el.zIndex,
            }}
            onMouseDown={(e) => handleCanvasMouseDown(el.id, e)}
          >
            {el.type === "sticker" && (
              <span className="text-4xl select-none">{el.data.emoji as string}</span>
            )}
            {el.type === "photo" && (
              <img
                src={el.data.src as string}
                alt=""
                className="w-full h-full object-cover rounded-lg shadow-md"
                draggable={false}
              />
            )}
            {el.type === "caption" && (
              <div className="bg-white/90 backdrop-blur rounded-lg p-2 border border-cherish-300/50 shadow-sm w-full h-full">
                <p className="text-[8px] font-bold uppercase tracking-wider text-cherish-500 mb-0.5">
                  {el.data.label as string}
                </p>
                <textarea
                  className="w-full text-[10px] font-hand bg-transparent outline-none resize-none text-cherish-900"
                  placeholder="Write something..."
                  defaultValue={el.data.content as string}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {(el.type === "frame" || el.type === "ribbon" || el.type === "shape") && (
              <div className="w-full h-full border-2 border-cherish-400/30 rounded flex items-center justify-center text-xs text-cherish-400">
                {el.data.label as string}
              </div>
            )}

            {/* Delete button on selected */}
            {selectedElementId === el.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(el.id);
                }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center shadow"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="border-t border-cherish-300/30 bg-white">
        {/* Tab bar */}
        <div className="flex border-b border-cherish-300/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-center text-[10px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-scrap-text border-b-2 border-scrap-text"
                  : "text-cherish-900/40"
              }`}
            >
              <span className="block text-base mb-0.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-3 max-h-48 overflow-y-auto">
          {activeTab === "photos" && (
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full card-hover !p-3 flex items-center gap-2 mb-2"
              >
                <span>📷</span>
                <span className="text-sm text-cherish-900/60">Add Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoAdd}
              />
            </div>
          )}

          {activeTab === "stickers" && (
            <div className="space-y-3">
              {stickerCategories.map((cat) => (
                <div key={cat.name}>
                  <p className="label-upper mb-1">{cat.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.stickers.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => addSticker(s)}
                        className="w-9 h-9 rounded-lg bg-cherish-50 hover:bg-cherish-100 flex items-center justify-center text-lg transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "decor" && (
            <div className="space-y-3">
              {decorItems.map((group) => (
                <div key={group.type}>
                  <p className="label-upper mb-1 capitalize">{group.type}s</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <button
                        key={item}
                        onClick={() => addDecor(group.type, item)}
                        className="px-2.5 py-1.5 rounded-lg bg-cherish-50 hover:bg-cherish-100 text-[11px] font-medium text-cherish-900/60 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "captions" && (
            <div className="grid grid-cols-2 gap-1.5">
              {captionTypes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => addCaption(c.label)}
                  className="card-hover !p-2.5 text-left"
                >
                  <p className="text-[10px] font-bold text-cherish-500">
                    {c.label}
                  </p>
                </button>
              ))}
            </div>
          )}

          {activeTab === "bg" && (
            <div>
              <p className="label-upper mb-2">Background Color</p>
              <div className="flex flex-wrap gap-2">
                {bgColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      bgColor === c
                        ? "border-cherish-500 scale-110"
                        : "border-cherish-300/50"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
