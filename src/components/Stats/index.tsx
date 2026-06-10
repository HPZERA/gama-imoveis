import { createClient } from "@/lib/supabase/server";
import { properties } from "@/data/properties";
import StatsClient from "./Client";

export default async function Stats() {
  const supabase = await createClient();
  const { count: dbCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  const total = properties.length + (dbCount ?? 0);

  return <StatsClient totalProperties={total} />;
}
