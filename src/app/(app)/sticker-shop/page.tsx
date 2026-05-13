"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StickerPack {
  id: string; name: string; category: string; isPremium: boolean;
  stickers: { id: string; name: string; url: string }[];
  _count: { stickers: number };
}

const builtInPacks = [
  { name: "Travel Essentials", category: "travel", count: 16, preview: ["✈️","🏖️","🗺️","🧳","🌴","⛰️"], price: "Free" },
  { name: "Celebrations", category: "holiday", count: 16, preview: ["🎉","🎂","🎈","🎁","🥂","🎆"], price: "Free" },
  { name: "Family Love", category: "family", count: 16, preview: ["❤️","👨‍👩‍👧","👶","🐾","🏡","🍳"], price: "Free" },
  { name: "Nature & Seasons", category: "nature", count: 16, preview: ["🌸","🦋","⭐","🌈","🌻","🍂"], price: "Free" },
  { name: "Decorative", category: "decorative", count: 16, preview: ["🎀","💫","🔮","🪄","💎","🕊️"], price: "Free" },
  { name: "Food & Drink", category: "food", count: 16, preview: ["🍕","🍰","🍦","☕","🧁","🍩"], price: "Free" },
  { name: "Baby Milestones", category: "baby", count: 20, preview: ["🍼","👶","🧸","🎀","🌙","⭐"], price: "$1.99", premium: true },
  { name: "Wedding Day", category: "wedding", count: 20, preview: ["💍","👰","🤵","💐","🥂","💒"], price: "$1.99", premium: true },
  { name: "Pet Parents", category: "pets", count: 16, preview: ["🐕","🐈","🐾","🦴","🐠","🐇"], price: "$1.99", premium: true },
  { name: "Fitness & Wellness", category: "fitness", count: 16, preview: ["💪","🧘","🏃","🥗","💧","🏋️"], price: "$0.99", premium: true },
  { name: "Retro Vintage", category: "retro", count: 20, preview: ["📻","📷","🎵","🚗","☎️","📺"], price: "$1.99", premium: true },
  { name: "Zodiac Signs", category: "zodiac", count: 12, preview: ["♈","♉","♊","♋","♌","♍"], price: "$0.99", premium: true },
];

const categories = ["all", "travel", "holiday", "family", "nature", "baby", "wedding", "retro"];

export default function StickerShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPack, setSelectedPack] = useState<typeof builtInPacks[0] | null>(null);

  const filtered = activeCategory === "all"
    ? builtInPacks
    : builtInPacks.filter((p) => p.category === activeCategory);

  if (selectedPack) {
    return (
      <div className="page-container pt-6 animate-in">
        <button onClick={() => setSelectedPack(null)} className="text-xs text-cherish-500 font-medium mb-4">
          ← Back to Shop
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center gap-2 mb-4">
            {selectedPack.preview.map((s, i) => (
              <span key={i} className="text-3xl">{s}</span>
            ))}
          </div>
          <h1 className="font-display text-xl font-bold text-cherish-900 mb-1">{selectedPack.name}</h1>
          <p className="text-xs text-cherish-900/40">{selectedPack.count} stickers · {selectedPack.category}</p>
        </div>

        {/* Full preview grid */}
        <div className="card mb-4">
          <p className="label-upper mb-3">Preview</p>
          <div className="grid grid-cols-6 gap-3">
            {selectedPack.preview.map((s, i) => (
              <div key={i} className="w-full aspect-square rounded-xl bg-cherish-50 flex items-center justify-center text-2xl">
                {s}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 12 - selectedPack.preview.length) }).map((_, i) => (
              <div key={`locked-${i}`} className="w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-300">
                🔒
              </div>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="card !p-5 text-center">
          <p className="text-2xl font-bold text-cherish-900 mb-1">{selectedPack.price}</p>
          <p className="text-xs text-cherish-900/40 mb-4">
            {selectedPack.premium ? "One-time purchase · Use forever" : "Included with your account"}
          </p>
          <button className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
            selectedPack.premium
              ? "bg-cherish-500 text-white shadow-md hover:bg-cherish-600"
              : "bg-green-100 text-green-700"
          }`}>
            {selectedPack.premium ? `Buy for ${selectedPack.price}` : "✓ Already Unlocked"}
          </button>
        </div>

        <div className="bottom-nav-spacer" />
      </div>
    );
  }

  return (
    <div className="page-container pt-6 animate-in">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-bold text-cherish-900">Sticker Shop</h1>
        <Link href="/home" className="text-xs text-cherish-500 font-medium">← Home</Link>
      </div>
      <p className="text-xs text-cherish-900/45 mb-5">
        Browse sticker packs to make your scrapbook pages pop.
      </p>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto -mx-5 px-5 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-cherish-500 text-white shadow-sm"
                : "bg-white border border-cherish-300/40 text-cherish-900/50"
            }`}
          >
            {cat === "all" ? "All Packs" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Free packs section */}
      <p className="label-upper mb-2">Free Sticker Packs</p>
      <div className="grid grid-cols-2 gap-3 mb-6 stagger-in">
        {filtered.filter((p) => !p.premium).map((pack) => (
          <button
            key={pack.name}
            onClick={() => setSelectedPack(pack)}
            className="card-hover !p-3 text-left"
          >
            <div className="flex flex-wrap gap-1 mb-2">
              {pack.preview.slice(0, 4).map((s, i) => (
                <span key={i} className="text-xl">{s}</span>
              ))}
            </div>
            <p className="text-xs font-semibold text-cherish-900 mb-0.5">{pack.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cherish-900/35">{pack.count} stickers</span>
              <span className="badge bg-green-100 text-green-700">FREE</span>
            </div>
          </button>
        ))}
      </div>

      {/* Premium packs */}
      {filtered.some((p) => p.premium) && (
        <>
          <p className="label-upper mb-2">Premium Packs</p>
          <div className="grid grid-cols-2 gap-3 mb-6 stagger-in">
            {filtered.filter((p) => p.premium).map((pack) => (
              <button
                key={pack.name}
                onClick={() => setSelectedPack(pack)}
                className="card-hover !p-3 text-left relative overflow-hidden"
              >
                <div className="absolute top-2 right-2">
                  <span className="badge bg-amber-100 text-amber-700">PRO</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {pack.preview.slice(0, 4).map((s, i) => (
                    <span key={i} className="text-xl">{s}</span>
                  ))}
                </div>
                <p className="text-xs font-semibold text-cherish-900 mb-0.5">{pack.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cherish-900/35">{pack.count} stickers</span>
                  <span className="text-[10px] font-bold text-cherish-500">{pack.price}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
