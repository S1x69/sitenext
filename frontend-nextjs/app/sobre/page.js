import { Newspaper, Target, Users, Award, TrendingUp, Heart, Zap, Globe, BookOpen, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Sobre Nós - Boca Notícias',
  description: 'Conheça a história, missão e valores do Boca Notícias. Portal de notícias comprometido com informação de qualidade e jornalismo responsável.',
  openGraph: {
    locale: 'pt_BR',
  },
};

export default function SobrePage() {
  const values = [
    {
      icon: Shield,
      title: 'Credibilidade',
      description: 'Compromisso com informações verificadas e jornalismo ético',
      color: 'blue',
    },
    {
      icon: Zap,
      title: 'Agilidade',
      description: 'Notícias em tempo real sem abrir mão da qualidade',
      color: 'yellow',
    },
    {
      icon: Heart,
      title: 'Transparência',
      description: 'Clareza nas fontes e respeito aos nossos leitores',
      color: 'red',
    },
    {
      icon: Globe,
      title: 'Diversidade',
      description: 'Cobertura ampla e plural de diferentes perspectivas',
      color: 'green',
    },
  ];

  const stats = [
    { number: '2M+', label: 'Leitores mensais', icon: Users },
    { number: '1000+', label: 'Notícias publicadas', icon: BookOpen },
    { number: '50+', label: 'Jornalistas e colaboradores', icon: Award },
    { number: '24/7', label: 'Cobertura contínua', icon: TrendingUp },
  ];

  const team = [
    {
      name: 'Ana Silva',
      role: 'Editora-Chefe',
      bio: '15 anos de experiência em jornalismo digital',
    },
    {
      name: 'Carlos Mendes',
      role: 'Editor de Tecnologia',
      bio: 'Especialista em inovação e tendências tech',
    },
    {
      name: 'Marina Santos',
      role: 'Editora de Cultura',
      bio: 'Apaixonada por arte e entretenimento',
    },
    {
      name: 'Roberto Lima',
      role: 'Editor de Esportes',
      bio: 'Cobertura completa do mundo esportivo',
    },
  ];

  const milestones = [
    { year: '2020', event: 'Fundação do Boca Notícias' },
    { year: '2021', event: 'Alcançamos 500 mil leitores mensais' },
    { year: '2022', event: 'Prêmio de Melhor Portal de Notícias' },
    { year: '2023', event: 'Expansão da equipe editorial' },
    { year: '2024', event: 'Lançamento do app mobile' },
    { year: '2025', event: '2 milhões de leitores mensais' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Newspaper className="w-5 h-5" />
              <span className="font-semibold">Sobre Nós</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Informação de Qualidade, Sempre
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Somos um portal de notícias comprometido em trazer jornalismo de qualidade, 
              informações verificadas e conteúdo relevante para milhões de leitores.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Democratizar o acesso à informação de qualidade e promover o jornalismo 
                  responsável que contribui para uma sociedade mais informada e crítica.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ser referência em jornalismo digital no Brasil, reconhecido pela 
                  credibilidade, inovação e compromisso com a verdade.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-950 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nossos Valores</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ética, transparência, respeito à diversidade e compromisso com a 
                  excelência jornalística em cada notícia publicada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Boca Notícias em Números</h2>
            <p className="text-xl text-muted-foreground">
              O impacto do nosso compromisso com o jornalismo de qualidade
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 md:p-8 text-center border shadow-sm hover:shadow-lg transition-all hover:scale-105"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nos Move</h2>
            <p className="text-xl text-muted-foreground">
              Princípios que guiam nosso trabalho diário
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
                  value.color === 'blue' ? 'bg-blue-100 dark:bg-blue-950' :
                  value.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-950' :
                  value.color === 'red' ? 'bg-red-100 dark:bg-red-950' :
                  'bg-green-100 dark:bg-green-950'
                }`}>
                  <value.icon className={`w-8 h-8 ${
                    value.color === 'blue' ? 'text-blue-600' :
                    value.color === 'yellow' ? 'text-yellow-600' :
                    value.color === 'red' ? 'text-red-600' :
                    'text-green-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa Jornada</h2>
            <p className="text-xl text-muted-foreground">
              Principais marcos da nossa história
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all flex items-center gap-6"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-xl text-muted-foreground">
              Profissionais dedicados ao jornalismo de excelência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-all text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se a milhões de leitores que confiam no Boca Notícias para 
              se manterem informados todos os dias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contato"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                Entre em Contato
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all"
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
