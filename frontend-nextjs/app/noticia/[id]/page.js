import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowLeft, TrendingUp } from 'lucide-react';
import { mockNews } from '@/lib/mock';
import { formatDateLong } from '@/lib/utils';
import NewsCard from '@/components/NewsCard';
import ShareButton from '@/components/ShareButton';
import ReadAloudButton from '@/components/ReadAloudButton';
import FontControls from '@/components/FontControls';
import ReadingProgress from '@/components/ReadingProgress';
import TableOfContents from '@/components/TableOfContents';
import InteractiveQuote from '@/components/InteractiveQuote';
import FloatingShareBar from '@/components/FloatingShareBar';
import ReadingTimeEstimate from '@/components/ReadingTimeEstimate';

export async function generateStaticParams() {
  return mockNews.map((news) => ({
    id: news.id,
  }));
}

export async function generateMetadata({ params }) {
  const news = mockNews.find(n => n.id === params.id);
  
  if (!news) {
    return {
      title: 'Notícia não encontrada',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/noticia/${news.id}`;

  return {
    title: news.title,
    description: news.subtitle,
    authors: [{ name: news.author }],
    openGraph: {
      title: news.title,
      description: news.subtitle,
      type: 'article',
      publishedTime: news.date,
      authors: [news.author],
      url: url,
      images: [
        {
          url: news.image,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.subtitle,
      images: [news.image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function NewsDetailPage({ params }) {
  const news = mockNews.find(n => n.id === params.id);

  if (!news) {
    notFound();
  }

  const relatedNews = mockNews.filter(
    n => n.category === news.category && n.id !== news.id
  ).slice(0, 3);

  // JSON-LD Schema para artigo
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.subtitle,
    image: news.image,
    datePublished: news.date,
    dateModified: news.date,
    author: {
      '@type': 'Person',
      name: news.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NewsNow',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/noticia/${news.id}`,
    },
    articleSection: news.category,
  };

  // Extrair seções do conteúdo para Table of Contents
  const paragraphs = news.content.split('\n\n');
  const sections = [
    { id: 'intro', title: 'Introdução' },
    { id: 'desenvolvimento', title: 'Desenvolvimento' },
    { id: 'conclusao', title: 'Conclusão' }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />
      <FloatingShareBar title={news.title} />

      <article className="min-h-screen relative">
        {/* Hero Section com Parallax */}
        <div className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
          
          <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-white w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>

            <div className="max-w-4xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold">
                  {news.category}
                </span>
                <ReadingTimeEstimate content={news.content} />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
                {news.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                {news.subtitle}
              </p>

              <div className="flex items-center gap-6 text-white/90 text-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {news.author}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDateLong(news.date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Fixed Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <TableOfContents sections={sections} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="space-y-8">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-3 p-6 bg-card rounded-2xl border shadow-sm">
                  <ReadAloudButton content={news.content} />
                  <ShareButton title={news.title} />
                  <FontControls />
                </div>

                {/* Content Sections */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {/* Introdução */}
                  <section id="intro" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                      Introdução
                    </h2>
                    <p className="text-lg leading-relaxed text-foreground/90 mb-6 first-letter:text-6xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-2 first-letter:float-left">
                      {paragraphs[0]}
                    </p>
                  </section>

                  {/* Quote Interativa */}
                  <InteractiveQuote
                    text=\"Esta é uma das descobertas mais importantes da década e vai impactar milhões de pessoas.\"
                    author={news.author}
                  />

                  {/* Desenvolvimento */}
                  <section id=\"desenvolvimento\" className=\"scroll-mt-24\">
                    <h2 className=\"text-3xl font-bold mb-6 flex items-center gap-3\">
                      <span className=\"w-2 h-8 bg-purple-600 rounded-full\"></span>
                      Desenvolvimento
                    </h2>
                    
                    {paragraphs.slice(1, -1).map((paragraph, index) => (
                      <div key={index} className=\"mb-8\">
                        <p className=\"text-lg leading-relaxed text-foreground/90\">
                          {paragraph}
                        </p>
                        
                        {/* Stats Card a cada 2 parágrafos */}
                        {index === 1 && (
                          <div className=\"my-8 grid grid-cols-2 md:grid-cols-4 gap-4\">
                            <div className=\"text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-xl\">
                              <div className=\"text-3xl font-bold text-blue-600\">85%</div>
                              <div className=\"text-sm text-muted-foreground mt-1\">Crescimento</div>
                            </div>
                            <div className=\"text-center p-6 bg-purple-50 dark:bg-purple-950 rounded-xl\">
                              <div className=\"text-3xl font-bold text-purple-600\">2.5M</div>
                              <div className=\"text-sm text-muted-foreground mt-1\">Usuários</div>
                            </div>
                            <div className=\"text-center p-6 bg-green-50 dark:bg-green-950 rounded-xl\">
                              <div className=\"text-3xl font-bold text-green-600\">150+</div>
                              <div className=\"text-sm text-muted-foreground mt-1\">Países</div>
                            </div>
                            <div className=\"text-center p-6 bg-orange-50 dark:bg-orange-950 rounded-xl\">
                              <div className=\"text-3xl font-bold text-orange-600\">98%</div>
                              <div className=\"text-sm text-muted-foreground mt-1\">Satisfação</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </section>

                  {/* Conclusão */}
                  <section id=\"conclusao\" className=\"scroll-mt-24\">
                    <h2 className=\"text-3xl font-bold mb-6 flex items-center gap-3\">
                      <span className=\"w-2 h-8 bg-green-600 rounded-full\"></span>
                      Conclusão
                    </h2>
                    <p className=\"text-lg leading-relaxed text-foreground/90 mb-6\">
                      {paragraphs[paragraphs.length - 1]}
                    </p>
                  </section>

                  {/* Key Takeaways */}
                  <div className=\"my-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl border-2 border-blue-200 dark:border-blue-800\">
                    <div className=\"flex items-center gap-2 mb-4\">
                      <TrendingUp className=\"w-6 h-6 text-blue-600\" />
                      <h3 className=\"text-2xl font-bold\">Pontos-Chave</h3>
                    </div>
                    <ul className=\"space-y-3\">
                      <li className=\"flex items-start gap-3\">
                        <span className=\"flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold\">1</span>
                        <span className=\"text-foreground/90\">Inovação tecnológica está transformando o mercado</span>
                      </li>
                      <li className=\"flex items-start gap-3\">
                        <span className=\"flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold\">2</span>
                        <span className=\"text-foreground/90\">Impacto esperado em diversos setores da economia</span>
                      </li>
                      <li className=\"flex items-start gap-3\">
                        <span className=\"flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold\">3</span>
                        <span className=\"text-foreground/90\">Necessidade de regulamentação e ética nas aplicações</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Share CTA */}
                <div className=\"mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center\">
                  <h3 className=\"text-2xl font-bold mb-3\">Gostou desta notícia?</h3>
                  <p className=\"mb-6 text-white/90\">Compartilhe com seus amigos e ajude a espalhar informação de qualidade!</p>
                  <div className=\"flex justify-center\">
                    <ShareButton title={news.title} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Author Card */}
                <div className="bg-card rounded-xl p-6 shadow-sm border text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{news.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    Jornalista especializado em {news.category}
                  </p>
                </div>

                {/* Related News */}
                {relatedNews.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-bold mb-4">Notícias Relacionadas</h3>
                    <div className="space-y-4">
                      {relatedNews.map(item => (
                        <Link
                          key={item.id}
                          href={`/noticia/${item.id}`}
                          className="flex gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                              {item.title}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {item.category}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* More from Category */}
          {relatedNews.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold">Mais de {news.category}</h2>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockNews
                  .filter(n => n.category === news.category && n.id !== news.id)
                  .slice(0, 3)
                  .map(item => (
                    <NewsCard key={item.id} news={item} />
                  ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
