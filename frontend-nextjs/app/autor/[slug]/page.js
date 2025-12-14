import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Calendar, BookOpen, TrendingUp, Mail, Linkedin, Twitter, Award } from 'lucide-react';
import { mockNews } from '@/lib/mock';
import NewsCard from '@/components/NewsCard';

// Lista de autores do site
const authors = {
  'seane-lennon': {
    name: 'Seane Lennon',
    bio: 'Jornalista especializada em tecnologia e inovação com mais de 10 anos de experiência. Apaixonada por descobrir e compartilhar as últimas tendências do mundo tech.',
    avatar: '/avatars/seane.jpg', // Placeholder
    role: 'Editora de Tecnologia',
    expertise: ['Tecnologia', 'Inovação', 'Startups', 'IA'],
    email: 'seane@bocanoticias.com',
    social: {
      twitter: 'https://twitter.com/seanelennon',
      linkedin: 'https://linkedin.com/in/seanelennon',
    },
    joinDate: '2020-01-15',
    articlesCount: 150,
  },
  'leonardo-gottems': {
    name: 'Leonardo Gottems',
    bio: 'Jornalista com foco em esportes e cultura pop. Cobertura completa dos principais eventos esportivos e análises aprofundadas.',
    avatar: '/avatars/leonardo.jpg',
    role: 'Editor de Esportes',
    expertise: ['Esportes', 'Futebol', 'Olimpíadas', 'Cultura Pop'],
    email: 'leonardo@bocanoticias.com',
    social: {
      twitter: 'https://twitter.com/leonardogottems',
      linkedin: 'https://linkedin.com/in/leonardogottems',
    },
    joinDate: '2019-05-20',
    articlesCount: 200,
  },
  'aline-merladete': {
    name: 'Aline Merladete',
    bio: 'Jornalista e redatora especializada em economia, mercado financeiro e negócios. Experiência em grandes portais de notícias.',
    avatar: '/avatars/aline.jpg',
    role: 'Editora de Economia',
    expertise: ['Economia', 'Mercado', 'Finanças', 'Negócios'],
    email: 'aline@bocanoticias.com',
    social: {
      twitter: 'https://twitter.com/alinemerladete',
      linkedin: 'https://linkedin.com/in/alinemerladete',
    },
    joinDate: '2020-09-10',
    articlesCount: 180,
  },
  'boca': {
    name: 'BOCA',
    bio: 'Equipe editorial do BocaNoticias. Comprometidos em trazer informação de qualidade e jornalismo responsável para você.',
    avatar: '/avatars/boca.jpg',
    role: 'Redação BocaNoticias',
    expertise: ['Notícias', 'Jornalismo', 'Informação', 'Atualidades'],
    email: 'redacao@bocanoticias.com',
    social: {
      twitter: 'https://twitter.com/bocanoticias',
      linkedin: 'https://linkedin.com/company/bocanoticias',
    },
    joinDate: '2020-01-01',
    articlesCount: 500,
  },
};

export async function generateStaticParams() {
  return Object.keys(authors).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }) {
  const authorSlug = params.slug;
  const author = authors[authorSlug];

  if (!author) {
    return {
      title: 'Autor não encontrado',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${author.name} - Jornalista | BocaNoticias`,
    description: author.bio,
    robots: {
      index: false,
      follow: true,
      nocache: true,
    },
    openGraph: {
      title: author.name,
      description: author.bio,
      type: 'profile',
    },
  };
}

export default function AutorPage({ params }) {
  const authorSlug = params.slug;
  const author = authors[authorSlug];

  if (!author) {
    notFound();
  }

  // Buscar artigos do autor (simulado com mockNews)
  const authorArticles = mockNews.filter(
    (news) => news.author.toLowerCase().replace(/\s+/g, '-') === authorSlug
  );

  const joinYear = new Date(author.joinDate).getFullYear();
  const yearsActive = new Date().getFullYear() - joinYear;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
                  <User className="w-20 h-20 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-blue-600 rounded-full p-3 shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <span className="font-semibold">{author.role}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{author.name}</h1>
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">{author.bio}</p>
                
                {/* Social Links */}
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  {author.social.twitter && (
                    <a
                      href={author.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {author.social.linkedin && (
                    <a
                      href={author.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  <a
                    href={`mailto:${author.email}`}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-2xl p-6 text-center border shadow-lg">
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="text-3xl font-bold mb-1">{author.articlesCount}</div>
              <div className="text-sm text-muted-foreground">Artigos</div>
            </div>
            <div className="bg-card rounded-2xl p-6 text-center border shadow-lg">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="text-3xl font-bold mb-1">{yearsActive}+</div>
              <div className="text-sm text-muted-foreground">Anos Ativo</div>
            </div>
            <div className="bg-card rounded-2xl p-6 text-center border shadow-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <div className="text-3xl font-bold mb-1">500K+</div>
              <div className="text-sm text-muted-foreground">Leitores</div>
            </div>
            <div className="bg-card rounded-2xl p-6 text-center border shadow-lg">
              <Award className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <div className="text-3xl font-bold mb-1">Top 5</div>
              <div className="text-sm text-muted-foreground">Autor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Áreas de Especialização</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {author.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Artigos de {author.name}</h2>
              <div className="text-muted-foreground">
                {authorArticles.length} {authorArticles.length === 1 ? 'artigo' : 'artigos'}
              </div>
            </div>

            {authorArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorArticles.map((article) => (
                  <NewsCard key={article.id} news={article} />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-12 border text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl font-semibold mb-2">Nenhum artigo encontrado</p>
                <p className="text-muted-foreground">
                  {author.name} ainda não publicou artigos ou eles não estão disponíveis.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-card rounded-2xl p-8 md:p-12 border shadow-lg text-center">
            <Mail className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h2 className="text-3xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Tem alguma sugestão de pauta ou quer falar com {author.name}? Entre em contato!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${author.email}`}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Enviar Email
              </a>
              <Link
                href="/"
                className="px-8 py-4 bg-secondary border rounded-xl font-bold hover:bg-secondary/80 transition-all"
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
