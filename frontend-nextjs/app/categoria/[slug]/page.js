import { notFound } from 'next/navigation';
import { mockNews, categories } from '@/lib/mock';
import NewsCard from '@/components/NewsCard';
import CotacaoPageContent from '@/components/CotacaoPageContent';
import InfiniteNewsGrid from '@/components/InfiniteNewsGrid';
import PageTracker from '@/components/PageTracker';
import { fetchAllNews, fetchNewsTotalCount } from '@/lib/api';
import { fetchCotacoes } from '@/lib/cotacoes';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidar a cada 5 minutos

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

  // Título especial para cotações
  const title = category.slug === 'cotacoes' 
    ? 'Cotações do agronegócio'
    : category.name;

  return {
    title: title,
    description: `Confira as últimas notícias de ${category.name}. Fique por dentro de tudo que acontece.`,
    openGraph: {
      title: `${category.name} - Boca Notícias`,
      description: `Notícias de ${category.name}`,
      url: url,
      locale: 'pt_BR',
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CategoryPage({ params }) {
  const category = categories.find(cat => cat.slug === params.slug);

  if (!category) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Se for a categoria de cotações, buscar dados atualizados do banco
  if (category.slug === 'cotacoes') {
    const cotacoesAtualizadas = await fetchCotacoes();
    
    // JSON-LD estruturado para Google News - Categoria Cotações
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "headline": "Cotações do Agronegócio - BocaNotícias",
      "description": "Acompanhe as cotações atualizadas do agronegócio em tempo real. Preços de commodities agrícolas, variações e análises do mercado.",
      "url": `${baseUrl}/categoria/cotacoes`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": cotacoesAtualizadas.map((cotacao, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${baseUrl}/cotacoes/${cotacao.id}`,
          "name": cotacao.nome,
          "description": `Cotação de ${cotacao.nome}: R$ ${cotacao.preco.toFixed(2)}`
        }))
      },
      "publisher": {
        "@type": "Organization",
        "name": "BocaNotícias",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.svg`
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Início",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Cotações do Agronegócio",
            "item": `${baseUrl}/categoria/cotacoes`
          }
        ]
      },
      "about": {
        "@type": "Thing",
        "name": "Cotações do Agronegócio",
        "description": "Cotações atualizadas de commodities agrícolas e produtos do agronegócio"
      }
    };
    
    const jsonLdString = JSON.stringify(jsonLd);
    
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
        <CotacaoPageContent category={category} cotacoes={cotacoesAtualizadas} />
      </>
    );
  }

  // Buscar total e carregar apenas as primeiras 20 notícias inicialmente
  const total = await fetchNewsTotalCount(category.slug);
  const categoryNews = await fetchAllNews(20, category.slug, 0);

  return (
    <div className="min-h-screen">
      <PageTracker title={`Categoria: ${category.name}`} />
      <div className="bg-gradient-to-r from-secondary to-secondary/50 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-2">{category.name}</h1>
          <p className="text-center text-muted-foreground mt-2">
            Total encontrado: {total} {total === 1 ? 'notícia' : 'notícias'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categoryNews.length > 0 ? (
          <InfiniteNewsGrid 
            initialNews={categoryNews} 
            categorySlug={category.slug}
            totalCount={total}
          />
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
