import { mockNews } from '@/lib/mock';
import NewsCarousel from '@/components/NewsCarousel';
import NewsCard from '@/components/NewsCard';
import { fetchAllNews } from '@/lib/api';
import Link from 'next/link';
import PageTracker from '@/components/PageTracker';
import  BrowserLog  from "@/components/BrowserLog";

export const metadata = {
  title: 'Últimas Notícias - Boca Notícias',
  description: 'Fique por dentro das últimas notícias de tecnologia, esportes, mundo e entretenimento. Portal Boca Notícias - Sua fonte de informação confiável.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Boca Notícias - Portal de Notícias',
    description: 'Fique por dentro das últimas notícias de tecnologia, esportes, mundo e entretenimento',
    type: 'website',
    locale: 'pt_BR',
  },
};

// Revalidar a cada 10 minutos (600 segundos)
export const revalidate = 600;

export default async function HomePage() {
  // Buscar notícias da API da Boca News
  let noticias = await fetchAllNews(100);
  
  // Se não conseguir buscar da API, usar mock como fallback
  if (!noticias || noticias.length === 0) {
    console.log('Usando notícias mock como fallback');
    noticias = mockNews;
  }

  console.log(`${noticias.length} notícias carregadas`);

  // Separar notícias destacadas para carousel e as demais para "Últimas"
  const carouselNews = noticias.filter(n => n.featured === 1).slice(0, 5);
  const latestNews = noticias.filter(n => !n.featured).slice(0, 8);

  // Buscar notícias específicas de cada categoria para scroll infinito (apenas 3 iniciais)
  const economia = await fetchAllNews(3, 'economia', 0);
  const mercado = await fetchAllNews(3, 'mercado', 0);
  const clima = await fetchAllNews(3, 'clima', 0);

  // JSON-LD Schema para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'BocaNoticias',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/BocaNoticias',
      'https://facebook.com/BocaNoticias',
      'https://instagram.com/BocaNoticias',
    ],
  };

  return (
    <>
      <PageTracker title="Página Inicial - BocaNoticias" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BrowserLog data={noticias} />
      
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <NewsCarousel news={carouselNews} />

          {/* Latest News */}
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold">Últimas Notícias</h2>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestNews.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </section>

          {/* Economia */}
          {economia.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold">Economia</h2>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                <Link 
                  href="/categoria/economia"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap"
                >
                  Ver todas →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {economia.map(item => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </section>
          )}

          {/* Mercado */}
          {mercado.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold">Mercado</h2>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                <Link 
                  href="/categoria/mercado"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap"
                >
                  Ver todas →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mercado.map(item => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </section>
          )}

          {/* Clima */}
          {clima.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold">Clima</h2>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                <Link 
                  href="/categoria/clima"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap"
                >
                  Ver todas →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clima.map(item => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
