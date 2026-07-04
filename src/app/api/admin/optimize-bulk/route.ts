import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const LOGO_PATH = join(process.cwd(), "public", "logo admin.png");
const OPACITY = 0.65;

async function reprocess(
  rawBuffer: Buffer,
  width: number,
  height: number,
  quality: number
): Promise<Buffer> {
  const image = sharp(rawBuffer).resize(width, height, {
    fit: "cover",
    position: "center",
  });

  if (!existsSync(LOGO_PATH)) {
    return image.webp({ quality }).toBuffer();
  }

  const logoWidth = Math.round(width * 0.42);
  const resized = await sharp(readFileSync(LOGO_PATH))
    .resize(logoWidth)
    .ensureAlpha()
    .toBuffer();

  const { data, info } = await sharp(resized).raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * OPACITY);
  }
  const logoFinal = await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  const left = Math.round((width - logoWidth) / 2);
  const top = Math.round(height * 0.8 - info.height / 2);

  return image
    .composite([{ input: logoFinal, left, top, blend: "over" }])
    .webp({ quality })
    .toBuffer();
}

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
      return NextResponse.json({ processed: 0, savedBytes: 0, done: true, nextOffset: offset, totalProperties: total ?? 0 });
    }

    const prop = properties[0];
    let processed = 0;
    let savedBytes = 0;

    if (Array.isArray(prop.images)) {
      for (const url of prop.images) {
        try {
          const segments = url.split("/");
          const filename = segments[segments.length - 1];

          const { data: fileData } = await supabase.storage
            .from("imoveis")
            .download(filename);
          if (!fileData) continue;

          const original = Buffer.from(await fileData.arrayBuffer());
          const optimized = await reprocess(original, outWidth, outHeight, quality);

          const saving = original.length - optimized.length;
          savedBytes += Math.max(0, saving);

          await supabase.storage
            .from("imoveis")
            .upload(filename, optimized, { contentType: "image/webp", upsert: true });

          processed++;
        } catch {
          // skip failed images
        }
      }
    }

    const nextOffset = offset + 1;
    const done = nextOffset >= (total ?? 0);

    return NextResponse.json({
      processed,
      savedBytes,
      savedKB: Math.round(savedBytes / 1024),
      nextOffset,
      done,
      totalProperties: total ?? 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
