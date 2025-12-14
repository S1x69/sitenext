'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockNews } from '@/lib/mock';

export default function NewsCarousel({ news }) {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const featuredNews = news.filter(news => news.featured);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredNews.length]);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  if (featuredNews.length === 0) return null;

  const currentNews = featuredNews[currentSlide];

  return (
    <div className="carousel-container relative overflow-hidden">
      <div className="relative w-full h-full">
        {featuredNews.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'translate-x-0 opacity-100'
                : index < currentSlide
                ? '-translate-x-full opacity-0'
                : 'translate-x-full opacity-0'
            }`}
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="carousel-overlay" />
            <div className={`carousel-content transition-all duration-500 delay-200 ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}> 
              {item.tag && (
                <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4 border border-white/30">
                  {item.tag}
                </span>
              )}
              <h2 className="carousel-title">{item.title}</h2>
              <p className="carousel-subtitle">{item.subtitle}</p>
              <Link
                href={`${item.url}`}
                className="inline-block px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105"
              >
                Ler Mais
              </Link>
            </div>
          </div>
        ))}
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
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
