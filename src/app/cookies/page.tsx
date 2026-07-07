import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Política de Cookies | Gama Imóveis",
  description: "Como o site da Gama Imóveis usa cookies.",
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-charcoal font-display mb-2">Política de Cookies</h1>
          <p className="text-sm text-gray-text mb-10">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
          </p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">O que são cookies</h2>
              <p>
                Cookies são pequenos arquivos armazenados no seu navegador que ajudam sites a funcionar
                corretamente e a lembrar preferências entre visitas.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">Como usamos cookies</h2>
              <p>
                Usamos apenas o armazenamento local do navegador para lembrar os imóveis que você marcou
                como favoritos neste dispositivo — essa informação não é enviada aos nossos servidores nem
                compartilhada com terceiros. Não usamos cookies de rastreamento publicitário.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">Como gerenciar</h2>
              <p>
                Você pode limpar os dados armazenados pelo site a qualquer momento nas configurações de
                privacidade do seu navegador, o que também apagará sua lista de favoritos salva localmente.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">Contato</h2>
              <p>
                Dúvidas? Fale conosco em{" "}
                <a href="mailto:contato@gamaimoveis.com.br" className="text-brand underline">
                  contato@gamaimoveis.com.br
                </a>{" "}
                ou pelo WhatsApp (55) 99210-3520.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
