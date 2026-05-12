"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FullMemoryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [favMemory, setFavMemory] = useState("");
  const [funniestMoment, setFunniestMoment] = useState("");
  const [neverForget, setNeverForget] = useState("");
  const [specialBecause, setSpecialBecause] = useState("");
  const [fullStory, setFullStory] = useState("");
  const [mood, setMood] = useState("");
  const [saving, setSaving] = useState(false);

  const moods = ["😊 Happy", "🥰 Loving", "🤩 Excited", "😌 Peaceful", "😢 Emotional", "😂 Hilarious"];

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((prev) => [...prev, { file, preview: ev.target?.result as string }]);
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "FULL_MEMORY",
          title: title || "Full Memory",
          location,
          date,
          journalEntry: {
            template: "FREE_WRITE",
            content: { fullStory, favMemory, funniestMoment, neverForget, specialBecause },
            mood,
          },
          scrapPage: {
            layout: "grid-2x2",
            canvasData: { elements: [], bgColor: "#ffffff", layout: "grid-2x2" },
            bgColor: "#ffffff",
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to save");
        setSaving(false);
        return;
      }

      const { memory } = await res.json();

      if (photos.length > 0) {
        const formData = new FormData();
        formData.append("memoryId", memory.id);
        photos.forEach((p) => formData.append("files", p.file));
        await fetch("/api/upload", { method: "POST", body: formData });
      }

      router.push("/library");
    } finally {
      setSaving(false);
    }
  }

  const steps = ["Details", "Photos", "The Story", "Review"];

  return (
    <div className="page-container pt-6 animate-in">
      <Link href="/home" className="inline-flex items-center gap-1 text-xs text-full-text font-medium mb-4">
        ‹ Back to Home
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✨</span>
        <div>
          <h1 className="font-display text-lg font-bold text-cherish-900">Full Memory</h1>
          <p className="text-[10px] text-cherish-900/40">Scrapbook + journal — the complete story</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => i <= step && setStep(i)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium text-center transition-all ${
              i === step ? "bg-full-light border border-full-border text-full-text"
                : i < step ? "bg-full-light/50 text-full-text/50" : "text-cherish-900/20"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Step 0 — Details */}
      {step === 0 && (
        <div className="space-y-4 animate-in">
          <div>
            <label className="label-upper block mb-1.5">Memory title</label>
            <input className="input-field font-display text-lg" placeholder="e.g. Spring Break Atlanta 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label-upper block mb-1.5">📍 Location</label>
            <input className="input-field" placeholder="Where did this happen?" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label className="label-upper block mb-1.5">📅 Date</label>
            <input className="input-field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label-upper block mb-1.5">Mood</label>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <button key={m} onClick={() => setMood(mood === m ? "" : m)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] transition-all ${
                    mood === m ? "bg-full-light border-full-border text-full-text" : "border-cherish-300 text-cherish-900/40"
                  }`}>{m}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(1)} className="btn-primary w-full !bg-full-text">Next: Add Photos →</button>
        </div>
      )}

      {/* Step 1 — Photos */}
      {step === 1 && (
        <div className="animate-in">
          <label className="label-upper block mb-2">📷 Add your photos & videos</label>
          <div className="flex gap-2 flex-wrap mb-4">
            {photos.map((p, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-full-border group">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed border-full-border bg-full-light flex flex-col items-center justify-center gap-1">
              <span className="text-xl">+</span>
              <span className="text-[9px] text-full-text font-medium">Add</span>
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handlePhotoSelect} />
          <p className="text-[10px] text-cherish-900/30 mb-4">These photos will be attached to your memory. Use the Scrapbook mode for full canvas editing.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="w-12 h-12 rounded-xl border border-cherish-300 flex items-center justify-center text-cherish-500">‹</button>
            <button onClick={() => setStep(2)} className="btn-primary flex-1 !bg-full-text">Next: Tell the Story →</button>
          </div>
        </div>
      )}

      {/* Step 2 — The Story */}
      {step === 2 && (
        <div className="space-y-4 animate-in">
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">✨ Favorite Memory</label>
            <textarea className="input-field font-hand text-base resize-none" rows={2} placeholder="The one moment you want to remember forever..." value={favMemory} onChange={(e) => setFavMemory(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">😂 Funniest Moment</label>
            <textarea className="input-field font-hand text-base resize-none" rows={2} placeholder="Something that made everyone laugh..." value={funniestMoment} onChange={(e) => setFunniestMoment(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">💝 I Never Want to Forget</label>
            <textarea className="input-field font-hand text-base resize-none" rows={2} placeholder="A small moment that meant a lot..." value={neverForget} onChange={(e) => setNeverForget(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">💫 This Was Special Because...</label>
            <textarea className="input-field font-hand text-base resize-none" rows={2} placeholder="Why this memory matters..." value={specialBecause} onChange={(e) => setSpecialBecause(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">📖 Full Story</label>
            <textarea className="input-field font-body text-sm resize-none" rows={5} placeholder="Tell the whole story from start to finish..." value={fullStory} onChange={(e) => setFullStory(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="w-12 h-12 rounded-xl border border-cherish-300 flex items-center justify-center text-cherish-500">‹</button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1 !bg-full-text">Review & Save →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Review */}
      {step === 3 && (
        <div className="animate-in">
          <div className="card mb-4">
            <h3 className="font-display text-base font-bold text-cherish-900 mb-2">{title || "Untitled Memory"}</h3>
            {location && <p className="text-xs text-cherish-900/50 mb-1">📍 {location}</p>}
            {date && <p className="text-xs text-cherish-900/50 mb-1">📅 {date}</p>}
            {mood && <p className="text-xs text-cherish-900/50 mb-2">{mood}</p>}
            {photos.length > 0 && <p className="text-xs text-cherish-900/50 mb-1">📷 {photos.length} photo{photos.length > 1 ? "s" : ""}</p>}
            {favMemory && <p className="text-xs text-cherish-900/60 mt-2"><strong>Favorite:</strong> {favMemory.slice(0, 100)}{favMemory.length > 100 ? "..." : ""}</p>}
            {fullStory && <p className="text-xs text-cherish-900/60 mt-1"><strong>Story:</strong> {fullStory.slice(0, 150)}{fullStory.length > 150 ? "..." : ""}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="w-12 h-12 rounded-xl border border-cherish-300 flex items-center justify-center text-cherish-500">‹</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 !bg-gradient-to-r !from-[#5a1880] !to-[#8a30c0] text-base py-4">
              {saving ? "Saving your memory..." : "Save Full Memory ✨"}
            </button>
          </div>
        </div>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
