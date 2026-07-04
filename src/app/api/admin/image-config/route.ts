import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULTS = {
  max_width: 1920,
  quality: 85,
  format: "webp",
  webp_enabled: true,
  max_file_size_mb: 10,
  max_images_per_property: 20,
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("image_config")
      .select("*")
      .eq("id", "default")
      .single();
    return NextResponse.json(data ?? DEFAULTS);
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();
    const { error } = await supabase.from("image_config").upsert({
      id: "default",
      max_width: Number(body.max_width) || 1920,
      quality: Number(body.quality) || 85,
      format: body.format || "webp",
      webp_enabled: Boolean(body.webp_enabled),
      max_file_size_mb: Number(body.max_file_size_mb) || 10,
      max_images_per_property: Number(body.max_images_per_property) || 20,
      updated_at: new Date().toISOString(),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
