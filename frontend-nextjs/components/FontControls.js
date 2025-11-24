'use client';

import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function FontControls() {
  const [fontSize, setFontSize] = useState(18);

  useEffect(() => {
    // Aplicar tamanho inicial
    const contentElements = document.querySelectorAll('.article-content p, .article-content li');
    contentElements.forEach(el => {
      el.style.fontSize = `${fontSize}px`;
    });
  }, []);

  const increaseFontSize = () => {
    if (fontSize < 26) {
      const newSize = fontSize + 2;
      setFontSize(newSize);
      const contentElements = document.querySelectorAll('.article-content p, .article-content li');
      contentElements.forEach(el => {
        el.style.fontSize = `${newSize}px`;
      });
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) {
      const newSize = fontSize - 2;
      setFontSize(newSize);
      const contentElements = document.querySelectorAll('.article-content p, .article-content li');
      contentElements.forEach(el => {
        el.style.fontSize = `${newSize}px`;
      });
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-secondary border rounded-lg">
      <button
        onClick={decreaseFontSize}
        className="p-1 hover:bg-background rounded transition-colors"
        aria-label="Diminuir fonte"
        disabled={fontSize <= 14}
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium">A</span>
      <button
        onClick={increaseFontSize}
        className="p-1 hover:bg-background rounded transition-colors"
        aria-label="Aumentar fonte"
        disabled={fontSize >= 26}
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
}
