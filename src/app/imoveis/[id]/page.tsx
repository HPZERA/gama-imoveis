import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PropertyGallery from "./PropertyGallery";
import { BedDouble, Bath, Square, MapPin, ArrowLeft, MessageCircle, Car } from "lucide-react";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";

export const revalidate = 0;

function formatPrice(price: number | null, label: string | null, type: "venda" | "aluguel") {
  if (label) return label;
  if (!price) return "Consulte";
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
  return type === "aluguel" ? `${formatted}/mês` : formatted;
}

const SITE_URL = "https://gama-imoveis-xi.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("title, description, neighborhood, city, images")
    .eq("id", id)
    .single();

  if (!data) return { title: "Imóvel não encontrado | Gama Imóveis" };

  const description = data.description ?? `${data.title} em ${[data.neighborhood, data.city].filter(Boolean).join(", ")}`;
  const ogImage = (data.images as string[] | null)?.[0];

  return {
    title: `${data.title} | Gama Imóveis`,
    description,
    openGraph: {
      title: `${data.title} | Gama Imóveis`,
      description,
      url: `${SITE_URL}/imoveis/${id}`,
      siteName: "Gama Imóveis",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: data.title }] } : {}),
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: p } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("active", true)
    .single();

  if (!p) notFound();

  const images: string[] = p.images ?? [];
  const price = formatPrice(p.price, p.price_label, p.type);

  const waText = encodeURIComponent(
    `Olá! Tenho interesse no imóvel: ${p.title}${p.code ? ` (Cód: ${p.code})` : ""}.\n\n${SITE_URL}/imoveis/${p.id}\n\nPoderia me passar mais informações?`
  );
  const waUrl = `https://wa.me/5555992103520?text=${waText}`;

  const detailRows = [
    p.bedrooms ? { icon: BedDouble, label: "Dormitórios", value: `${p.bedrooms}`, key: "bed" } : null,
    p.suites ? { icon: BedDouble, label: "Suítes", value: `${p.suites}`, key: "suite" } : null,
    p.bathrooms ? { icon: Bath, label: "Banheiros", value: `${p.bathrooms}`, key: "bath" } : null,
    p.parking_spots ? { icon: Car, label: "Vagas", value: `${p.parking_spots}`, key: "park" } : null,
    p.land_area ? { icon: Square, label: "Terreno", value: `${p.land_area}m²`, key: "land" } : null,
    p.built_area ? { icon: Square, label: "Área construída", value: `${p.built_area}m²`, key: "built" } : null,
    !p.land_area && !p.built_area && p.area ? { icon: Square, label: "Área", value: `${p.area}m²`, key: "area" } : null,
    p.neighborhood ? { icon: MapPin, label: "Bairro", value: p.neighborhood, key: "neighborhood" } : null,
    p.city ? { icon: MapPin, label: "Cidade", value: p.city, key: "city" } : null,
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string; key: string }[];

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-gray-50">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-brand transition-colors">Início</Link>
            <span>/</span>
            <Link href="/imoveis" className="hover:text-brand transition-colors">Imóveis</Link>
            <span>/</span>
            <span className="text-charcoal font-medium line-clamp-1">{p.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">

          {/* Back link */}
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-charcoal transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            Voltar ao catálogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">

            {/* Gallery */}
            <PropertyGallery images={images} title={p.title} />

            {/* Info Panel */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-7">

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      p.type === "venda" ? "bg-charcoal text-white" : "bg-wood text-white"
                    }`}
                  >
                    {p.type === "venda" ? "Venda" : "Locação"}
                  </span>
                  {p.category && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-light text-brand-hover border border-brand/20">
                      {p.category}
                    </span>
                  )}
                  {p.badge && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="text-4xl sm:text-[2.75rem] font-bold text-charcoal font-display leading-tight tracking-tight">
                  {price}
                </p>

                {/* Title */}
                <h1 className="mt-2 text-2xl font-bold text-charcoal font-display leading-snug">
                  {p.title}
                </h1>

                {/* Feature grid */}
                {detailRows.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 mt-6">
                    {detailRows.map(({ icon: Icon, label, value, key }) => (
                      <div
                        key={key}
                        className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5"
                      >
                        <Icon size={18} className="text-brand shrink-0" />
                        <div className="leading-tight min-w-0">
                          <p className="text-sm font-bold text-charcoal truncate">{value}</p>
                          <p className="text-xs text-gray-500">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Address */}
                {(p.address || p.neighborhood || p.city) && (
                  <div className="flex items-start gap-2.5 text-sm text-gray-600 mt-6">
                    <MapPin size={16} className="text-brand flex-shrink-0 mt-0.5" />
                    {p.address ? (
                      <div className="leading-snug">
                        <p>{[p.address, p.neighborhood].filter(Boolean).join(", ")}</p>
                        {p.city && <p>{p.city}</p>}
                      </div>
                    ) : (
                      <p className="leading-snug">
                        {[p.neighborhood, p.city].filter(Boolean).join(" - ")}
                      </p>
                    )}
                  </div>
                )}

                {/* CTA buttons */}
                <div className="mt-6 space-y-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1ea855] text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg text-sm"
                  >
                    <svg viewBox="0 0 32 32" width="20" height="20" fill="white">
                      <path d="M16.004 0C7.164 0 .003 7.16.003 16c0 2.824.738 5.47 2.03 7.77L.003 32l8.463-2.01A15.94 15.94 0 0016.004 32C24.84 32 32 24.84 32 16S24.84 0 16.004 0zm0 29.23a13.2 13.2 0 01-6.73-1.84l-.482-.286-4.997 1.186 1.23-4.865-.316-.5A13.19 13.19 0 012.77 16c0-7.297 5.937-13.23 13.234-13.23 7.296 0 13.228 5.933 13.228 13.23 0 7.296-5.932 13.23-13.228 13.23zm7.26-9.907c-.398-.2-2.355-1.162-2.72-1.295-.366-.133-.632-.2-.898.2-.266.398-1.03 1.295-1.264 1.56-.232.267-.464.3-.862.1-.398-.2-1.68-.62-3.2-1.98-1.183-1.057-1.98-2.362-2.213-2.76-.232-.398-.025-.613.175-.81.18-.178.398-.465.597-.697.2-.233.266-.4.4-.664.132-.267.066-.5-.034-.698-.1-.2-.898-2.162-1.23-2.96-.325-.778-.655-.672-.898-.685-.232-.01-.498-.013-.764-.013-.267 0-.697.1-1.063.498-.365.398-1.394 1.362-1.394 3.324 0 1.962 1.427 3.858 1.627 4.125.2.266 2.81 4.29 6.808 6.017.952.41 1.695.655 2.274.838.955.303 1.826.26 2.514.158.767-.114 2.355-.963 2.688-1.893.332-.93.332-1.728.232-1.893-.1-.167-.366-.267-.764-.465z" />
                    </svg>
                    Tenho interesse neste imóvel
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border-2 border-brand text-brand hover:bg-brand hover:text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm"
                  >
                    <MessageCircle size={16} />
                    Agendar visita
                  </a>
                </div>

                {/* Description */}
                {p.description && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h2 className="text-sm font-bold text-charcoal uppercase tracking-wide mb-2.5">
                      Descrição do imóvel
                    </h2>
                    <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {p.description}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
