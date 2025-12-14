'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/tracking';

export default function PageTracker({ title }) {
  useEffect(() => {
    if (title) {
      // Pequeno delay para garantir que a página carregou
      const timer = setTimeout(() => {
        trackPageView(title);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [title]);

  return null;
}
