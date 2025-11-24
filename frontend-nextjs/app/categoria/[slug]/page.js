import { notFound } from 'next/navigation';
import { mockNews, categories } from '@/lib/mock';
import NewsCard from '@/components/NewsCard';

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }) {
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    return {
      title: 'Categoria não encontrada',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/categoria/${category.slug}`;

  return {
    title: `${category.name} - Notícias`,
    description: `Confira as últimas notícias de ${category.name}. Fique por dentro de tudo que acontece.`,
    openGraph: {
      title: `${category.name} - NewsNow`,
      description: `Notícias de ${category.name}`,
      url: url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function CategoryPage({ params }) {
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  const categoryNews = category.id === 'all'
    ? mockNews
    : mockNews.filter(news => news.category.toLowerCase() === category.name.toLowerCase());

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-secondary to-secondary/50 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-2">{category.name}</h1>
          <p className="text-center text-muted-foreground">
            {categoryNews.length} {categoryNews.length === 1 ? 'notícia' : 'notícias'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categoryNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryNews.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">Nenhuma notícia nesta categoria</h3>
            <p className="text-muted-foreground">Em breve teremos mais conteúdo por aqui!</p>
          </div>
        )}
      </div>
    </div>
  );
}
