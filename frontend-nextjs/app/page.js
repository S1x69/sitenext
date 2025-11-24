import { mockNews } from '@/lib/mock';
import NewsCarousel from '@/components/NewsCarousel';
import NewsCard from '@/components/NewsCard';

export const metadata = {
  title: 'Início - Últimas Notícias',
  description: 'Fique por dentro das últimas notícias de tecnologia, esportes, mundo e entretenimento. Portal NewsNow - Sua fonte de informação confiável.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NewsNow - Portal de Notícias',
    description: 'Fique por dentro das últimas notícias de tecnologia, esportes, mundo e entretenimento',
    type: 'website',
  },
};

export default function HomePage() {
  const newsByCategory = {
    'Tecnologia': mockNews.filter(n => n.category === 'Tecnologia'),
    'Esportes': mockNews.filter(n => n.category === 'Esportes'),
    'Mundo': mockNews.filter(n => n.category === 'Mundo'),
    'Entretenimento': mockNews.filter(n => n.category === 'Entretenimento')
  };

  // JSON-LD Schema para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'NewsNow',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/newsnow',
      'https://facebook.com/newsnow',
      'https://instagram.com/newsnow',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <NewsCarousel />

          {/* Latest News */}
          <section className="mt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold">Últimas Notícias</h2>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockNews.slice(0, 8).map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </section>

          {/* News by Category */}
          {Object.entries(newsByCategory).map(([category, news]) => (
            news.length > 0 && (
              <section key={category} className="mt-16">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-bold">{category}</h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map(item => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              </section>
            )
          ))}
        </div>
      </div>
    </>
  );
}
