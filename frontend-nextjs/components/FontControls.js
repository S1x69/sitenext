'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function FontControls() {
  const [fontSize, setFontSize] = useState(16);

  const increaseFontSize = () => {
    if (fontSize < 24) {
      const newSize = fontSize + 2;
      setFontSize(newSize);
      document.documentElement.style.setProperty('--content-font-size', `${newSize}px`);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      const newSize = fontSize - 2;
      setFontSize(newSize);
      document.documentElement.style.setProperty('--content-font-size', `${newSize}px`);
    }
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-secondary border rounded-lg">
      <button
        onClick={decreaseFontSize}
        className="p-1 hover:bg-background rounded transition-colors"
        aria-label="Diminuir fonte"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium">A</span>
      <button
        onClick={increaseFontSize}
        className="p-1 hover:bg-background rounded transition-colors"
        aria-label="Aumentar fonte"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
    </div>
  );
}
