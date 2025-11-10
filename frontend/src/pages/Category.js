import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { mockNews, categories } from '../mock';

const Category = () => {
  const { slug } = useParams();
  const [categoryNews, setCategoryNews] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const category = categories.find(cat => cat.slug === slug);
    if (category) {
      setCategoryName(category.name);
      if (category.id === 'all') {
        setCategoryNews(mockNews);
      } else {
        const filtered = mockNews.filter(news =>
          news.category.toLowerCase() === category.name.toLowerCase()
        );
        setCategoryNews(filtered);
      }
    }
  }, [slug]);

  return (
    <div className="min-h-screen">
      <div className="category-hero">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center">{categoryName}</h1>
          <p className="text-center mt-2 opacity-70">
            {categoryNews.length} {categoryNews.length === 1 ? 'notícia' : 'notícias'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {categoryNews.length > 0 ? (
          <div className="news-grid">
            {categoryNews.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">Nenhuma notícia nesta categoria</h3>
            <p className="opacity-70">Em breve teremos mais conteúdo por aqui!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
