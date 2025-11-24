'use client';

import { useState } from 'react';
import { Quote } from 'lucide-react';

export default function InteractiveQuote({ text, author }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative my-12 group"
    >
      <div className="absolute -left-4 top-0 opacity-20 group-hover:opacity-40 transition-opacity">
        <Quote className="w-16 h-16 text-blue-500" />
      </div>
      <blockquote
        className={`relative border-l-4 border-blue-500 pl-8 py-6 transition-all duration-300 ${
          isHovered ? 'bg-blue-50 dark:bg-blue-950 rounded-r-xl pr-6' : ''
        }`}
      >
        <p className="text-xl md:text-2xl font-medium italic leading-relaxed text-foreground">
          {text}
        </p>
        {author && (
          <footer className="mt-4 text-sm text-muted-foreground font-semibold">
            — {author}
          </footer>
        )}
      </blockquote>
    </div>
  );
}
