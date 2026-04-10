import { Tier } from "@prisma/client";

type TierLimits = {
  pagesPerMonth: number; // -1 = unlimited
  maxBooks: number;
  voiceMemos: boolean;
  pdfExport: boolean;
  familyCircle: boolean;
  onThisDay: boolean;
  premiumStickers: boolean;
  allThemes: boolean;
  printToBind: boolean;
  creativeStudio: boolean;
  visionBoard: boolean;
};

const LIMITS: Record<Tier, TierLimits> = {
  FREE: {
    pagesPerMonth: 10,
    maxBooks: 1,
    voiceMemos: false,
    pdfExport: false,
    familyCircle: false,
    onThisDay: false,
    premiumStickers: false,
    allThemes: false,
    printToBind: false,
    creativeStudio: true,
    visionBoard: true,
  },
  PRO_MONTHLY: {
    pagesPerMonth: -1,
    maxBooks: -1,
    voiceMemos: true,
    pdfExport: true,
    familyCircle: true,
    onThisDay: true,
    premiumStickers: true,
    allThemes: true,
    printToBind: true,
    creativeStudio: true,
    visionBoard: true,
  },
  PRO_ANNUAL: {
    pagesPerMonth: -1,
    maxBooks: -1,
    voiceMemos: true,
    pdfExport: true,
    familyCircle: true,
    onThisDay: true,
    premiumStickers: true,
    allThemes: true,
    printToBind: true,
    creativeStudio: true,
    visionBoard: true,
  },
  FAMILY_ANNUAL: {
    pagesPerMonth: -1,
    maxBooks: -1,
    voiceMemos: true,
    pdfExport: true,
    familyCircle: true,
    onThisDay: true,
    premiumStickers: true,
    allThemes: true,
    printToBind: true,
    creativeStudio: true,
    visionBoard: true,
  },
  FOUNDING: {
    pagesPerMonth: -1,
    maxBooks: -1,
    voiceMemos: true,
    pdfExport: true,
    familyCircle: true,
    onThisDay: true,
    premiumStickers: true,
    allThemes: true,
    printToBind: true,
    creativeStudio: true,
    visionBoard: true,
  },
};

export function getTierLimits(tier: Tier): TierLimits {
  return LIMITS[tier];
}

export function canAccess(tier: Tier, feature: keyof TierLimits): boolean {
  const limits = LIMITS[tier];
  const val = limits[feature];
  if (typeof val === "boolean") return val;
  return val !== 0;
}

export function isPro(tier: Tier): boolean {
  return tier !== "FREE";
}
