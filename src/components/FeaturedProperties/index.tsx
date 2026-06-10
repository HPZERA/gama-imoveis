import { createClient } from "@/lib/supabase/server";
import type { DbProperty } from "@/types";
import FeaturedClient from "./Client";

export default async function FeaturedProperties() {
  const supabase = await createClient();

  const { data: featured } = await supabase
    .from("properties")
    .select("*")
    .eq("featured", true)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(9);

  let properties: DbProperty[] = featured ?? [];

  if (properties.length < 3) {
    const { data: recent } = await supabase
      .from("properties")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(9);

    const existingIds = new Set(properties.map((p) => p.id));
    const extras = (recent ?? []).filter((p) => !existingIds.has(p.id));
    properties = [...properties, ...extras].slice(0, 9);
  }

  if (properties.length === 0) return null;

  return <FeaturedClient properties={properties} />;
}
