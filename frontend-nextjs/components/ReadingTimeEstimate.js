'use client';

import { Clock } from 'lucide-react';
import { getContentAsText } from '@/lib/utils';

export default function ReadingTimeEstimate({ content }) {
  const wordsPerMinute = 200;
  const contentText = getContentAsText(content);
  const words = contentText.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
      <Clock className="w-4 h-4" />
      <span>{minutes} min de leitura</span>
    </div>
  );
}
