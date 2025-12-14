'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareButton({ title }) {
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado para área de transferência!');
    }
  };

  return ( 
    <button
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white border rounded-lg transition-all font-medium w-full sm:w-auto text-sm sm:text-base"
      aria-label="Compartilhar notícia"
    >
      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
      <span>Compartilhar</span>
    </button>
  );
}
