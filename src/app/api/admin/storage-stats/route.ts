import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/adminAuth";

export async function GET() {
  if (!(await requireAdminAuth())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const supabase = await createClient();

    const { count: totalProperties } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    const { data: props } = await supabase
      .from("properties")
      .select("images, active");

    let totalImages = 0;
    let activeProperties = 0;

    props?.forEach((p) => {
      if (p.active) activeProperties++;
      if (Array.isArray(p.images)) totalImages += p.images.length;
    });

    const total = totalProperties ?? 0;
    const avgImagesPerProperty =
      total > 0 ? Math.round((totalImages / total) * 10) / 10 : 0;

    // Estimate based on average 280KB per optimized WebP
    const avgFileSizeBytes = 280 * 1024;
    const estimatedSizeBytes = totalImages * avgFileSizeBytes;
    const estimatedSizeMB = Math.round(estimatedSizeBytes / (1024 * 1024));

    return NextResponse.json({
      totalProperties: total,
      activeProperties,
      totalImages,
      avgImagesPerProperty,
      estimatedSizeBytes,
      estimatedSizeMB,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
