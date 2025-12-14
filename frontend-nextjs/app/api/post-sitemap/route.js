// Middleware para capturar requisições de sitemap dinâmico
import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/api';

export async function GET(request) {
  const pageNum = parseInt(request.url.match(/sitemap(\d+)/)[1]) || 1;
  const postsPerPage = 1000;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boca.com.br';
  
  try {

    console.log(`Generating sitemap for page ${pageNum}`);
    
    // Calcular offset para buscar apenas os posts desta página
    const offset = (pageNum - 1) * postsPerPage;
    
    // Buscar apenas os 1000 posts desta página específica
    const news = await fetchAllNews(postsPerPage, null, offset);
    
    if (!news || news.length === 0) {
      const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- No posts available -->
</urlset>`;
      
      return new Response(emptyXml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    console.log(`Fetched ${news.length} news items for post-sitemap${pageNum}.xml`);

    const urls = news.map(item => {
      // Formatar data para ISO 8601: YYYY-MM-DDTHH:MM:SS+00:00
      const lastModDate = new Date(item.LastModified || item.date);
      const isoDate = lastModDate.toISOString();

      return `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${isoDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${escapeXml(item.image)}</image:loc>
      <image:title>${escapeXml(item.title)}</image:title>
    </image:image>
  </url>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Error: ${error.message} -->
</urlset>`;
    
    return new Response(errorXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export const dynamic = 'force-dynamic';
