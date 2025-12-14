import { fetchAllNews } from '@/lib/api';
import { mockNews } from '@/lib/mock';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Gerar páginas estáticas para todas as notícias
export async function generateStaticParams() {
  try {
    const noticias = await fetchAllNews(100);
    
    return noticias.map((noticia) => {
      const date = new Date(noticia.date);
      return {
        year: date.getFullYear().toString(),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        day: String(date.getDate()).padStart(2, '0'),
        category: noticia.tag || noticia.category.toLowerCase(),
        slug: noticia.slug || noticia.id,
      };
    });
  } catch (error) {
    console.error('Erro ao gerar params:', error);
    return [];
  }
}

function gerarSlug(titulo) {
    return titulo.replace(/\.html$/, '').trim();        
}

// Gerar metadata para SEO
export async function generateMetadata({ params }) {
  var { year, month, day, category, slug } = params;
  
  slug = gerarSlug(slug);
  
  try {
    const noticias = await fetchAllNews(100);
    const noticia = noticias.find(n => n.slug === slug || n.id === slug);
    
    if (!noticia) {
      return {
        title: 'Notícia não encontrada',
      };
    }

    return {
      title: `${noticia.title} - Portal de Notícias`,
      description: noticia.subtitle || noticia.content.substring(0, 160),
      openGraph: {
        title: noticia.title,
        description: noticia.subtitle,
        images: [noticia.image],
        type: 'article',
        publishedTime: noticia.date,
        authors: [noticia.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: noticia.title,
        description: noticia.subtitle,
        images: [noticia.image],
      },
    };
  } catch (error) {
    return {
      title: 'Notícia - Portal de Notícias',
    };
  }
}

export default async function NoticiaPage({ params }) {
  var { year, month, day, category, slug } = params;

    slug = gerarSlug(slug);

  // Buscar todas as notícias
  let noticias = await fetchAllNews(100);
  
  if (!noticias || noticias.length === 0) {
    noticias = mockNews;
  }

  // Encontrar a notícia pelo slug ou id
  const noticia = noticias.find(n => n.slug === slug || n.id === slug);

  if (!noticia) {
    notFound();
  }

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Notícias relacionadas da mesma categoria
  const noticiasRelacionadas = noticias
    .filter(n => 
      (n.category === noticia.category || n.tag === noticia.tag) && 
      n.id !== noticia.id
    )
    .slice(0, 3);

  // JSON-LD para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.title,
    description: noticia.subtitle,
    image: noticia.image,
    datePublished: noticia.date,
    author: {
      '@type': 'Person',
      name: noticia.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Portal de Notícias',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Início
              </Link>
              <span>/</span>
              <Link 
                href={`/categoria/${category}`}
                className="hover:text-foreground transition-colors"
              >
                {noticia.category}
              </Link>
              <span>/</span>
              <span className="text-foreground">{noticia.title}</span>
            </nav>
          </div>
        </div>

        {/* Conteúdo da Notícia */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Tag/Categoria */}
          {noticia.tag && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                {noticia.tag}
              </span>
            </div>
          )}

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {noticia.title}
          </h1>

          {/* Subtítulo */}
          {noticia.subtitle && (
            <p className="text-xl text-muted-foreground mb-6">
              {noticia.subtitle}
            </p>
          )}

          {/* Meta informações */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Por:</span>
              <span>{noticia.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span>
              <time dateTime={noticia.date}>{formatDate(noticia.date)}</time>
            </div>
            <div className="flex items-center gap-2">
              <span>📂</span>
              <span>{noticia.category}</span>
            </div>
          </div>

          {/* Imagem principal */}
          <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-2xl overflow-hidden">
            <Image
              src={noticia.image}
              alt={noticia.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Conteúdo */}
          <div className="prose prose-lg max-w-none dark:prose-invert mb-12">


            { (noticia.content?.split('\n\n')) ?? noticia.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            )) }

          </div>

          {/* Compartilhar */}
          <div className="flex items-center gap-4 mb-12 p-6 bg-secondary/30 rounded-2xl">
            <span className="font-semibold">Compartilhar:</span>
            <div className="flex gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(noticia.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(noticia.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Notícias Relacionadas */}
          {noticiasRelacionadas.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Notícias Relacionadas</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {noticiasRelacionadas.map((related) => {
                  const relatedDate = new Date(related.date);
                  const relatedUrl = `/${relatedDate.getFullYear()}/${String(relatedDate.getMonth() + 1).padStart(2, '0')}/${String(relatedDate.getDate()).padStart(2, '0')}/${related.tag || related.category.toLowerCase()}/${related.slug || related.id}.html`;
                  
                  return (
                    <Link 
                      key={related.id}
                      href={relatedUrl}
                      className="group"
                    >
                      <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {related.subtitle}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
