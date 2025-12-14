'use client';

import { useState, useEffect, useRef } from 'react';
import NewsCard from '@/components/NewsCard';

export default function InfiniteNewsGrid({ initialNews, categorySlug, totalCount = 0 }) {
  const [news, setNews] = useState(initialNews);
  const [offset, setOffset] = useState(initialNews.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialNews.length === 20);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/news?category=${categorySlug}&offset=${offset}&limit=20`);
      const data = await response.json();
      
      if (!data.news || data.news.length === 0) {
        setHasMore(false);
      } else {
        setNews(prev => [...prev, ...data.news]);
        setOffset(prev => prev + data.news.length);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Erro ao carregar mais notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, offset]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {news.map((item, index) => (
          <NewsCard key={`${item.id}-${index}`} news={item} />
        ))}
      </div>

      {/* Loading trigger */}
      <div ref={loadMoreRef} className="mt-8 text-center">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-sm text-muted-foreground">Carregando mais notícias...</p>
          </div>
        )}
        {!hasMore && news.length > 0 && (
          <p className="text-sm text-muted-foreground py-8">
            Total de {news.length} {news.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
          </p>
        )}
      </div>
    </>
  );
}
