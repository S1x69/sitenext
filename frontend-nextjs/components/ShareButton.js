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
      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white border rounded-lg transition-all font-medium"
    >
      <Share2 className="w-5 h-5" />
      Compartilhar
    </button>
  );
}
