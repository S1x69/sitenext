import { NextResponse } from 'next/server';
import { fetchAllNews, fetchNewsTotalCount } from '@/lib/api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '20');
  const countOnly = searchParams.get('count') === 'true';

  try {
    // Se só quer contar
    if (countOnly) {
      const total = await fetchNewsTotalCount(category);
      return NextResponse.json({ total });
    }

    const news = await fetchAllNews(limit, category, offset);
    
    return NextResponse.json({
      news,
      hasMore: news.length === limit
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json({ news: [], hasMore: false, total: 0 }, { status: 500 });
  }
}
