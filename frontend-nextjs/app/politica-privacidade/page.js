export const metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e proteção de dados do BocaNoticias',
  openGraph: {
    locale: 'pt_BR',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-xl text-white/90">Última atualização: Janeiro de 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground leading-relaxed">
              O BocaNoticias está comprometido em proteger sua privacidade. Esta política descreve como coletamos, 
              usamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Informações que Coletamos</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.1 Informações Fornecidas por Você:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nome e endereço de e-mail (newsletter)</li>
                  <li>Comentários e interações nas notícias</li>
                  <li>Preferências de cookies e configurações</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.2 Informações Coletadas Automaticamente:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Endereço IP e localização aproximada</li>
                  <li>Tipo de navegador e dispositivo</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Como Usamos Suas Informações</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Fornecer e melhorar nossos serviços</li>
              <li>Enviar newsletters e atualizações (com seu consentimento)</li>
              <li>Analisar o uso do site e melhorar a experiência do usuário</li>
              <li>Prevenir fraudes e garantir a segurança do site</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos cookies para melhorar sua experiência. Você pode gerenciar suas preferências de cookies 
              através do banner que aparece na primeira visita ou acessando as configurações do seu navegador.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border-l-4 border-blue-600">
              <p className="text-sm">
                <strong>Tipos de cookies que usamos:</strong> Necessários, Análise, Marketing e Preferências.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Não vendemos suas informações pessoais. Podemos compartilhar dados com:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li>Prestadores de serviços (hospedagem, analytics)</li>
              <li>Autoridades legais quando exigido por lei</li>
              <li>Parceiros de publicidade (dados anônimos)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Seus Direitos (LGPD)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-xl">
                <h3 className="font-semibold mb-2">✓ Acesso</h3>
                <p className="text-sm text-muted-foreground">Solicitar cópia dos seus dados</p>
              </div>
              <div className="p-4 bg-secondary rounded-xl">
                <h3 className="font-semibold mb-2">✓ Correção</h3>
                <p className="text-sm text-muted-foreground">Corrigir dados incorretos</p>
              </div>
              <div className="p-4 bg-secondary rounded-xl">
                <h3 className="font-semibold mb-2">✓ Exclusão</h3>
                <p className="text-sm text-muted-foreground">Solicitar remoção dos dados</p>
              </div>
              <div className="p-4 bg-secondary rounded-xl">
                <h3 className="font-semibold mb-2">✓ Portabilidade</h3>
                <p className="text-sm text-muted-foreground">Transferir dados para outro serviço</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Segurança</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, 
              perda ou alteração. Isso inclui criptografia, firewalls e controles de acesso rigorosos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Retenção de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos suas informações apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, 
              ou conforme exigido por lei.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Alterações nesta Política</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através 
              do site ou por e-mail.
            </p>
          </section>

          <section className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-4">10. Entre em Contato</h2>
            <p className="mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
            </p>
            <div className="space-y-2">
              <p><strong>E-mail:</strong> privacidade@Boca.com</p>
              <p><strong>Encarregado de Dados (DPO):</strong> dpo@Boca.com</p>
              <p><strong>Endereço:</strong> Rua Exemplo, 123 - São Paulo, SP</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
