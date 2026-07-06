import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DbProperty } from "@/types";

// Data-layer cache for the `properties` table: even on routes forced dynamic
// by searchParams (e.g. /imoveis, /imoveis/[id]), these Supabase round-trips
// get skipped for repeat visits within the revalidate window. Any mutation in
// src/app/api/admin/properties/route.ts calls revalidateTag("properties") to
// bust all of these immediately.

export const getActiveProperties = unstable_cache(
  async (): Promise<DbProperty[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(500);
    return (data as DbProperty[] | null) ?? [];
  },
  ["active-properties"],
  { revalidate: 3600, tags: ["properties"] }
);

export const getPropertyById = unstable_cache(
  async (id: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .eq("active", true)
      .single();
    return data;
  },
  ["property-by-id"],
  { revalidate: 3600, tags: ["properties"] }
);

export const getPropertyMetaById = unstable_cache(
  async (id: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("properties")
      .select("title, description, neighborhood, city, images")
      .eq("id", id)
      .single();
    return data;
  },
  ["property-meta-by-id"],
  { revalidate: 3600, tags: ["properties"] }
);

export const getRelatedProperties = unstable_cache(
  async (currentId: string | number, effectiveType: "venda" | "aluguel" | null) => {
    const supabase = await createClient();
    let listQuery = supabase
      .from("properties")
      .select("*")
      .eq("active", true)
      .neq("id", currentId)
      .order("created_at", { ascending: false })
      .limit(6);
    let countQuery = supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("active", true)
      .neq("id", currentId);

    if (effectiveType) {
      listQuery = listQuery.eq("type", effectiveType);
      countQuery = countQuery.eq("type", effectiveType);
    }

    const [{ data: properties }, { count }] = await Promise.all([listQuery, countQuery]);
    return { properties: (properties as DbProperty[] | null) ?? [], count: count ?? 0 };
  },
  ["related-properties"],
  { revalidate: 3600, tags: ["properties"] }
);
