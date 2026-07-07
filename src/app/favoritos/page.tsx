import { getActiveProperties } from "@/lib/properties";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FavoritesGrid from "@/components/FavoritesGrid";

export const metadata = {
  title: "Meus Favoritos | Gama Imóveis",
  description: "Imóveis que você salvou para comparar depois na Gama Imóveis.",
};

export default async function FavoritosPage() {
  const properties = await getActiveProperties();

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-2xl lg:text-3xl font-bold text-charcoal font-display mb-8">
            Meus Favoritos
          </h1>
          <FavoritesGrid properties={properties ?? []} />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
