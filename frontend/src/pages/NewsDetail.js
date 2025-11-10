import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, User, Share2, PlayCircle, PauseCircle, ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { mockNews } from '../mock';
import NewsCard from '../components/NewsCard';
import { toast } from 'sonner';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const foundNews = mockNews.find(n => n.id === id);
    if (foundNews) {
      setNews(foundNews);
      const related = mockNews.filter(n => n.category === foundNews.category && n.id !== id).slice(0, 3);
      setRelatedNews(related);
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.subtitle,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copiado para área de transferência!');
    }
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(news.content);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    } else {
      toast.error('Seu navegador não suporta esta funcionalidade');
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(prev => prev + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(prev => prev - 2);
  };

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Notícia não encontrada</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="news-detail-card">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="category-badge">{news.category}</span>
              </div>

              {/* Title */}
              <h1 className="news-detail-title">{news.title}</h1>
              <p className="news-detail-subtitle">{news.subtitle}</p>

              {/* Meta */}
              <div className="news-detail-meta">
                <span className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{news.author}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(news.date)}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="news-detail-actions">
                <button
                  onClick={handleReadAloud}
                  className="action-button"
                >
                  {isReading ? (
                    <>
                      <PauseCircle className="w-5 h-5" />
                      Pausar Áudio
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Ouvir Notícia
                    </>
                  )}
                </button>
                <button onClick={handleShare} className="action-button">
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decreaseFontSize}
                    className="font-size-button"
                    aria-label="Diminuir fonte"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium">A</span>
                  <button
                    onClick={increaseFontSize}
                    className="font-size-button"
                    aria-label="Aumentar fonte"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Featured Image */}
              <div className="news-detail-image-wrapper">
                <img src={news.image} alt={news.title} className="news-detail-image" />
              </div>

              {/* Content */}
              <div
                className="news-detail-content"
                style={{ fontSize: `${fontSize}px` }}
              >
                {news.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Share Again */}
              <div className="news-detail-share">
                <p className="text-sm font-medium mb-3">Gostou desta notícia? Compartilhe!</p>
                <button onClick={handleShare} className="btn-primary">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Author Info */}
              <div className="author-card">
                <div className="author-avatar">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="author-name">{news.author}</h3>
                <p className="author-bio">Jornalista especializado em {news.category}</p>
              </div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="related-news-card">
                  <h3 className="related-news-title">Notícias Relacionadas</h3>
                  <div className="space-y-4">
                    {relatedNews.map(item => (
                      <Link
                        key={item.id}
                        to={`/noticia/${item.id}`}
                        className="related-news-item"
                      >
                        <img src={item.image} alt={item.title} className="related-news-image" />
                        <div className="flex-1">
                          <h4 className="related-news-item-title">{item.title}</h4>
                          <span className="related-news-category">{item.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More from Category */}
        {relatedNews.length > 0 && (
          <section className="mt-16">
            <div className="section-header">
              <h2 className="section-title">Mais de {news.category}</h2>
              <div className="section-divider" />
            </div>
            <div className="news-grid">
              {mockNews.filter(n => n.category === news.category && n.id !== news.id).slice(0, 3).map(item => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
