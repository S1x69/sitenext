import { Shield, Lock, Eye, Cookie, Database, UserCheck, AlertTriangle, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade - Boca Notícias',
  description: 'Conheça nossa Política de Privacidade e saiba como protegemos seus dados pessoais no Boca Notícias.',
};

export default function PrivacidadePage() {
  const sections = [
    {
      icon: Database,
      title: 'Dados Coletados',
      content: [
        'Coletamos apenas informações essenciais para melhorar sua experiência no site.',
        'Dados pessoais como nome e email são coletados apenas quando você se inscreve na newsletter ou nos contata.',
        'Dados de navegação (páginas visitadas, tempo de permanência) são coletados de forma anônima através de ferramentas de análise.',
        'Seu endereço IP pode ser registrado para fins de segurança e estatísticas.',
      ],
    },
    {
      icon: Eye,
      title: 'Como Usamos Seus Dados',
      content: [
        'Personalizar sua experiência de navegação no site.',
        'Enviar newsletters e atualizações (apenas se você se cadastrou).',
        'Melhorar nosso conteúdo e serviços através de análise de comportamento.',
        'Responder suas dúvidas e solicitações de suporte.',
        'Garantir a segurança e prevenir fraudes.',
      ],
    },
    {
      icon: Lock,
      title: 'Proteção de Dados',
      content: [
        'Utilizamos criptografia SSL em todas as transmissões de dados sensíveis.',
        'Nossos servidores são protegidos por firewalls e medidas de segurança avançadas.',
        'Acesso aos dados pessoais é restrito apenas a funcionários autorizados.',
        'Realizamos backups regulares e auditorias de segurança.',
        'Não vendemos, alugamos ou compartilhamos seus dados com terceiros sem seu consentimento.',
      ],
    },
    {
      icon: Cookie,
      title: 'Cookies',
      content: [
        'Utilizamos cookies para melhorar sua experiência de navegação.',
        'Cookies essenciais são necessários para o funcionamento básico do site.',
        'Cookies analíticos nos ajudam a entender como os visitantes usam o site.',
        'Você pode gerenciar suas preferências de cookies através das configurações do navegador.',
        'Alguns recursos podem não funcionar corretamente se os cookies forem desativados.',
      ],
    },
    {
      icon: UserCheck,
      title: 'Seus Direitos',
      content: [
        'Você tem o direito de acessar seus dados pessoais que mantemos.',
        'Você pode solicitar a correção de dados incorretos ou desatualizados.',
        'Você pode solicitar a exclusão de seus dados pessoais a qualquer momento.',
        'Você pode cancelar sua inscrição na newsletter a qualquer momento.',
        'Você pode solicitar a portabilidade dos seus dados.',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Terceiros',
      content: [
        'Utilizamos o Google Analytics para análise de tráfego (dados anônimos).',
        'Podemos usar serviços de publicidade que coletam dados de navegação.',
        'Links externos podem direcionar para sites com suas próprias políticas de privacidade.',
        'Não somos responsáveis pelas práticas de privacidade de sites de terceiros.',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Política de Privacidade</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sua Privacidade é Nossa Prioridade
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4">
              Transparência total sobre como coletamos, usamos e protegemos seus dados
            </p>
            <p className="text-sm text-blue-200">
              Última atualização: 27 de novembro de 2025
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 border shadow-sm">
            <p className="text-lg leading-relaxed">
              O <strong>BocaNoticias</strong> está comprometido em proteger sua privacidade e garantir a segurança dos seus dados pessoais. 
              Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações quando você 
              visita nosso site. Ao usar nossos serviços, você concorda com as práticas descritas nesta política.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                  </div>
                </div>
                <ul className="space-y-3 ml-16">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                      <span className="text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LGPD Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 border shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-600" />
              Conformidade com a LGPD
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). 
              Tratamos seus dados pessoais com base em fundamentos legais, respeitando seus direitos como titular 
              de dados e mantendo a transparência em todas as nossas práticas.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Transparente</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">24h</div>
                <div className="text-sm text-muted-foreground">Resposta Média</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">SSL</div>
                <div className="text-sm text-muted-foreground">Criptografia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 md:p-12 border shadow-lg text-center">
            <Mail className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h2 className="text-3xl font-bold mb-4">Dúvidas sobre Privacidade?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Se você tiver qualquer dúvida sobre esta Política de Privacidade ou quiser exercer seus direitos, 
              entre em contato conosco.
            </p>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <h3 className="font-semibold mb-2">Email</h3>
                <a href="mailto:privacidade@boca.com.br" className="text-blue-600 hover:underline">
                  privacidade@boca.com.br
                </a>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <h3 className="font-semibold mb-2">Encarregado de Dados (DPO)</h3>
                <a href="mailto:dpo@boca.com.br" className="text-purple-600 hover:underline">
                  dpo@boca.com.br
                </a>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Voltar para Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise 
              esta página regularmente para se manter informado sobre como protegemos seus dados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
