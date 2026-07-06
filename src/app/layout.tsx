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

export const metadata: Metadata = {
  title: "Gama Imóveis | Imobiliária Premium em São Paulo",
  description:
    "Há mais de 15 anos conectando pessoas aos melhores imóveis da região. Especialistas em compra, venda e locação de imóveis residenciais e comerciais de alto padrão.",
  keywords:
    "imóveis, imobiliária, comprar imóvel, alugar imóvel, São Paulo, apartamento, casa, terreno, alto padrão",
  authors: [{ name: "Gama Imóveis" }],
  openGraph: {
    title: "Gama Imóveis | Imobiliária Premium",
    description: "Especialistas em imóveis de alto padrão há mais de 15 anos.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
