import { Megaphone, Target, TrendingUp, Users, Mail, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Publicidade - Boca Notícias',
  description: 'Anuncie no Boca Notícias e alcance milhares de leitores interessados em notícias de qualidade. Conheça nossas opções de publicidade.',
  openGraph: {
    locale: 'pt_BR',
  },
};

export default function PublicidadePage() {
  const stats = [
    { icon: Users, value: '500K+', label: 'Visitantes mensais' },
    { icon: TrendingUp, value: '2M+', label: 'Pageviews por mês' },
    { icon: Target, value: '85%', label: 'Engajamento médio' },
    { icon: FileText, value: '1000+', label: 'Notícias publicadas' },
  ];

  const formats = [
    {
      title: 'Banner Display',
      description: 'Banners estratégicos em posições de destaque no site',
      features: ['Múltiplos tamanhos disponíveis', 'Alta visibilidade', 'Segmentação por categoria'],
      price: 'A partir de R$ 2.500/mês',
    },
    {
      title: 'Conteúdo Patrocinado',
      description: 'Artigos integrados ao nosso conteúdo editorial',
      features: ['Alcance orgânico', 'SEO otimizado', 'Compartilhamento em redes sociais'],
      price: 'A partir de R$ 4.000/artigo',
    },
    {
      title: 'Newsletter Patrocinada',
      description: 'Destaque na nossa newsletter semanal',
      features: ['Envio para base qualificada', 'Alta taxa de abertura', 'Call-to-action personalizado'],
      price: 'A partir de R$ 3.500/envio',
    },
    {
      title: 'Campanha Completa',
      description: 'Pacote integrado com múltiplos formatos',
      features: ['Banner + Conteúdo + Newsletter', 'Relatório de performance', 'Suporte dedicado'],
      price: 'Sob consulta',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Megaphone className="w-5 h-5" />
              <span className="font-semibold">Publicidade</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Alcance Seu Público com o Boca Notícias
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Conecte sua marca com milhares de leitores engajados através de soluções publicitárias estratégicas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#formatos"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                Ver Formatos
              </a>
              <a
                href="#contato"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                Solicitar Proposta
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-2xl p-6 text-center border shadow-sm hover:shadow-md transition-shadow">
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats Section */}
      <section id="formatos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Formatos de Publicidade</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o formato ideal para sua campanha e maximize seus resultados
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {formats.map((format, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all hover:scale-105"
              >
                <h3 className="text-2xl font-bold mb-3">{format.title}</h3>
                <p className="text-muted-foreground mb-6">{format.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {format.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t">
                  <div className="text-2xl font-bold text-blue-600">{format.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Por Que Anunciar no Boca Notícias?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl p-6 border shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Público Qualificado</h3>
                <p className="text-muted-foreground">
                  Alcance leitores interessados em notícias de qualidade e informação relevante
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border shadow-sm">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Alto Engajamento</h3>
                <p className="text-muted-foreground">
                  Nossos leitores são ativos e interagem constantemente com o conteúdo
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border shadow-sm">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Conteúdo de Qualidade</h3>
                <p className="text-muted-foreground">
                  Ambiente editorial confiável que valoriza sua marca
                </p>
              </div>

              <div className="bg-card rounded-2xl p-6 border shadow-sm">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Suporte Dedicado</h3>
                <p className="text-muted-foreground">
                  Equipe especializada para ajudar em todas as etapas da campanha
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 md:p-12 border shadow-lg">
            <div className="text-center mb-8">
              <Mail className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-3xl font-bold mb-4">Vamos Conversar?</h2>
              <p className="text-lg text-muted-foreground">
                Entre em contato com nossa equipe comercial e descubra como podemos ajudar sua marca a crescer
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                <h3 className="font-bold mb-2">Email Comercial</h3>
                <a href="mailto:publicidade@boca.com.br" className="text-blue-600 hover:underline text-lg">
                  publicidade@boca.com.br
                </a>
              </div>

              <div className="p-6 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                <h3 className="font-bold mb-2">WhatsApp</h3>
                <a href="https://wa.me/5599982011541" className="text-purple-600 hover:underline text-lg">
                  (99) 98201-1541
                </a>
              </div>

              <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-xl">
                <h3 className="font-bold mb-2">Horário de Atendimento</h3>
                <p className="text-muted-foreground">
                  Segunda a Sexta, das 9h às 18h
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Ou volte para a página inicial
              </p>
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
    </div>
  );
}
