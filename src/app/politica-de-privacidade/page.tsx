import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Política de Privacidade | Gama Imóveis",
  description: "Como a Gama Imóveis coleta, usa e protege os dados dos seus visitantes e clientes.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold text-charcoal font-display mb-2">
            Política de Privacidade
          </h1>
          <p className="text-sm text-gray-text mb-10">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
          </p>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">1. Quais dados coletamos</h2>
              <p>
                Coletamos as informações que você nos envia voluntariamente ao preencher formulários de
                contato ou interesse em um imóvel, como nome, telefone/WhatsApp, e-mail e a mensagem
                enviada. Também podemos coletar dados de navegação básicos (como páginas visitadas) para
                entender o uso do site.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">2. Como usamos seus dados</h2>
              <p>
                Usamos seus dados exclusivamente para entrar em contato sobre imóveis de seu interesse,
                responder suas solicitações e melhorar nossos serviços. Não vendemos nem compartilhamos
                seus dados com terceiros para fins de marketing de terceiros.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">3. Compartilhamento de dados</h2>
              <p>
                Seus dados podem ser compartilhados com prestadores de serviço que nos ajudam a operar o
                site (como hospedagem e banco de dados), sempre sob obrigação de confidencialidade, ou
                quando exigido por lei.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">4. Seus direitos</h2>
              <p>
                Você pode solicitar a qualquer momento a atualização, correção ou exclusão dos seus dados
                pessoais mantidos por nós, entrando em contato pelo WhatsApp ou e-mail informados no
                rodapé do site.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">5. Cookies</h2>
              <p>
                Este site pode usar cookies essenciais ao funcionamento das páginas. Veja detalhes em
                nossa <a href="/cookies" className="text-brand underline">Política de Cookies</a>.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-charcoal mb-2">6. Contato</h2>
              <p>
                Dúvidas sobre esta política podem ser enviadas para{" "}
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
