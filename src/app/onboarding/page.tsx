"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const themes = [
  { id: "MINIMAL", icon: "◻️", name: "Minimal", hint: "Clean & modern", preview: "bg-white border-gray-200" },
  { id: "JOURNAL", icon: "📓", name: "Journal", hint: "Warm & classic", preview: "bg-amber-50 border-amber-200" },
  { id: "PLAYFUL", icon: "🎨", name: "Playful", hint: "Fun & colorful", preview: "bg-pink-50 border-pink-200" },
  { id: "PREMIUM", icon: "✨", name: "Premium", hint: "Elegant & refined", preview: "bg-gray-900 border-gray-700" },
];

const useCases = [
  "Family memories", "Travel scrapbooking", "Daily journaling",
  "Baby milestones", "Creative projects", "Vision boards",
  "Gift for someone", "Photo organization",
];

const plans = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["10 pages/month", "1 memory book", "Basic stickers", "Cloud backup"],
    highlight: false,
    badge: null,
  },
  {
    id: "PRO_MONTHLY",
    name: "Pro",
    price: "$7.99",
    period: "/month",
    features: [
      "Unlimited pages & books",
      "All stickers, frames & themes",
      "PDF export & print-to-bind",
      "Voice memos & transcription",
      "Family Circle sharing",
      "On This Day memories",
      "Priority support",
    ],
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    id: "FAMILY_ANNUAL",
    name: "Family",
    price: "$99.99",
    period: "/year",
    features: [
      "Everything in Pro",
      "Up to 5 family members",
      "Shared memory books",
      "All premium sticker packs",
      "Print-to-bind hardcover books",
    ],
    highlight: false,
    badge: "BEST VALUE",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState("MINIMAL");
  const [selectedUses, setSelectedUses] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("FREE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleUse(use: string) {
    setSelectedUses((prev) =>
      prev.includes(use) ? prev.filter((u) => u !== use) : [...prev, use]
    );
  }

  async function saveAndNext(nextStep: number) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          useCases: selectedUses,
          onboarded: nextStep > 4,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save. Please try again.");
        setLoading(false);
        return;
      }
      setStep(nextStep);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function completeOnboarding() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          useCases: selectedUses,
          onboarded: true,
          tier: selectedPlan,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        setLoading(false);
        return;
      }
      router.push("/home");
    } catch {
      setError("Connection error.");
      setLoading(false);
    }
  }

  const slides = [
    {
      icon: "📸", bg: "bg-gradient-to-br from-amber-100 to-orange-100",
      title: "Capture in the moment",
      body: "Quick Snap lets you save a photo, note, and voice memo in under 60 seconds — even with one hand at the zoo.",
    },
    {
      icon: "🎨", bg: "bg-gradient-to-br from-emerald-100 to-teal-100",
      title: "Design at your own pace",
      body: "Turn quick captures into stunning scrapbook pages with stickers, frames, ribbons, and handwritten captions.",
    },
    {
      icon: "📖", bg: "bg-gradient-to-br from-violet-100 to-purple-100",
      title: "Keep forever. Print if you want.",
      body: "Everything is private by default, backed up to the cloud, and exportable as a PDF to print and bind into a real book.",
    },
  ];

  const totalSteps = 6;

  return (
    <div className="min-h-screen bg-cherish-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Progress bar */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-cherish-500" : "bg-cherish-300/40"
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-cherish-900/30 text-right mt-1">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      <div className="w-full max-w-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* STEP 0-2: Intro slides */}
        {step < 3 && (
          <div className="animate-in text-center" key={`slide-${step}`}>
            <div className={`w-full h-44 rounded-2xl mb-6 flex items-center justify-center ${slides[step].bg}`}>
              <span className="text-6xl drop-shadow-sm">{slides[step].icon}</span>
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
                  className="w-12 h-12 rounded-xl border-[1.5px] border-cherish-300 flex items-center justify-center text-cherish-500 text-lg"
                >
                  ‹
                </button>
              )}
              <button onClick={() => setStep(step + 1)} className="btn-primary flex-1 text-base">
                {step === 2 ? "Let's Set Up Your Vibe →" : "Next →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Theme + Use Cases */}
        {step === 3 && (
          <div className="animate-in" key="setup">
            <h2 className="font-display text-xl font-bold text-cherish-900 mb-1">
              Make it yours
            </h2>
            <p className="text-xs text-cherish-900/50 mb-5">
              Choose a visual theme — you can change this per book anytime.
            </p>

            <p className="label-upper mb-2">Visual theme</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`border-[1.5px] rounded-xl p-3 text-center transition-all ${
                    selectedTheme === t.id
                      ? "border-cherish-500 border-2 bg-cherish-100 shadow-sm shadow-cherish-500/10"
                      : "border-cherish-300 hover:border-cherish-400"
                  }`}
                >
                  <div className={`w-full h-10 rounded-lg mb-2 border ${t.preview}`} />
                  <span className="text-[11px] font-medium text-cherish-800 block">{t.name}</span>
                  <span className="text-[10px] text-cherish-900/40">{t.hint}</span>
                </button>
              ))}
            </div>

            <p className="label-upper mb-2">What brings you to Cherish?</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {useCases.map((use) => (
                <button
                  key={use}
                  onClick={() => toggleUse(use)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] transition-all ${
                    selectedUses.includes(use)
                      ? "bg-cherish-100 border-cherish-500 text-cherish-700"
                      : "border-cherish-300 text-cherish-900/40 hover:border-cherish-400"
                  }`}
                >
                  {use}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="w-12 h-12 rounded-xl border-[1.5px] border-cherish-300 flex items-center justify-center text-cherish-500 text-lg">
                ‹
              </button>
              <button onClick={() => saveAndNext(4)} disabled={loading} className="btn-primary flex-1">
                {loading ? "Saving..." : "Choose Your Plan →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Plan Selection */}
        {step === 4 && (
          <div className="animate-in" key="plans">
            <h2 className="font-display text-xl font-bold text-cherish-900 mb-1">
              Choose your plan
            </h2>
            <p className="text-xs text-cherish-900/50 mb-5">
              Start free, upgrade anytime. No credit card required.
            </p>

            <div className="space-y-3 mb-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative ${
                    selectedPlan === plan.id
                      ? plan.highlight
                        ? "border-cherish-500 bg-cherish-100/50 shadow-md shadow-cherish-500/10"
                        : "border-cherish-500 bg-cherish-50"
                      : "border-cherish-300/50 hover:border-cherish-300"
                  }`}
                >
                  {plan.badge && (
                    <span className={`absolute -top-2.5 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${
                      plan.highlight ? "bg-cherish-500" : "bg-emerald-500"
                    }`}>
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-display text-lg font-bold text-cherish-900">{plan.name}</h3>
                    <div>
                      <span className="text-xl font-bold text-cherish-900">{plan.price}</span>
                      <span className="text-xs text-cherish-900/40">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-[11px] text-cherish-900/55 flex items-start gap-1.5">
                        <span className="text-cherish-500 mt-0.5 flex-shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {selectedPlan === plan.id && (
                    <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-cherish-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="w-12 h-12 rounded-xl border-[1.5px] border-cherish-300 flex items-center justify-center text-cherish-500 text-lg">
                ‹
              </button>
              <button onClick={() => setStep(5)} className="btn-primary flex-1">
                {selectedPlan === "FREE" ? "Continue with Free →" : `Start ${plans.find(p => p.id === selectedPlan)?.name} Plan →`}
              </button>
            </div>

            {selectedPlan === "FREE" && (
              <p className="text-center text-[10px] text-cherish-900/30 mt-3">
                You can upgrade anytime from your profile.
              </p>
            )}
          </div>
        )}

        {/* STEP 5: Welcome */}
        {step === 5 && (
          <div className="animate-in text-center" key="welcome">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg shadow-green-500/10">
              ✓
            </div>
            <h2 className="font-display text-2xl font-bold text-cherish-900 mb-2">
              You&apos;re all set!
            </h2>
            <p className="text-sm text-cherish-900/55 leading-relaxed mb-6">
              Your first memory book is ready and waiting. Start capturing
              moments — they add up faster than you think.
            </p>

            <div className="card text-left mb-5 border-cherish-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-cherish-200 to-cherish-300 flex items-center justify-center text-xl">
                  📖
                </div>
                <div>
                  <p className="label-upper mb-0.5">Your first memory book</p>
                  <p className="font-display text-base text-cherish-900 italic">
                    My First Memory Book
                  </p>
                  <p className="text-[10px] text-cherish-900/40 mt-0.5">
                    0 pages · {themes.find(t => t.id === selectedTheme)?.name} theme
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={completeOnboarding}
              disabled={loading}
              className="btn-primary w-full text-base py-4"
            >
              {loading ? "Loading your workspace..." : "Start Creating Memories →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
