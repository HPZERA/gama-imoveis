import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const LOGO_PATH = join(process.cwd(), "public", "logo admin.png");
// Proporção 4:3 — padrão fotografia imobiliária, todas as imagens ficam iguais
const OUT_WIDTH = 1920;
const OUT_HEIGHT = 1440;
const OPACITY = 0.65;

async function applyWatermark(fileBuffer: Buffer): Promise<Buffer> {
  // Corta e redimensiona para 1920×1440 (4:3) centralizado — garante tamanho igual em todas
  const image = sharp(fileBuffer).resize(OUT_WIDTH, OUT_HEIGHT, {
    fit: "cover",
    position: "center",
  });

  if (!existsSync(LOGO_PATH)) {
    return image.webp({ quality: 85 }).toBuffer();
  }

  // Logo sempre com 42% da largura → mesmo tamanho em todas as imagens
  const logoWidth = Math.round(OUT_WIDTH * 0.42);
  const resizedBuffer = await sharp(readFileSync(LOGO_PATH))
    .resize(logoWidth)
    .ensureAlpha()
    .toBuffer();

  // Aplica 65% de opacidade manipulando o canal alpha (byte 3 de cada pixel RGBA)
  const { data, info } = await sharp(resizedBuffer).raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * OPACITY);
  }
  const logoFinal = await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();

  // Posição fixa: centralizado horizontalmente, 80% para baixo verticalmente
  const left = Math.round((OUT_WIDTH - logoWidth) / 2);
  const top = Math.round(OUT_HEIGHT * 0.80 - info.height / 2);

  return image
    .composite([{ input: logoFinal, left, top, blend: "over" }])
    .webp({ quality: 85 })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  let finalBuffer: Buffer;
  try {
    finalBuffer = await applyWatermark(rawBuffer);
  } catch {
    finalBuffer = rawBuffer;
  }

  const supabase = await createClient();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  const { error } = await supabase.storage
    .from("imoveis")
    .upload(path, finalBuffer, { contentType: "image/webp" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("imoveis").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
