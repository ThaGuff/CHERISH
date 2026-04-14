import { getUser } from "@/lib/supabase-server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authUser = await getUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const memoryId = formData.get("memoryId") as string | null;

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();
    const uploaded: { url: string; thumbUrl: string; name: string }[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${authUser.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { data, error } = await supabase.storage
        .from("cherish-uploads")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("cherish-uploads")
        .getPublicUrl(data.path);

      uploaded.push({
        url: urlData.publicUrl,
        thumbUrl: urlData.publicUrl,
        name: file.name,
      });
    }

    // If memoryId provided, create photo records
    if (memoryId && uploaded.length > 0) {
      const existingCount = await prisma.photo.count({ where: { memoryId } });
      await prisma.photo.createMany({
        data: uploaded.map((u, i) => ({
          memoryId,
          url: u.url,
          thumbUrl: u.thumbUrl,
          caption: "",
          order: existingCount + i,
        })),
      });
    }

    return NextResponse.json({ uploaded, count: uploaded.length });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
