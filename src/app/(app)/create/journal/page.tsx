"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const templates = [
  { id: "TRAVEL_DAY", icon: "✈️", name: "Travel Day", hint: "Document a trip with highlights and photos", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { id: "DAILY_REFLECTION", icon: "🌅", name: "Daily Reflection", hint: "End-of-day thoughts and gratitude", color: "bg-blue-50 border-blue-200 text-blue-800" },
  { id: "BIG_MILESTONE", icon: "🎉", name: "Big Milestone", hint: "Birthday, graduation, first steps, big wins", color: "bg-purple-50 border-purple-200 text-purple-800" },
  { id: "FAMILY_MOMENT", icon: "👨‍👩‍👧‍👦", name: "Family Moment", hint: "Capture what happened and who was there", color: "bg-green-50 border-green-200 text-green-800" },
  { id: "GRATITUDE", icon: "🙏", name: "Gratitude", hint: "Three things you're thankful for today", color: "bg-rose-50 border-rose-200 text-rose-800" },
  { id: "FREE_WRITE", icon: "✏️", name: "Free Write", hint: "No prompts, no rules. Just write.", color: "bg-gray-50 border-gray-200 text-gray-800" },
];

const moods = ["😊 Happy", "😌 Peaceful", "🥰 Grateful", "😢 Emotional", "🤩 Excited", "😴 Tired"];

const prompts: Record<string, string[]> = {
  TRAVEL_DAY: ["Where did you go today?", "Best moment of the day?", "Something unexpected that happened", "Favorite photo and why", "One thing you don't want to forget"],
  DAILY_REFLECTION: ["How was your day overall?", "What made you smile?", "What are you grateful for?", "What would you do differently?"],
  BIG_MILESTONE: ["What happened?", "Why does this matter?", "How did you feel in the moment?", "Who was there to share it?"],
  FAMILY_MOMENT: ["What were you doing together?", "Funniest thing someone said", "A small moment that meant a lot", "This was special because..."],
  GRATITUDE: ["I'm grateful for...", "Someone who made my day better", "A small thing I usually overlook"],
  FREE_WRITE: [],
};

export default function JournalPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<{ prompt: string; content: string }[]>([]);
  const [freeContent, setFreeContent] = useState("");
  const [saving, setSaving] = useState(false);

  function selectTemplate(id: string) {
    setSelectedTemplate(id);
    const templatePrompts = prompts[id] || [];
    setSections(templatePrompts.map((p) => ({ prompt: p, content: "" })));
  }

  function updateSection(idx: number, content: string) {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, content } : s)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const content =
        selectedTemplate === "FREE_WRITE"
          ? { freeText: freeContent }
          : { sections };

      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "JOURNAL",
          title: title || `${templates.find((t) => t.id === selectedTemplate)?.name} Entry`,
          journalEntry: {
            template: selectedTemplate,
            content,
            mood,
          },
        }),
      });
      router.push("/home");
    } finally {
      setSaving(false);
    }
  }

  // Template selection screen
  if (!selectedTemplate) {
    return (
      <div className="page-container pt-6 animate-in">
        <Link href="/home" className="inline-flex items-center gap-1 text-xs text-journal-text mb-4">
          ‹ Home
        </Link>
        <h1 className="font-display text-xl font-bold text-cherish-900 mb-1">
          Journal or Diary
        </h1>
        <p className="text-xs text-cherish-900/50 mb-5">
          Choose a template to get started, or free write.
        </p>
        <div className="flex flex-col gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t.id)}
              className={`flex items-center gap-3 p-3 rounded-card border-[1.5px] text-left transition-all hover:-translate-y-0.5 ${t.color}`}
            >
              <span className="text-xl w-8 text-center">{t.icon}</span>
              <div>
                <div className="text-[13px] font-medium">{t.name}</div>
                <div className="text-[10px] opacity-70">{t.hint}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="bottom-nav-spacer" />
      </div>
    );
  }

  // Writing screen
  const tpl = templates.find((t) => t.id === selectedTemplate)!;
  return (
    <div className="page-container pt-6 animate-in">
      <button
        onClick={() => setSelectedTemplate(null)}
        className="inline-flex items-center gap-1 text-xs text-journal-text mb-4"
      >
        ‹ Back to templates
      </button>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{tpl.icon}</span>
        <div>
          <h1 className="font-display text-lg font-bold text-cherish-900">
            {tpl.name}
          </h1>
        </div>
      </div>

      {/* Title */}
      <input
        className="input-field font-display text-lg mb-4"
        placeholder="Give this entry a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Mood */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">How are you feeling?</label>
        <div className="flex flex-wrap gap-1.5">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] transition-all ${
                mood === m
                  ? "bg-journal-light border-journal-border text-journal-text"
                  : "border-cherish-300 text-cherish-900/40"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedTemplate === "FREE_WRITE" ? (
        <textarea
          className="input-field font-hand text-base resize-none min-h-[300px]"
          placeholder="Start writing... no rules, no prompts. Just you and your thoughts."
          value={freeContent}
          onChange={(e) => setFreeContent(e.target.value)}
        />
      ) : (
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i}>
              <label className="text-xs font-medium text-journal-text block mb-1">
                {s.prompt}
              </label>
              <textarea
                className="input-field font-hand text-base resize-none"
                rows={3}
                placeholder="Write your thoughts..."
                value={s.content}
                onChange={(e) => updateSection(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full mt-6 !bg-journal-text"
      >
        {saving ? "Saving..." : "Save Journal Entry 📖"}
      </button>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
