import { NextResponse } from 'next/server';

const BOCA_NEWS_API_URL = 'https://boca.com.br/api/app/';

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    // Buscar todas as notícias
    const response = await fetch(BOCA_NEWS_API_URL, {
      next: { revalidate: 10 } // 10 segundos
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar notícias');
    }

    const data = await response.json();
    const allNews = data.data || [];

    // Filtrar notícias dos últimos 3 dias
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentNews = allNews
      .filter(item => {
        const newsDate = new Date(item.date || item.LastModified);
        return newsDate >= threeDaysAgo;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.LastModified);
        const dateB = new Date(b.date || b.LastModified);
        return dateB - dateA; // Mais recentes primeiro
      })
      .slice(0, 50); // Máximo 50 notícias

    const baseUrl = 'https://bocanews.com.br';

    // Gerar XML no formato Google News Sitemap
    const urls = recentNews.map(item => {
      const pubDate = new Date(item.date || item.LastModified);
      const isoDate = pubDate.toISOString();

      return `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    <news:news>
      <news:publication>
        <news:name>Boca News</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${isoDate}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar news-sitemap:', error);
    return new NextResponse('Erro ao gerar sitemap', { status: 500 });
  }
}
