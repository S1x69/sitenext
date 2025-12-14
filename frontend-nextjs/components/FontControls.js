'use client';

import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function FontControls() {
  const [fontLevel, setFontLevel] = useState(0); // -2, -1, 0, 1, 2

  useEffect(() => {
    // Remover classes anteriores ao montar
    document.documentElement.classList.remove('font-size-xs', 'font-size-sm', 'font-size-lg', 'font-size-xl');
  }, []);

  const increaseFontSize = () => {
    if (fontLevel < 2) {
      const newLevel = fontLevel + 1;
      setFontLevel(newLevel);
      applyFontClass(newLevel);
    }
  };

  const decreaseFontSize = () => {
    if (fontLevel > -2) {
      const newLevel = fontLevel - 1;
      setFontLevel(newLevel);
      applyFontClass(newLevel);
    }
  };

  const applyFontClass = (level) => {
    // Remover todas as classes de fonte
    document.documentElement.classList.remove('font-size-xs', 'font-size-sm', 'font-size-lg', 'font-size-xl');
    
    // Adicionar nova classe baseada no nível
    if (level === -2) {
      document.documentElement.classList.add('font-size-xs');
    } else if (level === -1) {
      document.documentElement.classList.add('font-size-sm');
    } else if (level === 1) {
      document.documentElement.classList.add('font-size-lg');
    } else if (level === 2) {
      document.documentElement.classList.add('font-size-xl');
    }
    // level === 0 não adiciona nenhuma classe (tamanho padrão)
  };

  return (
    <>
      <style jsx global>{`
        .font-size-xs .prose p,
        .font-size-xs .prose li,
        .font-size-xs .prose blockquote p,
        .font-size-xs .article-content p,
        .font-size-xs .article-content li {
          font-size: 0.875rem !important;
        }
        
        .font-size-sm .prose p,
        .font-size-sm .prose li,
        .font-size-sm .prose blockquote p,
        .font-size-sm .article-content p,
        .font-size-sm .article-content li {
          font-size: 0.9375rem !important;
        }
        
        .font-size-lg .prose p,
        .font-size-lg .prose li,
        .font-size-lg .prose blockquote p,
        .font-size-lg .article-content p,
        .font-size-lg .article-content li {
          font-size: 1.125rem !important;
        }
        
        .font-size-xl .prose p,
        .font-size-xl .prose li,
        .font-size-xl .prose blockquote p,
        .font-size-xl .article-content p,
        .font-size-xl .article-content li {
          font-size: 1.25rem !important;
        }
      `}</style>
      
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-secondary border rounded-lg" role="group" aria-label="Controles de tamanho de fonte">
        <button
          onClick={decreaseFontSize}
          className="p-1 hover:bg-background rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Diminuir tamanho da fonte"
          disabled={fontLevel <= -2}
        >
          <ZoomOut className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="text-sm font-medium" aria-hidden="true">A</span>
        <button
          onClick={increaseFontSize}
          className="p-1 hover:bg-background rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Aumentar tamanho da fonte"
          disabled={fontLevel >= 2}
        >
          <ZoomIn className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
