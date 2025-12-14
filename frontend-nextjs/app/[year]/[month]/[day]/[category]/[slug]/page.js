import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchNewsDetail } from '@/lib/api';
import { Clock, User, ArrowLeft, TrendingUp } from 'lucide-react';
import { mockNews } from '@/lib/mock';
import { formatDateLong, getContentAsText } from '@/lib/utils';
import  BrowserLog  from "@/components/BrowserLog";
import NewsCard from '@/components/NewsCard';
import ShareButton from '@/components/ShareButton';
import ReadAloudButton from '@/components/ReadAloudButton';
import FontControls from '@/components/FontControls';
import ReadingProgress from '@/components/ReadingProgress';
import TableOfContents from '@/components/TableOfContents';
import InteractiveQuote from '@/components/InteractiveQuote';
import ReadingTimeEstimate from '@/components/ReadingTimeEstimate';
import NewsletterCTA from '@/components/NewsletterCTA';
import RelatedTopics from '@/components/RelatedTopics';
import AuthorBio from '@/components/AuthorBio';
import StructuredContent from '@/components/StructuredContent';
import PageTracker from '@/components/PageTracker';
import { url } from 'inspector';

console.clear();

// Forçar geração estática com revalidação
export const revalidate = 3600; // Revalidar a cada 1 hora
export const dynamicParams = true; // Permitir params não gerados

export async function generateStaticParams() {
  // Não pré-gerar parâmetros utilizando dados mock — permitir rotas dinâmicas
  // Retornar array vazio evita gerar sempre as mesmas páginas estáticas
  return [];
}

function gerarSlug(titulo) {
    return titulo.replace(/\.html$/, '').trim();        
}

export async function generateMetadata({ params }) {

  var { year, month, day, category, slug } = params;

    slug = gerarSlug(slug);
          
    var news = await fetchNewsDetail(`${year}-${month}-${day}`, slug);
  
    if (!news) {
      return {
        title: 'Notícia não encontrada',
      };
    }
    
  var baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  var url = news.url ? news.url : `${baseUrl}/${year}/${month}/${day}/${category}/${slug}`;

  // Converter data para formato ISO 8601 com timezone
  const formatDateISO8601 = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    
    // Se já está no formato ISO, retorna
    if (dateStr.includes('T') && (dateStr.includes('Z') || dateStr.includes('-03:00'))) {
      return dateStr;
    }
    
    // Converte formato MySQL (YYYY-MM-DD HH:MM:SS) para ISO 8601
    const date = new Date(dateStr.replace(' ', 'T'));
    
    // Retorna no formato ISO 8601 com timezone Brasil (UTC-3)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`;
  };

  // Converter tags de camelCase para kebab-case (apenas as tags, sem slug)
  const keywords = news.tags && Array.isArray(news.tags) 
    ? news.tags.map(tag => 
        tag.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
      ).join(', ')
    : '';

  // Tags para article:tag e news_keywords (formato original, com espaços)
  const articleTags = news.tags && Array.isArray(news.tags)
    ? news.tags.map(tag => 
        tag.replace(/([A-Z])/g, ' $1').toLowerCase().trim()
      ).join(', ')
    : '';

  return {
    title: news.title,
    description: news.subtitle,
    authors: [{ name: news.author }],
    publisher: 'Boca Notícias',
    keywords: keywords,
    other: {
      'news_keywords': articleTags || keywords,
    },
    openGraph: {
      title: news.title,
      description: news.subtitle,
      type: 'article',
      locale: 'pt_BR',
      publishedTime: formatDateISO8601(news.date),
      modifiedTime: formatDateISO8601(news.last_modified || news.date),
      authors: [news.author || 'Redação'],
      section: news.category?.nome || news.category || 'Notícias',
      tags: articleTags ? articleTags.split(', ') : [],
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

export default async function NewsDetailPage({ params }) {

   var { year, month, day, category, slug } = params;

    slug = gerarSlug(slug);
    
    var news = await fetchNewsDetail(`${year}-${month}-${day}`, slug);
        
    if (!news) {
      notFound();
    }

  var baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  var url = news.url ? news.url : `${baseUrl}/${year}/${month}/${day}/${category}/${slug}`;

  // Preferir notícias relacionadas fornecidas pela API
  const relatedNews = (news.MaisdeCategory && news.MaisdeCategory.length > 0)
    ? news.MaisdeCategory.slice(0, 3)
    : (news.NoticiasRelacionadas && news.NoticiasRelacionadas.length > 0)
      ? news.NoticiasRelacionadas.slice(0, 3)
      : [];

  // Extrair texto contínuo para articleBody (recomendação do Google)
  const extractPlainText = (content) => {
    if (typeof content === 'string') {
      return content;
    }
    
    if (Array.isArray(content)) {
      return content
        .map(block => {
          if (block.type === 'paragraph' || block.type === 'subtitle' || block.type === 'quote' || block.type === 'highlight') {
            return block.text || '';
          }
          if (block.type === 'info_box') {
            return `${block.title || ''} ${block.text || ''}`;
          }
          if (block.type === 'list' && Array.isArray(block.items)) {
            return block.items.join('. ');
          }
          return '';
        })
        .filter(text => text.trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    return '';
  };

  // Converter data para formato ISO 8601 com timezone
  const formatDateISO8601 = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    
    // Se já está no formato ISO, retorna
    if (dateStr.includes('T') && (dateStr.includes('Z') || dateStr.includes('-03:00'))) {
      return dateStr;
    }
    
    // Converte formato MySQL (YYYY-MM-DD HH:MM:SS) para ISO 8601
    const date = new Date(dateStr.replace(' ', 'T'));
    
    // Retorna no formato ISO 8601 com timezone Brasil (UTC-3)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}-03:00`;
  };

  // JSON-LD Schema para artigo - SEO profissional
  var baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    alternativeHeadline: news.subtitle,
    description: news.subtitle,
    image: {
      '@type': 'ImageObject',
      url: news.image,
      width: 1200,
      height: 630,
    },
    datePublished: formatDateISO8601(news.date),
    dateModified: formatDateISO8601(news.last_modified || news.date),
    author: {
      '@type': 'Person',
      name: news.author || 'Redação',
      url: `${baseUrl}/autor/${(news.author || 'redacao').toLowerCase().replace(/\s+/g, '-')}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Boca Notícias',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
        width: 600,
        height: 60,
      },
      sameAs: [
        'https://facebook.com/bocanoticias',
        'https://twitter.com/bocanoticias',
        'https://instagram.com/bocanoticias',
      ],
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${url}`,
    },
    articleSection: news.category?.nome || news.category || 'Notícias',
    articleBody: extractPlainText(news.content).substring(0, 5000),
    keywords: news.tags ? (typeof news.tags === 'object' ? Object.values(news.tags).join(', ') : news.tags) : (news.category?.nome || news.category || 'notícias'),
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
  };

  // Extrair seções do conteúdo para Table of Contents
  const content = typeof news.content === 'string' ? {
    introducao: news.content.split('\n\n')[0] || '',
    blockquote: 'Esta é uma das descobertas mais importantes e vai impactar milhões de pessoas.',
    desenvolvimento: news.content.split('\n\n').slice(1, -1) || [],
    conclusao: news.content.split('\n\n')[news.content.split('\n\n').length - 1] || '',
    pontosChave: [
      'Inovação tecnológica está transformando o mercado',
      'Impacto esperado em diversos setores da economia',
      'Necessidade de regulamentação e ética nas aplicações'
    ]
  } : news.content;

  // Gerar seções baseadas no tipo de conteúdo
  const isStructuredContent = Array.isArray(news.content) && news.content.some(block => block.type);
  const sections = isStructuredContent
    ? news.content
        .filter(block => block.type === 'subtitle')
        .map((block, index) => ({
          id: `section-${index}`,
          title: block.text
        }))
    : [
        { id: 'intro', title: 'Introdução' },
        { id: 'desenvolvimento', title: 'Desenvolvimento' },
        { id: 'conclusao', title: 'Conclusão' }
      ];

  return (
    <>
      <PageTracker title={news.title} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />

      <BrowserLog data={news} />

      <article className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 sm:mb-6 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Table of Contents - Fixed Sidebar - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1 lg:order-1">
              <TableOfContents sections={sections} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-card rounded-2xl p-3 sm:p-6 md:p-10 shadow-sm border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {news.category?.nome || news.category || 'Notícias'}
                  </span>
                  <ReadingTimeEstimate content={news.content} />
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                  {news.title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
                  {news.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-6 py-3 sm:py-4 border-t border-b mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {news.author || 'Redação'}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatDateLong(news.date)}
                  </span>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-initial">
                      <ReadAloudButton content={getContentAsText(news.content)} />
                    </div>
                    <div className="flex-1 sm:flex-initial">
                      <ShareButton title={news.title} />
                    </div>
                  </div>
                  <FontControls />
                </div>

                {/* Featured Image */}
                <div className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden mb-8">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Content - Verifica se é estruturado ou antigo */}
                {Array.isArray(news.content) && news.content.some(block => block.type) ? (
                  <StructuredContent content={news.content} title={news.title} />
                ) : (
                  <div className="article-content prose prose-lg max-w-none dark:prose-invert">
                  {/* Introdução */}
                  <section id="intro" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                      Introdução
                    </h2>
                    <p className="text-lg leading-relaxed text-foreground/90 mb-6 first-letter:text-6xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-2 first-letter:float-left">
                      {content.introducao}
                    </p>
                  </section>

                  {/* Quote Interativa */}
                  <InteractiveQuote
                    text={content.blockquote}
                    author={news.author}
                  />

                  {/* Desenvolvimento */}
                  <section id="desenvolvimento" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                      Desenvolvimento
                    </h2>
                    
                    {(Array.isArray(content.desenvolvimento) ? content.desenvolvimento : [content.desenvolvimento]).map((paragraph, index) => (
                      <div key={index} className="mb-8">
                        <p className="text-lg leading-relaxed text-foreground/90">
                          {paragraph}
                        </p>
                        
                        {/* Stats Card a cada 2 parágrafos */}
                        {index === 1 && (
                          <div className="my-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-xl">
                              <div className="text-3xl font-bold text-blue-600">85%</div>
                              <div className="text-sm text-muted-foreground mt-1">Crescimento</div>
                            </div>
                            <div className="text-center p-6 bg-purple-50 dark:bg-purple-950 rounded-xl">
                              <div className="text-3xl font-bold text-purple-600">2.5M</div>
                              <div className="text-sm text-muted-foreground mt-1">Usuários</div>
                            </div>
                            <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-xl">
                              <div className="text-3xl font-bold text-green-600">150+</div>
                              <div className="text-sm text-muted-foreground mt-1">Países</div>
                            </div>
                            <div className="text-center p-6 bg-orange-50 dark:bg-orange-950 rounded-xl">
                              <div className="text-3xl font-bold text-orange-600">98%</div>
                              <div className="text-sm text-muted-foreground mt-1">Satisfação</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </section>

                  {/* Conclusão */}
                  <section id="conclusao" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-green-600 rounded-full"></span>
                      Conclusão
                    </h2>
                    <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                      {content.conclusao}
                    </p>
                  </section>

                  {/* Key Takeaways */}
                  <div className="my-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      <h3 className="text-2xl font-bold">Pontos-Chave</h3>
                    </div>
                    <ul className="space-y-3">
                      {content.pontosChave.map((ponto, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                          <span className="text-foreground/90">{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                )}

                {/* Author Bio */}
                
                <div className="hidden">
                  <AuthorBio author={news.author} category={news.category.nome} />
                </div>
                {/* Leia Também */}
                {news.LeiaTambem && news.LeiaTambem.length > 0 && (
                  <div className="my-12 p-4 sm:p-8 bg-card rounded-2xl border-2 shadow-lg">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Leia Também
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {news.LeiaTambem.map((item, index) => (
                        <Link
                          key={index}
                          href={item.url}
                          className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary hover:bg-secondary/80 rounded-xl hover:shadow-md transition-all border"
                        >
                          <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <h4 className="font-semibold text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Topics */}
                <RelatedTopics tags={news.tags} />

                {/* Newsletter CTA */}
                <NewsletterCTA />

                {/* Share CTA */}
                <div className="mt-10 pt-6 border-t text-center">
                  <p className="text-sm font-medium mb-3">Gostou desta notícia? Compartilhe!</p>
                  <ShareButton title={news.title} />
                </div>
              </div>
            </div>

            {/* Sidebar - Move to bottom on mobile */}
            <div className="lg:col-span-1 order-3 mt-8 lg:mt-0">
              <div className="lg:sticky lg:top-24 space-y-6">

                {/* Author Card */}
                <div className="bg-card rounded-xl p-6 shadow-sm border text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{news.author || 'Redação'}</h3>
                  <p className="text-sm text-muted-foreground">
                    Jornalista especializado em {news.category?.nome || news.category || 'Notícias'}
                  </p>
                </div>

                {/* Related News */}
                {news.NoticiasRelacionadas && news.NoticiasRelacionadas.length > 0 && (
                  <div className="bg-card rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-bold mb-4">Notícias Relacionadas</h3>
                    <div className="space-y-4">
                      {news.NoticiasRelacionadas.map(item => (
                        <Link
                          key={item.id}
                          href={`${item.url}`}
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
                          </div>o
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* More from Category */}
          {news.MaisdeCategory && news.MaisdeCategory.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold">Mais de {news.category?.nome || news.category || 'Notícias'}</h2>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {news.MaisdeCategory.map(item => (
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
