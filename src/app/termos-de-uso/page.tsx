import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Termos de Uso | Gama Imóveis",
  description: "Condições de uso do site da Gama Imóveis.",
};

export default function TermosDeUsoPage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-charcoal font-display mb-2">Termos de Uso</h1>
          <p className="text-sm text-gray-text mb-10">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
          </p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">1. Aceitação dos termos</h2>
              <p>
                Ao acessar e usar o site da Gama Imóveis, você concorda com estes Termos de Uso. Se você
                não concordar com algum dos termos, pedimos que não utilize o site.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">2. Informações sobre imóveis</h2>
              <p>
                As informações, fotos e valores dos imóveis anunciados são fornecidas com base nos dados
                disponíveis no momento da publicação e podem ser alteradas sem aviso prévio. Recomendamos
                sempre confirmar condições, disponibilidade e valores diretamente com um de nossos
                consultores antes de tomar qualquer decisão.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">3. Uso permitido</h2>
              <p>
                O conteúdo deste site é destinado ao uso pessoal de quem busca imóveis. Não é permitido
                copiar, reproduzir ou redistribuir o conteúdo do site para fins comerciais sem autorização
                prévia.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">4. Formulários e contato</h2>
              <p>
                Ao preencher um formulário de contato, você concorda em fornecer informações verdadeiras e
                autoriza a Gama Imóveis a entrar em contato pelos canais informados (telefone, WhatsApp ou
                e-mail).
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">5. Alterações</h2>
              <p>
                Estes termos podem ser atualizados periodicamente. A versão vigente é sempre a publicada
                nesta página.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">6. Contato</h2>
              <p>
                Dúvidas sobre estes termos podem ser enviadas para{" "}
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
