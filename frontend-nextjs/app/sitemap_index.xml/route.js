// Sitemap Index - Estilo Yoast SEO
import { fetchNewsCount } from '@/lib/newsCount';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boca.com.br';
  
  // Buscar apenas a contagem total de notícias (rápido e leve)
  const totalPosts = await fetchNewsCount();
  const postsPerSitemap = 1000;
  const totalPostSitemaps = Math.ceil(totalPosts / postsPerSitemap);
  
  // Gerar sitemaps de posts (post-sitemap1.xml, post-sitemap2.xml, etc)
  let postSitemaps = '';
  for (let i = 1; i <= totalPostSitemaps; i++) {
    postSitemaps += `
  <sitemap>
    <loc>${baseUrl}/post-sitemap${i}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/page-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/category-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/author-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>${postSitemaps}
  <sitemap>
    <loc>${baseUrl}/news-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
