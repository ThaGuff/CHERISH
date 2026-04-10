"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const people = ["Me", "Partner", "Kids", "Parents", "Friends", "Extended Family"];

export default function QuickSnapPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [whoWasThere, setWhoWasThere] = useState<string[]>([]);
  const [starRating, setStarRating] = useState(0);
  const [saving, setSaving] = useState(false);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  function togglePerson(p: string) {
    setWhoWasThere((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "QUICK_SNAP",
          title: note.slice(0, 50) || "Quick Snap",
          location,
          quickSnap: {
            note,
            whoWasThere,
            starRating,
          },
        }),
      });

      if (res.ok) {
        router.push("/home");
      }
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-container pt-6 animate-in">
      <Link
        href="/home"
        className="inline-flex items-center gap-1 text-xs text-snap-text mb-4"
      >
        ‹ Home
      </Link>

      <h1 className="font-display text-xl font-bold text-cherish-900 mb-1">
        Quick Snap
      </h1>
      <p className="text-xs text-cherish-900/50 mb-5">
        Capture the moment in 60 seconds or less.
      </p>

      {/* Photo Zone */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-48 rounded-2xl border-2 border-dashed border-snap-border bg-snap-light flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
      >
        {photo ? (
          <img
            src={photo}
            alt="Snap"
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <>
            <span className="text-3xl">📷</span>
            <span className="text-xs text-snap-text font-medium">
              Tap to add a photo
            </span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoSelect}
      />

      {/* Quick Note */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">Quick note</label>
        <textarea
          className="input-field font-hand text-base resize-none"
          rows={3}
          placeholder="What's happening right now?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">📍 Location</label>
        <input
          className="input-field"
          placeholder="Where are you?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Voice Memo */}
      <button className="w-full card-hover flex items-center gap-3 mb-4 !p-3">
        <span className="text-lg">🎙️</span>
        <span className="text-sm text-cherish-900/60">
          Add a voice memo (Pro)
        </span>
      </button>

      {/* Who Was There */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">Who was there?</label>
        <div className="flex flex-wrap gap-1.5">
          {people.map((p) => (
            <button
              key={p}
              onClick={() => togglePerson(p)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] transition-all ${
                whoWasThere.includes(p)
                  ? "bg-snap-light border-snap-border text-snap-text"
                  : "border-cherish-300 text-cherish-900/40"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="label-upper block mb-1.5">Rate this moment</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setStarRating(star)}
              className={`text-2xl transition-transform ${
                star <= starRating ? "scale-110" : "opacity-30"
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full !bg-[#7a3010]"
      >
        {saving ? "Saving..." : "Save Quick Snap ⚡"}
      </button>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
