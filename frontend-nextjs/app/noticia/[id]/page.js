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
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm border">
                <span className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold mb-4">
                  {news.category}
                </span>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {news.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {news.subtitle}
                </p>

                <div className="flex items-center gap-6 py-4 border-t border-b mb-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {news.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDateLong(news.date)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <ReadAloudButton content={news.content} />
                  <ShareButton title={news.title} />
                  <FontControls />
                </div>

                <div className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden mb-8">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {news.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t text-center">
                  <p className="text-sm font-medium mb-3">Gostou desta notícia? Compartilhe!</p>
                  <ShareButton title={news.title} />
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
