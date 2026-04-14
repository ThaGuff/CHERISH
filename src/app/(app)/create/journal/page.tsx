"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const templates = [
  { id: "TRAVEL_DAY", icon: "✈️", name: "Travel Day", hint: "Document a trip with highlights and photos", color: "bg-amber-50 border-amber-200 text-amber-800", accent: "#92400e" },
  { id: "DAILY_REFLECTION", icon: "🌅", name: "Daily Reflection", hint: "End-of-day thoughts and gratitude", color: "bg-blue-50 border-blue-200 text-blue-800", accent: "#1e40af" },
  { id: "BIG_MILESTONE", icon: "🎉", name: "Big Milestone", hint: "Birthday, graduation, first steps, big wins", color: "bg-purple-50 border-purple-200 text-purple-800", accent: "#6b21a8" },
  { id: "FAMILY_MOMENT", icon: "👨‍👩‍👧‍👦", name: "Family Moment", hint: "Capture what happened and who was there", color: "bg-green-50 border-green-200 text-green-800", accent: "#166534" },
  { id: "GRATITUDE", icon: "🙏", name: "Gratitude", hint: "Three things you're thankful for today", color: "bg-rose-50 border-rose-200 text-rose-800", accent: "#9f1239" },
  { id: "FREE_WRITE", icon: "✏️", name: "Free Write", hint: "No prompts, no rules. Just write.", color: "bg-gray-50 border-gray-200 text-gray-800", accent: "#374151" },
];

const moods = ["😊 Happy", "😌 Peaceful", "🥰 Grateful", "😢 Emotional", "🤩 Excited", "😴 Tired", "🤔 Reflective", "😂 Hilarious"];

const prompts: Record<string, { label: string; placeholder: string }[]> = {
  TRAVEL_DAY: [
    { label: "Where did you go today?", placeholder: "Describe the places you visited..." },
    { label: "Best moment of the day?", placeholder: "What stood out the most?" },
    { label: "Something unexpected", placeholder: "Anything surprising or unplanned?" },
    { label: "Favorite photo and why", placeholder: "Describe the moment you captured..." },
    { label: "One thing you don't want to forget", placeholder: "The small detail that matters..." },
  ],
  DAILY_REFLECTION: [
    { label: "How was your day overall?", placeholder: "Sum it up in a few words..." },
    { label: "What made you smile?", placeholder: "Even the small things count..." },
    { label: "What are you grateful for?", placeholder: "Three things you appreciate today..." },
    { label: "What would you do differently?", placeholder: "Any lessons learned?" },
  ],
  BIG_MILESTONE: [
    { label: "What happened?", placeholder: "Describe the milestone..." },
    { label: "Why does this matter?", placeholder: "What makes this significant?" },
    { label: "How did you feel in the moment?", placeholder: "Capture the emotion..." },
    { label: "Who was there to share it?", placeholder: "The people who matter..." },
  ],
  FAMILY_MOMENT: [
    { label: "What were you doing together?", placeholder: "The activity or occasion..." },
    { label: "Funniest thing someone said", placeholder: "The quote you want to remember..." },
    { label: "A small moment that meant a lot", placeholder: "Something quiet but powerful..." },
    { label: "This was special because...", placeholder: "Why this memory matters..." },
  ],
  GRATITUDE: [
    { label: "I'm grateful for...", placeholder: "The first thing that comes to mind..." },
    { label: "Someone who made my day better", placeholder: "Who and what they did..." },
    { label: "A small thing I usually overlook", placeholder: "The everyday blessings..." },
  ],
  FREE_WRITE: [],
};

export default function JournalPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<{ label: string; placeholder: string; content: string }[]>([]);
  const [freeContent, setFreeContent] = useState("");
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [withPhotos, setWithPhotos] = useState(false);
  const [privacy, setPrivacy] = useState("PRIVATE");
  const [saving, setSaving] = useState(false);

  function selectTemplate(id: string) {
    setSelectedTemplate(id);
    const tplPrompts = prompts[id] || [];
    setSections(tplPrompts.map((p) => ({ ...p, content: "" })));
  }

  function updateSection(idx: number, content: string) {
    setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, content } : s)));
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((prev) => [...prev, { file, preview: ev.target?.result as string }]);
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    setSaving(true);
    try {
      const content = selectedTemplate === "FREE_WRITE"
        ? { freeText: freeContent }
        : { sections: sections.map((s) => ({ label: s.label, content: s.content })) };

      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "JOURNAL",
          title: title || `${templates.find((t) => t.id === selectedTemplate)?.name} Entry`,
          privacy,
          journalEntry: {
            template: selectedTemplate,
            content,
            mood,
            withPhotos: photos.length > 0,
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

  // Template selection
  if (!selectedTemplate) {
    return (
      <div className="page-container pt-6 animate-in">
        <Link href="/home" className="inline-flex items-center gap-1 text-xs text-journal-text font-medium mb-4">‹ Back to Home</Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📖</span>
          <h1 className="font-display text-xl font-bold text-cherish-900">Journal or Diary</h1>
        </div>
        <p className="text-xs text-cherish-900/50 mb-5">Choose a template to guide your writing, or free write.</p>
        <div className="flex flex-col gap-2">
          {templates.map((t) => (
            <button key={t.id} onClick={() => selectTemplate(t.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-[1.5px] text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${t.color}`}>
              <span className="text-2xl w-10 text-center">{t.icon}</span>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{t.name}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{t.hint}</div>
              </div>
              <span className="text-sm opacity-30">›</span>
            </button>
          ))}
        </div>
        <div className="bottom-nav-spacer" />
      </div>
    );
  }

  const tpl = templates.find((t) => t.id === selectedTemplate)!;

  return (
    <div className="page-container pt-6 animate-in">
      <button onClick={() => setSelectedTemplate(null)} className="inline-flex items-center gap-1 text-xs font-medium mb-4" style={{ color: tpl.accent }}>
        ‹ Back to templates
      </button>

      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">{tpl.icon}</span>
        <div>
          <h1 className="font-display text-lg font-bold text-cherish-900">{tpl.name}</h1>
          <p className="text-[10px] text-cherish-900/40">{tpl.hint}</p>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">Entry title</label>
        <input className="input-field font-display text-lg" placeholder="Give this entry a title..." value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Mood */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">How are you feeling?</label>
        <div className="flex flex-wrap gap-1.5">
          {moods.map((m) => (
            <button key={m} onClick={() => setMood(mood === m ? "" : m)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border-[1.5px] transition-all ${
                mood === m ? "border-current opacity-100" : "border-cherish-300 text-cherish-900/40"
              }`} style={mood === m ? { color: tpl.accent, borderColor: tpl.accent, backgroundColor: `${tpl.accent}10` } : {}}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Photos toggle */}
      <div className="mb-4">
        <button onClick={() => setWithPhotos(!withPhotos)}
          className={`flex items-center gap-2 w-full p-3 rounded-xl border-[1.5px] transition-all ${
            withPhotos ? "border-current bg-opacity-10" : "border-cherish-300"
          }`} style={withPhotos ? { color: tpl.accent, borderColor: tpl.accent } : {}}>
          <span>📷</span>
          <span className="text-xs font-medium flex-1 text-left">{withPhotos ? "Photos enabled" : "Add photos to this entry?"}</span>
          <span className="text-xs">{withPhotos ? "✓" : "+"}</span>
        </button>

        {withPhotos && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {photos.map((p, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border group">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-xl text-gray-300">+</button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
          </div>
        )}
      </div>

      {/* Content */}
      {selectedTemplate === "FREE_WRITE" ? (
        <div className="mb-4">
          <label className="label-upper block mb-1.5">Your thoughts</label>
          <textarea className="input-field font-hand text-base resize-none min-h-[250px] leading-relaxed"
            placeholder="Start writing... no rules, no prompts. Just you and your thoughts." value={freeContent} onChange={(e) => setFreeContent(e.target.value)} />
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {sections.map((s, i) => (
            <div key={i}>
              <label className="text-xs font-medium block mb-1" style={{ color: tpl.accent }}>{s.label}</label>
              <textarea className="input-field font-hand text-base resize-none leading-relaxed" rows={3}
                placeholder={s.placeholder} value={s.content} onChange={(e) => updateSection(i, e.target.value)} />
            </div>
          ))}
        </div>
      )}

      {/* Privacy */}
      <div className="mb-5">
        <label className="label-upper block mb-1.5">Privacy</label>
        <div className="flex gap-2">
          {[
            { id: "PRIVATE", label: "🔒 Private", hint: "Only you" },
            { id: "FAMILY_CIRCLE", label: "👨‍👩‍👧 Family", hint: "Your circle" },
            { id: "PUBLIC", label: "🌍 Public", hint: "Anyone" },
          ].map((p) => (
            <button key={p.id} onClick={() => setPrivacy(p.id)}
              className={`flex-1 py-2 px-2 rounded-xl border-[1.5px] text-center transition-all ${
                privacy === p.id ? "border-cherish-500 bg-cherish-50" : "border-cherish-300"
              }`}>
              <span className="block text-sm">{p.label}</span>
              <span className="text-[9px] text-cherish-900/30">{p.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="btn-primary w-full text-base py-4" style={{ backgroundColor: tpl.accent }}>
        {saving ? "Saving your entry..." : `Save ${tpl.name} Entry 📖`}
      </button>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
