import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PropertyList from "@/components/PropertyList";

export const revalidate = 0;

type SearchParams = { tipo?: string; categoria?: string };

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tipo, categoria } = await searchParams;

  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <PropertyList
          properties={properties ?? []}
          initialType={(tipo === "venda" || tipo === "aluguel") ? tipo : "all"}
          initialCategory={categoria ?? "Todos"}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
