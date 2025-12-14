// Sitemap de autores
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boca.com.br';
  
  const authors = [
    'joao-silva', 'maria-santos', 'pedro-oliveira', 
    'ana-costa', 'carlos-souza', 'redacao-boca-news'
  ];

  const urls = authors.map(author => `
  <url>
    <loc>${baseUrl}/autor/${author}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
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
