// Cache a página por até 1h; qualquer alteração no painel admin já invalida
// esse cache na hora via revalidatePath (ver src/app/api/admin/properties/route.ts).
export const revalidate = 3600;

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Banner from "@/components/Banner";
import Categories from "@/components/Categories";
import FeaturedProperties from "@/components/FeaturedProperties";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Banner />
        <Categories />
        <FeaturedProperties />
        <About />
        <Services />
        <Contact />
        <CtaBanner />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
