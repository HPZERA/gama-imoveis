import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_PREFIX: Record<string, string> = {
  "Casa":           "CA",
  "Apartamento":    "AP",
  "Sala Comercial": "SC",
  "Terreno":        "TE",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "";
  const prefix = CATEGORY_PREFIX[category];

  if (!prefix) {
    return NextResponse.json({ code: "" });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("code")
    .like("code", `${prefix}-%`);

  let max = 0;
  for (const row of data ?? []) {
    const num = parseInt((row.code ?? "").split("-")[1] ?? "0", 10);
    if (!isNaN(num) && num > max) max = num;
  }

  const next = String(max + 1).padStart(3, "0");
  return NextResponse.json({ code: `${prefix}-${next}` });
}
