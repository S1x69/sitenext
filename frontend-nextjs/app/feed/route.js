import { NextResponse } from 'next/server';
import { format } from 'date-fns';

const SITE_URL = 'https://boca.com.br';
const FEED_TITLE = 'Boca Notícias';
const FEED_DESCRIPTION = 'Últimas notícias do Boca Notícias';
const FEED_LANGUAGE = 'pt-BR';
const FEED_AUTHOR = 'Boca Notícias';

function escapeXml(str = '') {
  return str
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchNews() {
  try {
    const res = await fetch(`https://api.boca.com.br/api/app/`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("Erro ao buscar API:", e);
    return [];
  }
}

export async function GET() {
  const news = await fetchNews();

  const items = news.slice(0, 40).map(item => {
    const title = escapeXml(item.title || 'Sem título');
    const link = SITE_URL + (item.url || '/');
    const author = escapeXml(item.author || FEED_AUTHOR);

    const pubDateRaw = item.date || item.created_at || new Date().toISOString();
    const pubDate = format(new Date(pubDateRaw), 'EEE, dd MMM yyyy HH:mm:ss xx');

    // ----- Conteúdo -----
    let contentHtml = '';
    if (Array.isArray(item.content)) {
      contentHtml = item.content.map(block => {
        if (block.type === 'paragraph' || block.type === 'highlight')
          return `<p>${escapeXml(block.text)}</p>`;

        if (block.type === 'subtitle')
          return `<h2>${escapeXml(block.text)}</h2>`;

        if (block.type === 'list') {
          const lis = (block.items || [])
            .map(li => `<li>${escapeXml(li)}</li>`)
            .join('');
          return `<ul>${lis}</ul>`;
        }

        if (block.type === 'info_box')
          return `<div><strong>${escapeXml(block.title)}:</strong> ${escapeXml(block.text)}</div>`;

        return '';
      }).join('');
    }

    // ----- Imagem -----
    let imageHtml = "";
    if (item.image) {
      imageHtml = `
<figure>
  <img src="${item.image}" alt="${title}" style="max-width:100%;height:auto;" />
  <figcaption>${title}</figcaption>
</figure>`;
    }

    // ---- Descrição ----
    const plainText = contentHtml.replace(/<[^>]+>/g, '');
    let description = imageHtml + plainText.slice(0, 300) + (plainText.length > 300 ? "..." : "");

    // ---- Categorias / Tags ----
    let categories = "";
    let mediaKeywords = "";
    if (Array.isArray(item.tag)) {
      categories = item.tag
        .map(cat => `<category><![CDATA[${cat}]]></category>`)
        .join('\n');

      mediaKeywords = item.tag.join(', ');
    }

    // ---- Enclosure ----
    let enclosure = "";
    if (item.image) {
      enclosure = `<enclosure url="${item.image}" length="100000" type="image/jpeg" />`;
    }

    // ---- Apple + Google + Microsoft content ----
    const contentEncoded = `
<content:encoded><![CDATA[
${imageHtml}
${contentHtml}
]]></content:encoded>`;

    // ---- Microsoft Media Module ----
    const mediaContent = item.image
      ? `
<media:content url="${item.image}" medium="image" />
<media:thumbnail url="${item.image}" />
<media:credit>${author}</media:credit>
<media:keywords>${mediaKeywords}</media:keywords>
    `
      : "";

    return `
      <item>
        <title>${title}</title>

        <link>${link}</link>
        <guid isPermaLink="false">${link}</guid>

        <dc:creator><![CDATA[${author}]]></dc:creator>
        <pubDate>${pubDate}</pubDate>

        ${categories}

        <description><![CDATA[${description}]]></description>

        ${contentEncoded}
        ${mediaContent}
        ${enclosure}
      </item>
    `;
  }).join('');

  const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <title>${FEED_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${FEED_DESCRIPTION}</description>
    <language>${FEED_LANGUAGE}</language>
    <copyright>${new Date().getFullYear()} ${FEED_AUTHOR}</copyright>

    <lastBuildDate>${format(new Date(), 'EEE, dd MMM yyyy HH:mm:ss xx')}</lastBuildDate>
    <ttl>5</ttl>

    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />

    <image>
      <url>${SITE_URL}/favicon.svg</url>
      <title>${FEED_TITLE}</title>
      <link>${SITE_URL}</link>
      <width>32</width>
      <height>32</height>
    </image>

    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300'
    }
  });
}
