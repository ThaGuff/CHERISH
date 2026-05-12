import { getUser } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { canAccess } from "@/lib/tier-limits";

export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!canAccess(user.tier, "voiceMemos")) {
    return NextResponse.json(
      { error: "Voice memos require a Pro subscription." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob | null;
    const mode = (formData.get("mode") as string) || "memory_note";
    const memoryId = formData.get("memoryId") as string | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Send to OpenAI Whisper API
    const whisperForm = new FormData();
    whisperForm.append("file", audioFile, "recording.webm");
    whisperForm.append("model", "whisper-1");
    whisperForm.append("response_format", "verbose_json");
    whisperForm.append("timestamp_granularities[]", "segment");

    const whisperRes = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: whisperForm,
      }
    );

    if (!whisperRes.ok) {
      const errBody = await whisperRes.text();
      console.error("Whisper API error:", errBody);
      return NextResponse.json(
        { error: "Transcription failed" },
        { status: 502 }
      );
    }

    const whisperData = await whisperRes.json();

    // Store the voice memo record
    const voiceMemo = await prisma.voiceMemo.create({
      data: {
        userId: user.id,
        memoryId: memoryId || undefined,
        audioUrl: "", // Will be updated after Supabase storage upload
        transcript: whisperData.text,
        duration: Math.round(whisperData.duration || 0),
        mode,
      },
    });

    return NextResponse.json({
      voiceMemo,
      transcript: whisperData.text,
      segments: whisperData.segments,
      duration: whisperData.duration,
    });
  } catch (error) {
    console.error("Voice transcription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
