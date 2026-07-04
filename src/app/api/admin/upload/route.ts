import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const LOGO_PATH = join(process.cwd(), "public", "logo admin.png");
const OPACITY = 0.65;

async function getConfig(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data } = await supabase
      .from("image_config")
      .select("max_width, quality")
      .eq("id", "default")
      .single();
    return data;
  } catch {
    return null;
  }
}

async function applyWatermark(
  fileBuffer: Buffer,
  outWidth: number,
  outHeight: number,
  quality: number
): Promise<Buffer> {
  const image = sharp(fileBuffer).resize(outWidth, outHeight, {
    fit: "cover",
    position: "center",
  });

  if (!existsSync(LOGO_PATH)) {
    return image.webp({ quality }).toBuffer();
  }

  const logoWidth = Math.round(outWidth * 0.42);
  const resizedBuffer = await sharp(readFileSync(LOGO_PATH))
    .resize(logoWidth)
    .ensureAlpha()
    .toBuffer();

  const { data, info } = await sharp(resizedBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * OPACITY);
  }

  const logoFinal = await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  const left = Math.round((outWidth - logoWidth) / 2);
  const top = Math.round(outHeight * 0.8 - info.height / 2);

  return image
    .composite([{ input: logoFinal, left, top, blend: "over" }])
    .webp({ quality })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const supabase = await createClient();
  const config = await getConfig(supabase);

  const outWidth = config?.max_width ?? 1920;
  const quality = config?.quality ?? 85;
  const outHeight = Math.round(outWidth * 0.75); // 4:3

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  // Capture original metadata before processing
  let originalWidth: number | undefined;
  let originalHeight: number | undefined;
  try {
    const meta = await sharp(rawBuffer).metadata();
    originalWidth = meta.width;
    originalHeight = meta.height;
  } catch {}

  const originalSize = rawBuffer.length;

  let finalBuffer: Buffer;
  try {
    finalBuffer = await applyWatermark(rawBuffer, outWidth, outHeight, quality);
  } catch {
    finalBuffer = rawBuffer;
  }

  const optimizedSize = finalBuffer.length;

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { error } = await supabase.storage
    .from("imoveis")
    .upload(path, finalBuffer, { contentType: "image/webp" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("imoveis").getPublicUrl(path);

  return NextResponse.json({
    url: data.publicUrl,
    originalSize,
    optimizedSize,
    originalWidth,
    originalHeight,
    optimizedWidth: outWidth,
    optimizedHeight: outHeight,
  });
}
