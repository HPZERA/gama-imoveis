import { getActiveProperties } from "@/lib/properties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PropertyList from "@/components/PropertyList";

type SearchParams = { tipo?: string; categoria?: string; busca?: string; precoMax?: string };

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tipo, categoria, busca, precoMax } = await searchParams;

  const properties = await getActiveProperties();

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <PropertyList
          properties={properties ?? []}
          initialType={(tipo === "venda" || tipo === "aluguel") ? tipo : "all"}
          initialCategory={categoria ?? "Todos"}
          initialSearch={busca ?? ""}
          initialMaxPrice={precoMax ? Number(precoMax) : null}
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
