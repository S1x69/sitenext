// Sitemap de páginas estáticas
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boca.com.br';
  
  const pages = [
    { url: '', priority: '1.0', changefreq: 'hourly' },
    { url: '/sobre', priority: '0.5', changefreq: 'monthly' },
    { url: '/contato', priority: '0.5', changefreq: 'monthly' },
    { url: '/publicidade', priority: '0.4', changefreq: 'monthly' },
    { url: '/privacidade', priority: '0.3', changefreq: 'yearly' },
    { url: '/busca', priority: '0.7', changefreq: 'daily' },
  ];

  const urls = pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
