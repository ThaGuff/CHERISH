"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const themes = [
  { id: "MINIMAL", icon: "◻️", name: "Minimal", hint: "Clean & modern" },
  { id: "JOURNAL", icon: "📓", name: "Journal", hint: "Warm & classic" },
  { id: "PLAYFUL", icon: "🎨", name: "Playful", hint: "Fun & colorful" },
  { id: "PREMIUM", icon: "✨", name: "Premium", hint: "Elegant & refined" },
];

const useCases = [
  "Family memories",
  "Travel scrapbooking",
  "Daily journaling",
  "Baby milestones",
  "Creative projects",
  "Vision boards",
  "Gift for someone",
  "Photo organization",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState("MINIMAL");
  const [selectedUses, setSelectedUses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleUse(use: string) {
    setSelectedUses((prev) =>
      prev.includes(use) ? prev.filter((u) => u !== use) : [...prev, use]
    );
  }

  async function completeOnboarding() {
    setLoading(true);
    await fetch("/api/auth/signup", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        theme: selectedTheme,
        useCases: selectedUses,
        onboarded: true,
      }),
    });
    router.push("/home");
  }

  // Intro slides
  const slides = [
    {
      icon: "📸",
      bg: "bg-amber-50",
      title: "Capture in the moment",
      body: "Quick Snap lets you save a photo, note, and voice memo in under 60 seconds — even with one hand.",
    },
    {
      icon: "🎨",
      bg: "bg-emerald-50",
      title: "Design at your own pace",
      body: "Turn quick captures into beautiful scrapbook pages with stickers, frames, ribbons, and captions.",
    },
    {
      icon: "📖",
      bg: "bg-violet-50",
      title: "Keep forever. Print if you want.",
      body: "Everything is private by default, backed up in the cloud, and exportable as a PDF to print and bind.",
    },
  ];

  return (
    <div className="min-h-screen bg-cherish-50 flex flex-col items-center justify-center px-4">
      {/* Step dots */}
      <div className="flex items-center gap-1.5 mb-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step
                ? "w-6 bg-cherish-500"
                : i < step
                ? "w-2 bg-cherish-500/40"
                : "w-2 bg-cherish-300"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-sm">
        {/* SLIDES */}
        {step < 3 && (
          <div className="animate-in text-center">
            <div
              className={`w-48 h-36 rounded-2xl mx-auto mb-6 flex items-center justify-center ${slides[step].bg}`}
            >
              <span className="text-5xl">{slides[step].icon}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-cherish-900 mb-3">
              {slides[step].title}
            </h2>
            <p className="text-sm text-cherish-900/55 leading-relaxed mb-8 px-2">
              {slides[step].body}
            </p>
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="w-11 h-11 rounded-xl border-[1.5px] border-cherish-300 flex items-center justify-center text-cherish-500"
                >
                  ‹
                </button>
              )}
              <button
                onClick={() => setStep(step + 1)}
                className="btn-primary flex-1"
              >
                {step === 2 ? "Set Up Your Vibe" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* THEME + USE CASES */}
        {step === 3 && (
          <div className="animate-in">
            <h2 className="font-display text-xl font-bold text-cherish-900 mb-1">
              Choose your vibe
            </h2>
            <p className="text-xs text-cherish-900/50 mb-5">
              You can change this anytime per memory book.
            </p>

            <p className="label-upper mb-2">Visual theme</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`border-[1.5px] rounded-xl p-3 text-center transition-all ${
                    selectedTheme === t.id
                      ? "border-cherish-500 border-2 bg-cherish-100"
                      : "border-cherish-300"
                  }`}
                >
                  <span className="text-2xl block mb-1">{t.icon}</span>
                  <span className="text-[11px] font-medium text-cherish-800 block">
                    {t.name}
                  </span>
                  <span className="text-[10px] text-cherish-900/40">
                    {t.hint}
                  </span>
                </button>
              ))}
            </div>

            <p className="label-upper mb-2">What brings you here?</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {useCases.map((use) => (
                <button
                  key={use}
                  onClick={() => toggleUse(use)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] transition-all ${
                    selectedUses.includes(use)
                      ? "bg-cherish-100 border-cherish-500 text-cherish-700"
                      : "border-cherish-300 text-cherish-900/50"
                  }`}
                >
                  {use}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(4)}
              className="btn-primary w-full"
            >
              Continue →
            </button>
          </div>
        )}

        {/* WELCOME */}
        {step === 4 && (
          <div className="animate-in text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-5">
              ✓
            </div>
            <h2 className="font-display text-2xl font-bold text-cherish-900 mb-2">
              You&apos;re all set!
            </h2>
            <p className="text-sm text-cherish-900/55 leading-relaxed mb-6">
              Your first memory book is ready and waiting. Start capturing
              moments — they add up faster than you think.
            </p>

            <div className="card text-left mb-5">
              <p className="label-upper mb-1">Your first memory book</p>
              <p className="font-display text-base text-cherish-900 italic">
                My First Memory Book
              </p>
              <p className="text-[11px] text-cherish-900/40 mt-0.5">
                0 pages · Created just now
              </p>
            </div>

            <button
              onClick={completeOnboarding}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Loading..." : "Start Creating →"}
            </button>
            <button
              onClick={completeOnboarding}
              className="text-xs text-cherish-900/40 mt-3 block mx-auto"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
