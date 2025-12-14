import { NextResponse } from 'next/server';

const BOCA_NEWS_API_URL = 'https://api.boca.com.br/api/app/';

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
    const allNews = data || [];

    console.log(`Total de notícias recebidas: ${allNews.length}`);
    if (allNews.length > 0) {
      console.log('Primeira notícia:', JSON.stringify(allNews[0], null, 2));
    }

    // Filtrar notícias dos últimos 3 dias
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    //console.log(`Filtrando notícias após: ${threeDaysAgo.toISOString()}`);

    const recentNews = allNews
      .filter(item => {
        // Prioridade: updated_at > LastModified > date > created_at
        const newsDate = new Date(
           item.date || item.updated_at || item.LastModified || item.created_at
        );
        const isRecent = newsDate >= threeDaysAgo;
        if (!isRecent) {
          //console.log(`Notícia excluída (antiga): ${item.title} - Data: ${item.updated_at || item.LastModified || item.date || item.created_at}`);
        }
        return isRecent;
      })
      .sort((a, b) => {
        const dateA = new Date(a.updated_at || a.LastModified || a.date || a.created_at);
        const dateB = new Date(b.updated_at || b.LastModified || b.date || b.created_at);
        return dateB - dateA; // Mais recentes primeiro
      })
      .slice(0, 50); // Máximo 50 notícias

    console.log(`Notícias recentes (últimos 3 dias): ${recentNews}`);

    const baseUrl = 'https://boca.com.br';

    // Gerar XML no formato Google News Sitemap
    const urls = recentNews.map(item => {
      // Data de publicação (preferencialmente 'date' ou 'created_at')
      let publishedDateRaw = item.date || item.created_at;
      let publishedDate = publishedDateRaw ? new Date(publishedDateRaw) : new Date();
      if (isNaN(publishedDate.getTime())) publishedDate = new Date();
      const publishedIso = publishedDate.toISOString();
      // Data de atualização (preferencialmente 'updated_at' ou 'LastModified', senão data de publicação)
      let lastModRaw = item.updated_at || item.LastModified || item.date || item.created_at;
      let lastModDate = lastModRaw ? new Date(lastModRaw) : new Date();
      if (isNaN(lastModDate.getTime())) lastModDate = new Date();
      const lastModIso = lastModDate.toISOString();

      // Log da notícia sendo adicionada ao sitemap
     console.log(item);

      // Adicionar imagem se existir
      const imageTag = item.image ? `
    <image:image>
      <image:loc>${item.image}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
    </image:image>` : '';

      return `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${lastModIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>${imageTag}
    <news:news>
      <news:publication>
        <news:name>Boca News</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${publishedIso}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
