export type CreationMode =
  | "quick-snap"
  | "journal"
  | "scrapbook"
  | "full-memory"
  | "vision-board"
  | "creative-studio";

export interface ModeConfig {
  id: CreationMode;
  label: string;
  description: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  href: string;
  isNew?: boolean;
}

export interface CanvasElement {
  id: string;
  type: "photo" | "sticker" | "frame" | "ribbon" | "text" | "caption" | "shape" | "washi-tape";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  data: Record<string, unknown>;
}

export interface ScrapbookCanvasState {
  elements: CanvasElement[];
  bgColor: string;
  layout: string;
}

export interface JournalSection {
  id: string;
  type: "heading" | "text" | "photo" | "prompt" | "rating" | "mood";
  content: string;
  meta?: Record<string, unknown>;
}

export interface CaptionBox {
  id: string;
  label: string; // "Favorite Memory", "Trip Details", "Funniest Moment", etc.
  content: string;
}

export interface StickerItem {
  id: string;
  name: string;
  url: string;
  category: string;
  packId: string;
  isPremium: boolean;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  canvasData: ScrapbookCanvasState;
  isPremium: boolean;
}
