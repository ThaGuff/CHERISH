"use client";

import Link from "next/link";
import type { ModeConfig } from "@/types";

const MODES: ModeConfig[] = [
  {
    id: "quick-snap",
    label: "Quick Snap",
    description: "Photo + note + voice in 60 seconds.",
    icon: "⚡",
    colorClass: "text-snap-text",
    bgClass: "bg-snap-light",
    borderClass: "border-snap-border",
    href: "/create/quick-snap",
  },
  {
    id: "journal",
    label: "Journal or Diary",
    description: "Templates, prompts, writing-first.",
    icon: "📖",
    colorClass: "text-journal-text",
    bgClass: "bg-journal-light",
    borderClass: "border-journal-border",
    href: "/create/journal",
  },
  {
    id: "scrapbook",
    label: "Scrapbook Page",
    description: "Layouts, stickers, frames, captions. Organized & beautiful.",
    icon: "🎨",
    colorClass: "text-scrap-text",
    bgClass: "bg-scrap-light",
    borderClass: "border-scrap-border",
    href: "/create/scrapbook",
  },
  {
    id: "full-memory",
    label: "Full Memory",
    description: "Scrapbook + journal together. The complete story.",
    icon: "✨",
    colorClass: "text-full-text",
    bgClass: "bg-full-light",
    borderClass: "border-full-border",
    href: "/create/full-memory",
  },
  {
    id: "vision-board",
    label: "Vision Board & Collage",
    description: "Free canvas. No rules. Pure creative chaos.",
    icon: "🌀",
    colorClass: "text-vision-text",
    bgClass: "bg-vision-light",
    borderClass: "border-vision-border",
    href: "/create/vision-board",
    isNew: true,
  },
  {
    id: "creative-studio",
    label: "Creative Studio",
    description: "Blog, stories, lyrics, ideas. Your creative space.",
    icon: "✍️",
    colorClass: "text-creative-text",
    bgClass: "bg-creative-light",
    borderClass: "border-creative-border",
    href: "/create/creative-studio",
    isNew: true,
  },
];

export default function ModeCards() {
  return (
    <div className="flex flex-col gap-2">
      {MODES.map((mode) => (
        <Link
          key={mode.id}
          href={mode.href}
          className={`mode-card ${mode.bgClass} ${mode.borderClass} border-[1.5px]`}
        >
          <div
            className={`w-10 h-10 rounded-[11px] flex items-center justify-center text-xl flex-shrink-0 ${mode.bgClass}`}
            style={{ opacity: 0.8 }}
          >
            {mode.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-[13px] font-medium flex items-center gap-1.5 ${mode.colorClass}`}>
              {mode.label}
              {mode.isNew && (
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-cherish-500 text-white">
                  NEW
                </span>
              )}
            </div>
            <div className={`text-[10px] leading-snug opacity-75 ${mode.colorClass}`}>
              {mode.description}
            </div>
          </div>
          <span className={`text-base opacity-30 flex-shrink-0 ${mode.colorClass}`}>
            ›
          </span>
        </Link>
      ))}
    </div>
  );
}
