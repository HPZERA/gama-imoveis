import { createClient } from "@/lib/supabase/server";
import { categories } from "@/data/properties";
import CategoriesClient from "./Client";

const DB_CATEGORY_TO_TYPE: Record<string, string> = {
  "Casa": "house",
  "Apartamento": "apartment",
  "Comercial": "commercial",
  "Terreno": "land",
};

export default async function Categories() {
  const supabase = await createClient();
  const { data: dbProps } = await supabase
    .from("properties")
    .select("category")
    .eq("active", true);

  const dbCounts: Record<string, number> = {};
  for (const p of dbProps ?? []) {
    const type = DB_CATEGORY_TO_TYPE[p.category ?? ""];
    if (type) dbCounts[type] = (dbCounts[type] ?? 0) + 1;
  }

  const updated = categories.map((cat) => ({
    ...cat,
    count: dbCounts[cat.type] ?? cat.count,
  }));

  return <CategoriesClient categories={updated} />;
}
