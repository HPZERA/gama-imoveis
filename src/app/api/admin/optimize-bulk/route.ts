import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyWatermark, isAdminUploadFilename } from "@/lib/imageWatermark";

type ImageLogEntry = {
  filename: string;
  action: "reprocessed" | "skipped_legacy" | "skipped_no_original" | "error";
  detail?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { offset = 0 } = await req.json();
    const supabase = await createClient();

    // Fetch config
    let outWidth = 1920;
    let quality = 85;
    try {
      const { data: cfg } = await supabase
        .from("image_config")
        .select("max_width, quality")
        .eq("id", "default")
        .single();
      if (cfg) {
        outWidth = cfg.max_width ?? 1920;
        quality = cfg.quality ?? 85;
      }
    } catch {}

    const outHeight = Math.round(outWidth * 0.75);

    // Get one property at a time to stay within Vercel timeout
    const { data: properties, error } = await supabase
      .from("properties")
      .select("id, images")
      .range(offset, offset)
      .order("created_at");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { count: total } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    if (!properties?.length) {
      return NextResponse.json({
        reprocessed: 0,
        skippedLegacy: 0,
        skippedNoOriginal: 0,
        errors: 0,
        savedBytes: 0,
        savedKB: 0,
        done: true,
        nextOffset: offset,
        totalProperties: total ?? 0,
        log: [],
      });
    }

    const prop = properties[0];
    let reprocessed = 0;
    let skippedLegacy = 0;
    let skippedNoOriginal = 0;
    let errors = 0;
    let savedBytes = 0;
    const log: ImageLogEntry[] = [];

    if (Array.isArray(prop.images)) {
      for (const url of prop.images) {
        const segments = url.split("/");
        const filename = segments[segments.length - 1];

        // Images imported from the legacy site already carry whatever
        // watermark the old site baked in. The system must never composite
        // a new logo on top of them — that's exactly what caused the
        // duplicated-logo bug. Only touch images uploaded through the admin
        // panel (recognizable by their generated filename pattern).
        if (!isAdminUploadFilename(filename)) {
          skippedLegacy++;
          log.push({ filename, action: "skipped_legacy" });
          continue;
        }

        try {
          const { data: info } = await supabase.storage.from("imoveis").info(filename);
          const originalPath = info?.metadata?.original_path as string | undefined;

          if (!originalPath) {
            // Admin-uploaded image from before original-backup tracking existed.
            // Reprocessing it would composite the watermark a second time.
            skippedNoOriginal++;
            log.push({ filename, action: "skipped_no_original" });
            continue;
          }

          const { data: originalFile } = await supabase.storage
            .from("imoveis")
            .download(originalPath);
          if (!originalFile) {
            skippedNoOriginal++;
            log.push({ filename, action: "skipped_no_original", detail: "original ausente no storage" });
            continue;
          }

          const originalBuffer = Buffer.from(await originalFile.arrayBuffer());
          const optimized = await applyWatermark(originalBuffer, outWidth, outHeight, quality);

          const { data: currentFile } = await supabase.storage.from("imoveis").download(filename);
          const currentSize = currentFile ? currentFile.size : 0;
          savedBytes += Math.max(0, currentSize - optimized.length);

          await supabase.storage.from("imoveis").upload(filename, optimized, {
            contentType: "image/webp",
            upsert: true,
            metadata: {
              source: "admin_upload",
              watermarked: "true",
              original_path: originalPath,
              processed_at: new Date().toISOString(),
            },
          });

          reprocessed++;
          log.push({ filename, action: "reprocessed" });
        } catch (e: any) {
          errors++;
          log.push({ filename, action: "error", detail: e.message });
        }
      }
    }

    const nextOffset = offset + 1;
    const done = nextOffset >= (total ?? 0);

    return NextResponse.json({
      reprocessed,
      skippedLegacy,
      skippedNoOriginal,
      errors,
      savedBytes,
      savedKB: Math.round(savedBytes / 1024),
      nextOffset,
      done,
      totalProperties: total ?? 0,
      log,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
