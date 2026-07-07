import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import sharp from "sharp";
import { applyWatermark, ORIGINALS_PREFIX } from "@/lib/imageWatermark";
import { requireAdminAuth } from "@/lib/adminAuth";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

async function getConfig(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data } = await supabase
      .from("image_config")
      .select("max_width, quality, max_file_size_mb")
      .eq("id", "default")
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Formato de arquivo não permitido. Envie JPEG, PNG, WebP ou AVIF." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const config = await getConfig(supabase);

  const outWidth = config?.max_width ?? 1920;
  const quality = config?.quality ?? 85;
  const maxFileSizeBytes = (config?.max_file_size_mb ?? 10) * 1024 * 1024;

  if (file.size > maxFileSizeBytes) {
    return NextResponse.json(
      { error: `Arquivo muito grande. Limite: ${config?.max_file_size_mb ?? 10}MB.` },
      { status: 400 }
    );
  }
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
    // Se o sharp não consegue processar o arquivo, ele não é uma imagem válida
    // (apesar do Content-Type declarado) — nunca subir os bytes crus e não
    // confiáveis para o Storage.
    return NextResponse.json({ error: "Arquivo de imagem inválido ou corrompido" }, { status: 400 });
  }

  const optimizedSize = finalBuffer.length;

  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const originalPath = `${ORIGINALS_PREFIX}/${path}`;

  // Keep the pre-watermark original so this photo can be safely reprocessed
  // later (e.g. after a quality/width config change) without ever compositing
  // the watermark on top of itself.
  const { error: originalError } = await supabase.storage
    .from("imoveis")
    .upload(originalPath, rawBuffer, {
      contentType: file.type || "application/octet-stream",
    });

  const { error } = await supabase.storage.from("imoveis").upload(path, finalBuffer, {
    contentType: "image/webp",
    metadata: {
      source: "admin_upload",
      watermarked: "true",
      original_path: originalError ? "" : originalPath,
      processed_at: new Date().toISOString(),
    },
  });

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
