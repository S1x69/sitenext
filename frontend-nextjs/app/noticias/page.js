import { fetchAllNews } from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageTracker from '@/components/PageTracker';

export const revalidate = 60; // Revalidar a cada 1 minuto

export const metadata = {
  title: 'Últimas Notícias - Boca Notícias',
  description: 'Confira as últimas notícias do agronegócio, economia, política e muito mais.',
  openGraph: {
    title: 'Últimas Notícias - Boca Notícias',
    description: 'Confira as últimas notícias do agronegócio, economia, política e muito mais.',
    type: 'website',
  },
  alternates: {
    canonical: '/noticias',
  },
};

export default async function NoticiasPage() {
  // Buscar as últimas 50 notícias
  const news = await fetchAllNews(50);

  return (
    <div className="min-h-screen">
      <PageTracker title="Últimas Notícias - BocaNoticias" />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 mb-4 sm:mb-6 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Últimas Notícias
          </h1>
          <p className="text-lg text-muted-foreground">
            Acompanhe as notícias mais recentes do agronegócio brasileiro
          </p>
        </div>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Nenhuma notícia encontrada no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
