import { Tier } from "@prisma/client";

type TierLimits = {
  pagesPerMonth: number;
  maxBooks: number;
  voiceMemos: boolean;
  pdfExport: boolean;       // $3.99 per export for free users, free for Pro
  familyCircle: boolean;
  onThisDay: boolean;
  premiumStickers: boolean;
  allThemes: boolean;
  printToBind: boolean;     // Available to ALL tiers (pay per order)
  printDiscount: number;    // Percentage discount on print orders
  creativeStudio: boolean;
  visionBoard: boolean;
  publicProfile: boolean;
  exploreFeed: boolean;
  hdPhotos: boolean;
};

const LIMITS: Record<Tier, TierLimits> = {
  FREE: {
    pagesPerMonth: -1,      // UNLIMITED — free to create
    maxBooks: -1,            // UNLIMITED — free to create
    voiceMemos: true,        // Free — accessibility feature
    pdfExport: true,         // Paid per export ($3.99)
    familyCircle: true,      // Free
    onThisDay: false,        // Pro
    premiumStickers: false,  // Pro
    allThemes: false,        // Pro (1 theme free)
    printToBind: true,       // Available (pay per order, no discount)
    printDiscount: 0,
    creativeStudio: true,
    visionBoard: true,
    publicProfile: false,    // Pro
    exploreFeed: true,       // Can browse, can't post
    hdPhotos: false,         // Pro
  },
  PRO_MONTHLY: {
    pagesPerMonth: -1, maxBooks: -1,
    voiceMemos: true, pdfExport: true, familyCircle: true,
    onThisDay: true, premiumStickers: true, allThemes: true,
    printToBind: true, printDiscount: 10,
    creativeStudio: true, visionBoard: true,
    publicProfile: true, exploreFeed: true, hdPhotos: true,
  },
  PRO_ANNUAL: {
    pagesPerMonth: -1, maxBooks: -1,
    voiceMemos: true, pdfExport: true, familyCircle: true,
    onThisDay: true, premiumStickers: true, allThemes: true,
    printToBind: true, printDiscount: 10,
    creativeStudio: true, visionBoard: true,
    publicProfile: true, exploreFeed: true, hdPhotos: true,
  },
  FAMILY_ANNUAL: {
    pagesPerMonth: -1, maxBooks: -1,
    voiceMemos: true, pdfExport: true, familyCircle: true,
    onThisDay: true, premiumStickers: true, allThemes: true,
    printToBind: true, printDiscount: 15,
    creativeStudio: true, visionBoard: true,
    publicProfile: true, exploreFeed: true, hdPhotos: true,
  },
  FOUNDING: {
    pagesPerMonth: -1, maxBooks: -1,
    voiceMemos: true, pdfExport: true, familyCircle: true,
    onThisDay: true, premiumStickers: true, allThemes: true,
    printToBind: true, printDiscount: 10,
    creativeStudio: true, visionBoard: true,
    publicProfile: true, exploreFeed: true, hdPhotos: true,
  },
};

export function getTierLimits(tier: Tier): TierLimits {
  return LIMITS[tier];
}

export function canAccess(tier: Tier, feature: keyof TierLimits): boolean {
  const limits = LIMITS[tier];
  const val = limits[feature];
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val !== 0;
  return true;
}

export function isPro(tier: Tier): boolean {
  return tier !== "FREE";
}
