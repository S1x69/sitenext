'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockNews } from '@/lib/mock';

export default function NewsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredNews = mockNews.filter(news => news.featured);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredNews.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  if (featuredNews.length === 0) return null;

  const currentNews = featuredNews[currentSlide];

  return (
    <div className="carousel-container relative">
      <div className="relative w-full h-full">
        <Image
          src={currentNews.image}
          alt={currentNews.title}
          fill
          className="object-cover"
          priority
        />
        <div className="carousel-overlay" />
        <div className="carousel-content">
          {currentNews.tag && (
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4 border border-white/30">
              {currentNews.tag}
            </span>
          )}
          <h2 className="carousel-title">{currentNews.title}</h2>
          <p className="carousel-subtitle">{currentNews.subtitle}</p>
          <Link
            href={`/noticia/${currentNews.id}`}
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105"
          >
            Ler Mais
          </Link>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white/30 transition-all z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full hover:bg-white/30 transition-all z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {featuredNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
