import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Páginas e queries de imóveis ficam em cache por até 1h (page-level na home,
// data-level via unstable_cache nas demais — ver src/lib/properties.ts); toda
// mutação aqui invalida os dois na hora para o site nunca ficar desatualizado
// após uma alteração no painel.
function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/imoveis");
  revalidatePath("/imoveis/[id]", "page");
  // { expire: 0 } forces immediate expiration (this Next version's default
  // revalidateTag(tag) is stale-while-revalidate, which would still serve
  // the old data once more before refreshing — not what an admin edit needs).
  revalidateTag("properties", { expire: 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = await createClient();
  const { error } = await supabase.from("properties").insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  const supabase = await createClient();
  const { error } = await supabase.from("properties").update(data).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const supabase = await createClient();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json({ ok: true });
}
