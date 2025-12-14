// Sitemap de categorias
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boca.com.br';
  
  const categories = [
    'agronegocio', 'economia', 'politica', 'tecnologia', 
    'esportes', 'cotacoes', 'mercado', 'noticias'
  ];

  const urls = categories.map(cat => `
  <url>
    <loc>${baseUrl}/categoria/${cat}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
