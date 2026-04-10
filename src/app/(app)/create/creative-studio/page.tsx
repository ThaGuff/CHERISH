"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const subModes = [
  { id: "blog_post", icon: "📝", name: "Blog Post Draft", hint: "Title, intro, sections, photos. Ready to publish.", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { id: "short_story", icon: "📕", name: "Short Story", hint: "Fiction, nonfiction, memoir. Tell a story.", color: "bg-rose-50 border-rose-200 text-rose-800" },
  { id: "song_lyrics", icon: "🎵", name: "Song Lyrics & Melody", hint: "Write lyrics. Hum a melody. Save both.", color: "bg-purple-50 border-purple-200 text-purple-800" },
  { id: "idea_dump", icon: "💡", name: "Idea Dump", hint: "Brain dump. No structure needed. Just capture it.", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
  { id: "content_calendar", icon: "📅", name: "Content Calendar", hint: "Plan your posts, reels, and content.", color: "bg-blue-50 border-blue-200 text-blue-800" },
  { id: "voice_to_text", icon: "🎙️", name: "Voice Note to Text", hint: "Speak it. We'll write it down. (Pro)", color: "bg-green-50 border-green-200 text-green-800" },
];

export default function CreativeStudioPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CREATIVE",
          title: title || subModes.find((m) => m.id === selectedMode)?.name || "Creative Post",
          creativePost: {
            subType: selectedMode,
            content: { text: content, title },
          },
        }),
      });
      router.push("/home");
    } finally {
      setSaving(false);
    }
  }

  if (!selectedMode) {
    return (
      <div className="page-container pt-6 animate-in">
        <Link href="/home" className="inline-flex items-center gap-1 text-xs text-creative-text mb-4">‹ Home</Link>
        <h1 className="font-display text-xl font-bold text-cherish-900 mb-1">Creative Studio</h1>
        <p className="text-xs text-cherish-900/50 mb-5">Your creative space — for bloggers, writers, songwriters, and anyone with an idea.</p>
        <div className="flex flex-col gap-2">
          {subModes.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id)}
              className={`flex items-center gap-3 p-3 rounded-card border-[1.5px] text-left transition-all hover:-translate-y-0.5 ${m.color}`}
            >
              <span className="text-xl w-8 text-center">{m.icon}</span>
              <div>
                <div className="text-[13px] font-medium">{m.name}</div>
                <div className="text-[10px] opacity-70">{m.hint}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="bottom-nav-spacer" />
      </div>
    );
  }

  const mode = subModes.find((m) => m.id === selectedMode)!;
  return (
    <div className="page-container pt-6 animate-in">
      <button onClick={() => setSelectedMode(null)} className="inline-flex items-center gap-1 text-xs text-creative-text mb-4">
        ‹ Back
      </button>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{mode.icon}</span>
        <h1 className="font-display text-lg font-bold text-cherish-900">{mode.name}</h1>
      </div>

      <input
        className="input-field font-display text-lg mb-4"
        placeholder="Give it a title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="input-field font-body text-sm resize-none min-h-[300px]"
        placeholder={
          selectedMode === "blog_post" ? "Start writing your blog post..." :
          selectedMode === "short_story" ? "Once upon a time..." :
          selectedMode === "song_lyrics" ? "Write your lyrics here..." :
          selectedMode === "idea_dump" ? "Just start typing. No rules." :
          selectedMode === "content_calendar" ? "Plan your content..." :
          "Start speaking or typing..."
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-4 !bg-creative-text">
        {saving ? "Saving..." : `Save ${mode.name} ✍️`}
      </button>

      <div className="bottom-nav-spacer" />
    </div>
  );
}
