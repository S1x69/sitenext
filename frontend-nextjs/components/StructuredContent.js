'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function StructuredContent({ content, title }) {
  const [activeSection, setActiveSection] = useState(null);

  // Extrair seções para o índice "Nesta Notícia"
  const sections = content
    .filter(block => block.type === 'subtitle')
    .map((block, index) => ({
      id: `section-${index}`,
      title: block.text
    }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderBlock = (block, index) => {
    let sectionIndex = 0;

    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-base sm:text-lg leading-[1.8] sm:leading-[1.9] text-gray-700 dark:text-gray-300 mb-6 text-justify hyphens-auto tracking-normal">
            {block.text}
          </p>
        );

      case 'subtitle':
        const currentSectionId = `section-${sections.findIndex(s => s.title === block.text)}`;
        return (
          <h2 
            key={index} 
            id={currentSectionId}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-14 mb-7 scroll-mt-24 leading-tight tracking-tight"
          >
            {block.text}
          </h2>
        );

      case 'quote':
        return (
          <blockquote key={index} className="relative my-10 pl-8 py-6 border-l-4 border-primary italic bg-gray-50/50 dark:bg-gray-800/30 rounded-r-lg">
            <div className="absolute -left-3 -top-2 text-6xl text-primary/20 font-serif">"</div>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-[1.8] mb-3">
              {block.text.split('—')[0].trim()}
            </p>
            {block.text.includes('—') && (
              <footer className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 not-italic font-medium">
                — {block.text.split('—')[1].trim()}
              </footer>
            )}
          </blockquote>
        );

      case 'info_box':
        return (
          <div key={index} className="my-10 p-5 sm:p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {block.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-[1.8]">
              {block.text}
            </p>
          </div>
        );

      case 'highlight':
        return (
          <div key={index} className="my-10 p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-base sm:text-lg font-medium text-amber-900 dark:text-amber-300 leading-[1.8]">
              ✨ {block.text}
            </p>
          </div>
        );

      case 'image':
        // Validar se a URL existe e é válida
        if (!block.url) return null;
        
        // Verificar se é Base64
        const isBase64 = block.url.startsWith('data:image');
        
        // Construir URL completa se necessário
        let imageUrl = block.url;
        if (!isBase64 && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          // Se não tem protocolo, adicionar domínio base
          imageUrl = imageUrl.startsWith('/') 
            ? `https://boca.com.br${imageUrl}`
            : `https://boca.com.br/${imageUrl}`;
        }

        return (
          <figure key={index} className="my-12">
            <div className="relative w-full h-auto rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
              {isBase64 ? (
                // Para Base64, usar tag img normal
                <img
                  src={imageUrl}
                  alt={block.alt_text || 'Imagem da notícia'}
                  className="w-full h-auto object-contain max-h-[600px]"
                />
              ) : (
                // Para URLs, usar Next Image
                <Image
                  src={imageUrl}
                  alt={block.alt_text || 'Imagem da notícia'}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                  onError={(e) => {
                    // Fallback para imagem padrão em caso de erro
                    e.target.src = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449';
                  }}
                />
              )}
            </div>
            {block.caption && (
              <figcaption className="mt-4 px-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center italic leading-relaxed">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'list':
        return (
          <ul key={index} className="my-8 space-y-4">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 sm:gap-4 text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm sm:text-base leading-[1.8]">{item}</span>
              </li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      {content.map((block, index) => renderBlock(block, index))}
    </article>
  );
}
