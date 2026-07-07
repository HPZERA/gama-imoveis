import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/zoom";
import "swiper/css/keyboard";
import ClientProviders from "@/components/ClientProviders";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "Gama Imóveis | Imobiliária em São Gabriel e Região, RS";
const DESCRIPTION =
  "Há mais de 4 anos conectando pessoas aos melhores imóveis de São Gabriel e região (RS). Especialistas em compra, venda e locação de imóveis residenciais e comerciais.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "imóveis, imobiliária, comprar imóvel, alugar imóvel, São Gabriel, Rio Grande do Sul, apartamento, casa, terreno",
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/LOGO.png", width: 1254, height: 1254, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/LOGO.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/LOGO.png`,
  telephone: "+5555992103520",
  email: "contato@gamaimoveis.com.br",
  areaServed: "São Gabriel e região, RS",
  sameAs: [
    "https://www.instagram.com/gamaimoveissg/",
    "https://www.facebook.com/gamaimoveissg",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
