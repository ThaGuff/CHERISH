"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const people = ["Me", "Partner", "Kids", "Parents", "Friends", "Extended Family", "Pets"];
const moods = ["😊 Happy", "😌 Peaceful", "🥰 Loving", "🤩 Excited", "😢 Emotional", "😴 Tired", "🤔 Reflective", "😂 Hilarious"];

export default function QuickSnapPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [whoWasThere, setWhoWasThere] = useState<string[]>([]);
  const [starRating, setStarRating] = useState(0);
  const [mood, setMood] = useState("");
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((prev) => [...prev, { file, preview: ev.target?.result as string }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  function togglePerson(p: string) {
    setWhoWasThere((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function detectLocation() {
    setDetecting(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
      );
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.village || "";
      const state = data.address?.state || "";
      setLocation([city, state].filter(Boolean).join(", "));
    } catch {
      setLocation("Location unavailable");
    }
    setDetecting(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // 1. Create the memory
      const memRes = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "QUICK_SNAP",
          title: note.slice(0, 60) || "Quick Snap",
          location,
          quickSnap: { note, whoWasThere, starRating, mood },
        }),
      });

      if (!memRes.ok) {
        const err = await memRes.json();
        alert(err.error || "Failed to save");
        setSaving(false);
        return;
      }

      const { memory } = await memRes.json();

      // 2. Upload photos if any
      if (photos.length > 0) {
        const formData = new FormData();
        formData.append("memoryId", memory.id);
        photos.forEach((p) => formData.append("files", p.file));
        await fetch("/api/upload", { method: "POST", body: formData });
      }

      router.push("/library");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-container pt-6 animate-in">
      <Link href="/home" className="inline-flex items-center gap-1 text-xs text-snap-text font-medium mb-4">
        ‹ Back to Home
      </Link>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">⚡</span>
        <h1 className="font-display text-xl font-bold text-cherish-900">Quick Snap</h1>
      </div>
      <p className="text-xs text-cherish-900/50 mb-5">
        Capture the moment in 60 seconds. Photo + note + done.
      </p>

      {/* Photo Zone */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">📷 Photos</label>
        <div className="flex gap-2 flex-wrap">
          {photos.map((p, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-snap-border group">
              <img src={p.preview} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-snap-border bg-snap-light flex flex-col items-center justify-center gap-1 hover:bg-snap-light/80 transition-colors"
          >
            <span className="text-xl">+</span>
            <span className="text-[9px] text-snap-text font-medium">Add Photo</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelect}
        />
      </div>

      {/* Quick Note */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">✏️ Quick Note</label>
        <textarea
          className="input-field font-hand text-base resize-none"
          rows={3}
          placeholder="What's happening right now? What don't you want to forget?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">📍 Location</label>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="Where are you?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="px-3 py-2 rounded-[10px] bg-snap-light border border-snap-border text-snap-text text-xs font-medium whitespace-nowrap"
          >
            {detecting ? "..." : "📍 Detect"}
          </button>
        </div>
      </div>

      {/* Mood */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">Mood</label>
        <div className="flex flex-wrap gap-1.5">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(mood === m ? "" : m)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] transition-all ${
                mood === m
                  ? "bg-snap-light border-snap-border text-snap-text"
                  : "border-cherish-300 text-cherish-900/40"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Who Was There */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">👥 Who was there?</label>
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
        <label className="label-upper block mb-1.5">⭐ Rate this moment</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setStarRating(star === starRating ? 0 : star)}
              className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg transition-all ${
                star <= starRating
                  ? "bg-amber-100 border-amber-300 scale-105"
                  : "border-cherish-300 opacity-40"
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
        className="btn-primary w-full text-base py-4 !bg-gradient-to-r !from-[#7a3010] !to-[#c84820]"
      >
        {saving ? "Saving your moment..." : "Save Quick Snap ⚡"}
      </button>

      <p className="text-center text-[10px] text-cherish-900/30 mt-3 mb-2">
        Saved to your default memory book
      </p>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
