import { notFound } from 'next/navigation';
import CotacaoDetalhada from '@/components/CotacaoDetalhada';
import { fetchCotacoes, fetchCotacaoById } from '@/lib/cotacoes';
import PageTracker from '@/components/PageTracker';

export const dynamic = 'force-dynamic';
export const revalidate = 10; // Revalidar a cada 10 segundos

export async function generateStaticParams() {
  const cotacoes = await fetchCotacoes();
  return cotacoes.map((cotacao) => ({
    id: cotacao.id,
  }));
}

export async function generateMetadata({ params }) {
  const cotacao = await fetchCotacaoById(params.id);
  
  if (!cotacao) {
    return {
      title: 'Cotação não encontrada',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/cotacoes/${cotacao.id}`;

  return {
    title: `${cotacao.nome} - Cotação Atualizada`,
    description: `Acompanhe a cotação atualizada de ${cotacao.nome} (${cotacao.unidade}). Preço atual: R$ ${cotacao.preco.toFixed(2)}, Variação: ${cotacao.variacao >= 0 ? '+' : ''}${cotacao.variacao.toFixed(2)}%`,
    openGraph: {
      title: `${cotacao.nome} - Cotação em Tempo Real`,
      description: `Preço: R$ ${cotacao.preco.toFixed(2)} | Variação: ${cotacao.variacao >= 0 ? '+' : ''}${cotacao.variacao.toFixed(2)}%`,
      url: url,
      locale: 'pt_BR',
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CotacaoPage({ params }) {
  const cotacao = await fetchCotacaoById(params.id);
  
  if (!cotacao) {
    notFound();
  }

  // Buscar todas as cotações para comparação
  const todasCotacoes = await fetchCotacoes();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // JSON-LD estruturado para Google News
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": `${cotacao.nome} - Cotação Atualizada do Agronegócio`,
    "description": `Acompanhe a cotação atualizada de ${cotacao.nome} (${cotacao.unidade}). Preço atual: R$ ${cotacao.preco.toFixed(2)}, Variação: ${cotacao.variacao >= 0 ? '+' : ''}${cotacao.variacao.toFixed(2)}%`,
    "url": `${baseUrl}/cotacoes/${cotacao.id}`,
    "datePublished": cotacao.data_atualizacao || new Date().toISOString(),
    "dateModified": cotacao.data_atualizacao || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "BocaNotícias",
      "url": baseUrl
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
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/cotacoes/${cotacao.id}`
    },
    "articleSection": "Cotações do Agronegócio",
    "keywords": `${cotacao.nome}, cotação, agronegócio, preço, commodities, ${cotacao.categoria || 'agrícola'}`,
    "about": {
      "@type": "Thing",
      "name": cotacao.nome,
      "description": `Cotação de ${cotacao.nome} no mercado do agronegócio`
    }
  };

  const jsonLdString = JSON.stringify(jsonLd);

  return (
    <>
      <PageTracker title={`Cotação: ${cotacao.nome}`} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <CotacaoDetalhada cotacao={cotacao} cotacoes={todasCotacoes} />
    </>
  );
}
