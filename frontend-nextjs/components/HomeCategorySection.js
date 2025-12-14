'use client';

import { useState, useEffect, useRef } from 'react';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';

export default function HomeCategorySection({ category, initialNews, categorySlug }) {
  const [news, setNews] = useState(initialNews);
  const [offset, setOffset] = useState(initialNews.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialNews.length === 3);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/news?category=${categorySlug}&offset=${offset}&limit=3`);
      const data = await response.json();
      
      if (!data.news || data.news.length === 0) {
        setHasMore(false);
      } else {
        setNews(prev => [...prev, ...data.news]);
        setOffset(prev => prev + data.news.length);
        setHasMore(data.news.length === 3);
      }
    } catch (error) {
      console.error('Erro ao carregar mais notícias:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '400px',
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

  if (news.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold">{category}</h2>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
        <Link 
          href={`/categoria/${categorySlug}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap"
        >
          Ver todas →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <NewsCard key={`${item.id}-${index}`} news={item} />
        ))}
      </div>
      
      {/* Loading trigger */}
      <div ref={loadMoreRef} className="mt-4 text-center">
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </section>
  );
}
