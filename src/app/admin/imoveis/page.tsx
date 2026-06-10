import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/AdminShell";
import ImoveisAdminList from "@/components/admin/ImoveisAdminList";

export default async function ImoveisPage() {
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <AdminShell>
      <div className="p-3 md:p-6 max-w-6xl mx-auto">
        <ImoveisAdminList properties={properties ?? []} />

      </div>
    </AdminShell>
  );
}
