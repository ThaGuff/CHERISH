"use client";

import { create } from "zustand";
import type { CanvasElement, CreationMode } from "@/types";

interface AppState {
  // User
  userName: string;
  userTier: string;
  streak: number;
  setUser: (name: string, tier: string, streak: number) => void;

  // Active creation
  activeMode: CreationMode | null;
  setActiveMode: (mode: CreationMode | null) => void;

  // Scrapbook canvas
  canvasElements: CanvasElement[];
  selectedElementId: string | null;
  addElement: (el: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  clearCanvas: () => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  userName: "",
  userTier: "FREE",
  streak: 0,
  setUser: (name, tier, streak) => set({ userName: name, userTier: tier, streak }),

  activeMode: null,
  setActiveMode: (mode) => set({ activeMode: mode }),

  canvasElements: [],
  selectedElementId: null,
  addElement: (el) =>
    set((s) => ({ canvasElements: [...s.canvasElements, el] })),
  updateElement: (id, updates) =>
    set((s) => ({
      canvasElements: s.canvasElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),
  removeElement: (id) =>
    set((s) => ({
      canvasElements: s.canvasElements.filter((el) => el.id !== id),
      selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
    })),
  selectElement: (id) => set({ selectedElementId: id }),
  clearCanvas: () => set({ canvasElements: [], selectedElementId: null }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
