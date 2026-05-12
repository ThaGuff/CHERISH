"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const subModes = [
  { id: "blog_post", icon: "📝", name: "Blog Post Draft", hint: "Title, intro, sections, photos. Ready to publish.", color: "amber", accent: "#92400e", placeholder: "Start writing your blog post...\n\nIntroduction:\n\nMain points:\n\nConclusion:" },
  { id: "short_story", icon: "📕", name: "Short Story", hint: "Fiction, nonfiction, memoir. Tell a story.", color: "rose", accent: "#9f1239", placeholder: "Once upon a time..." },
  { id: "song_lyrics", icon: "🎵", name: "Song Lyrics & Melody", hint: "Write lyrics. Hum a melody. Save both.", color: "purple", accent: "#6b21a8", placeholder: "[Verse 1]\n\n[Chorus]\n\n[Verse 2]\n\n[Bridge]\n\n[Outro]" },
  { id: "idea_dump", icon: "💡", name: "Idea Dump", hint: "Brain dump. No structure needed. Just capture it.", color: "yellow", accent: "#854d0e", placeholder: "Just start typing. Stream of consciousness. No rules, no judgment. Get it all out..." },
  { id: "content_calendar", icon: "📅", name: "Content Calendar", hint: "Plan your posts, reels, and content.", color: "blue", accent: "#1e40af", placeholder: "Monday:\n\nTuesday:\n\nWednesday:\n\nThursday:\n\nFriday:\n\nWeekend:" },
  { id: "voice_to_text", icon: "🎙️", name: "Voice Note to Text", hint: "Speak it. We'll write it down. (Pro)", color: "green", accent: "#166534", placeholder: "Tap the microphone to start recording..." },
];

export default function CreativeStudioPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [privacy, setPrivacy] = useState("PRIVATE");
  const [saving, setSaving] = useState(false);

  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CREATIVE",
          title: title || subModes.find((m) => m.id === selectedMode)?.name || "Creative Post",
          privacy,
          creativePost: {
            subType: selectedMode,
            content: { text: content, title },
          },
          tags,
        }),
      });
      if (res.ok) router.push("/library");
      else { const err = await res.json(); alert(err.error || "Save failed"); }
    } finally { setSaving(false); }
  }

  if (!selectedMode) {
    return (
      <div className="page-container pt-6 animate-in">
        <Link href="/home" className="inline-flex items-center gap-1 text-xs text-creative-text font-medium mb-4">‹ Back to Home</Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">✍️</span>
          <h1 className="font-display text-xl font-bold text-cherish-900">Creative Studio</h1>
        </div>
        <p className="text-xs text-cherish-900/50 mb-5">Your creative space — for bloggers, writers, songwriters, and anyone with an idea.</p>
        <div className="flex flex-col gap-2">
          {subModes.map((m) => (
            <button key={m.id} onClick={() => setSelectedMode(m.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-[1.5px] text-left transition-all hover:-translate-y-0.5 hover:shadow-md bg-${m.color}-50 border-${m.color}-200 text-${m.color}-800`}>
              <span className="text-2xl w-10 text-center">{m.icon}</span>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{m.name}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{m.hint}</div>
              </div>
              <span className="text-sm opacity-30">›</span>
            </button>
          ))}
        </div>
        <div className="bottom-nav-spacer" />
      </div>
    );
  }

  const mode = subModes.find((m) => m.id === selectedMode)!;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="page-container pt-6 animate-in">
      <button onClick={() => setSelectedMode(null)} className="inline-flex items-center gap-1 text-xs font-medium mb-4" style={{ color: mode.accent }}>
        ‹ Back to modes
      </button>

      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl">{mode.icon}</span>
        <div>
          <h1 className="font-display text-lg font-bold text-cherish-900">{mode.name}</h1>
          <p className="text-[10px] text-cherish-900/40">{mode.hint}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="label-upper block mb-1.5">Title</label>
        <input className="input-field font-display text-lg" placeholder="Give it a title..." value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="mb-2">
        <label className="label-upper block mb-1.5">Content</label>
        <textarea
          className="input-field font-body text-sm resize-none min-h-[280px] leading-relaxed"
          placeholder={mode.placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-between mt-1">
          <p className="text-[10px] text-cherish-900/30">{wordCount} words</p>
          <p className="text-[10px] text-cherish-900/30">{content.length} characters</p>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="label-upper block mb-1.5">Tags</label>
        <div className="flex gap-1.5 flex-wrap mb-1.5">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
              #{t}
              <button onClick={() => setTags(tags.filter((x) => x !== t))} className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input-field flex-1 !py-1.5 text-xs" placeholder="Add a tag..." value={tagInput}
            onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
          <button onClick={addTag} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: `${mode.accent}15`, color: mode.accent }}>Add</button>
        </div>
      </div>

      {/* Privacy */}
      <div className="mb-5">
        <label className="label-upper block mb-1.5">Privacy</label>
        <div className="flex gap-2">
          {[
            { id: "PRIVATE", label: "🔒 Private" },
            { id: "FAMILY_CIRCLE", label: "👨‍👩‍👧 Family" },
            { id: "PUBLIC", label: "🌍 Public" },
          ].map((p) => (
            <button key={p.id} onClick={() => setPrivacy(p.id)}
              className={`flex-1 py-2 rounded-xl border-[1.5px] text-xs font-medium text-center transition-all ${
                privacy === p.id ? "border-cherish-500 bg-cherish-50 text-cherish-700" : "border-cherish-300 text-cherish-900/40"
              }`}>{p.label}</button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="btn-primary w-full text-base py-4" style={{ backgroundColor: mode.accent }}>
        {saving ? "Saving..." : `Save ${mode.name} ✍️`}
      </button>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
