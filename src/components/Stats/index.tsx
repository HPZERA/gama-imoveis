import { createClient } from "@/lib/supabase/server";
import StatsClient from "./Client";

export default async function Stats() {
  const supabase = await createClient();
  const { count: dbCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("active", true);

  return <StatsClient totalProperties={dbCount ?? 0} />;
}
