'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, TrendingUp, Loader2 } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import PageTracker from '@/components/PageTracker';
import { mockNews, searchPrefixes } from '@/lib/mock';
import { searchNewsFromBoca } from '@/lib/api';
import { getContentAsText } from '@/lib/utils';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setSearchInput(query);
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setDisplayCount(12);
      return;
    }

    setIsLoading(true);
    setDisplayCount(12);
    try {
      const results = await searchNewsFromBoca(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setIsLoadingMore(false);
    }, 500);
  };

  useEffect(() => {
    if (searchInput.length > 0) {
      const filtered = mockNews.filter(news =>
        news.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        news.subtitle.toLowerCase().includes(searchInput.toLowerCase()) ||
        news.category.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchInput]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchInput)}`);
      setShowSuggestions(false);
    }
  };

  const handlePrefixClick = (label) => {
    setSearchInput(label);
    router.push(`/busca?q=${encodeURIComponent(label)}`);
  };

  const allFilteredNews = searchResults.length > 0 ? searchResults : mockNews.filter(news => {
    const contentText = getContentAsText(news.content);
    
    return news.title.toLowerCase().includes(query.toLowerCase()) ||
      news.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      news.category.toLowerCase().includes(query.toLowerCase()) ||
      contentText.toLowerCase().includes(query.toLowerCase());
  });

  const filteredNews = allFilteredNews.slice(0, displayCount);
  const hasMore = allFilteredNews.length > displayCount;

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isLoadingMore || !hasMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Quando chegar a 80% da página, carrega mais
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, isLoadingMore, hasMore, displayCount]);

  return (
    <div className="min-h-screen">
      <PageTracker title={`Busca: ${query}`} />
      <div className="bg-gradient-to-r from-secondary to-secondary/50 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Buscar Notícias
          </h1>

          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-card border-2 rounded-2xl p-4 shadow-lg focus-within:border-blue-500 transition-colors">
                <SearchIcon className="w-6 h-6 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Busque por um tema, palavra ou título..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="flex-1 bg-transparent border-none outline-none text-lg"
                />
                <button
                  type="submit"
                  className="ml-3 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Buscar
                </button>
              </div>
            </form>

            {showSuggestions && suggestions.length > 0 && searchInput && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 rounded-2xl shadow-2xl z-50 overflow-hidden">
                {suggestions.map(news => (
                  <button
                    key={news.id}
                    onClick={() => router.push(`/noticia/${news.id}`)}
                    className="flex items-center gap-3 p-4 hover:bg-secondary transition-colors w-full text-left"
                  >
                    <img
                      src={news.image}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold line-clamp-2 text-sm">
                        {news.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {news.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Buscas Populares:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {searchPrefixes.map(prefix => (
                <button
                  key={prefix.id}
                  onClick={() => handlePrefixClick(prefix.label)}
                  className="px-4 py-2 bg-card border rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-medium text-sm"
                >
                  {prefix.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {query && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Resultados para: <span className="text-blue-600">"{query}"</span>
            </h2>
            <p className="text-muted-foreground">
              {isLoading ? 'Buscando...' : `${allFilteredNews.length} ${allFilteredNews.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg text-muted-foreground">Buscando notícias...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNews.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
            
            {isLoadingMore && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="text-sm text-muted-foreground">Carregando mais notícias...</p>
              </div>
            )}

            {!hasMore && allFilteredNews.length > 12 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Você viu todas as {allFilteredNews.length} notícias 🎉
                </p>
              </div>
            )}
          </>
        ) : query && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="w-16 h-16 mb-4 opacity-30" />
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente outro termo de busca 🔍
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <SearchIcon className="w-12 h-12 mx-auto mb-4 animate-pulse opacity-50" />
          <p className="text-muted-foreground">Carregando busca...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
