"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FullMemoryPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=details, 1=scrapbook, 2=journal
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [favMemory, setFavMemory] = useState("");
  const [funniestMoment, setFunniestMoment] = useState("");
  const [neverForget, setNeverForget] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "FULL_MEMORY",
          title: title || "Full Memory",
          location,
          journalEntry: {
            template: "FREE_WRITE",
            content: {
              freeText: journalContent,
              favMemory,
              funniestMoment,
              neverForget,
            },
          },
          scrapPage: {
            layout: "grid-2x2",
            canvasData: { elements: [], bgColor: "#ffffff", layout: "grid-2x2" },
            bgColor: "#ffffff",
          },
        }),
      });
      router.push("/home");
    } finally {
      setSaving(false);
    }
  }

  const steps = ["Details", "Scrapbook", "Journal"];

  return (
    <div className="page-container pt-6 animate-in">
      <Link href="/home" className="inline-flex items-center gap-1 text-xs text-full-text mb-4">
        ‹ Home
      </Link>

      <h1 className="font-display text-xl font-bold text-cherish-900 mb-1">Full Memory</h1>
      <p className="text-xs text-cherish-900/50 mb-4">Scrapbook + journal in one guided flow.</p>

      {/* Step indicator */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium text-center transition-all ${
              i === step
                ? "bg-full-light border border-full-border text-full-text"
                : "text-cherish-900/30"
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
            <input
              className="input-field font-display text-lg"
              placeholder="e.g. Spring Break Atlanta 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label-upper block mb-1.5">📍 Location</label>
            <input
              className="input-field"
              placeholder="Where did this happen?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button onClick={() => setStep(1)} className="btn-primary w-full !bg-full-text">
            Next: Add Photos & Design →
          </button>
        </div>
      )}

      {/* Step 1 — Simplified scrapbook */}
      {step === 1 && (
        <div className="animate-in">
          <div className="w-full h-64 rounded-2xl border-2 border-dashed border-full-border bg-full-light flex flex-col items-center justify-center gap-2 mb-4">
            <span className="text-4xl">📸</span>
            <p className="text-sm text-full-text font-medium">Add photos to your scrapbook</p>
            <p className="text-xs text-full-text/50">Tap to upload from camera roll</p>
          </div>
          <p className="text-xs text-cherish-900/40 mb-4 text-center">
            Full scrapbook editor available — add stickers, frames & captions from the Scrapbook mode.
          </p>
          <button onClick={() => setStep(2)} className="btn-primary w-full !bg-full-text">
            Next: Write the Story →
          </button>
        </div>
      )}

      {/* Step 2 — Journal */}
      {step === 2 && (
        <div className="space-y-4 animate-in">
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">
              ✨ Favorite Memory
            </label>
            <textarea
              className="input-field font-hand text-base resize-none"
              rows={2}
              placeholder="The one moment you want to remember forever..."
              value={favMemory}
              onChange={(e) => setFavMemory(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">
              😂 Funniest Moment
            </label>
            <textarea
              className="input-field font-hand text-base resize-none"
              rows={2}
              placeholder="Something that made everyone laugh..."
              value={funniestMoment}
              onChange={(e) => setFunniestMoment(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">
              💝 I Never Want to Forget
            </label>
            <textarea
              className="input-field font-hand text-base resize-none"
              rows={2}
              placeholder="A small moment that meant a lot..."
              value={neverForget}
              onChange={(e) => setNeverForget(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-full-text block mb-1">
              📖 Full Story
            </label>
            <textarea
              className="input-field font-hand text-base resize-none"
              rows={5}
              placeholder="Tell the whole story..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full !bg-full-text"
          >
            {saving ? "Saving..." : "Save Full Memory ✨"}
          </button>
        </div>
      )}

      <div className="bottom-nav-spacer" />
    </div>
  );
}
