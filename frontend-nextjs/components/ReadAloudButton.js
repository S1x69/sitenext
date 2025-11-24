'use client';

import { useState } from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ReadAloudButton({ content }) {
  const [isReading, setIsReading] = useState(false);

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      if (isReading) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
        setIsReading(true);
      }
    } else {
      toast.error('Seu navegador não suporta esta funcionalidade');
    }
  };

  return (
    <button
      onClick={handleReadAloud}
      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white border rounded-lg transition-all font-medium"
    >
      {isReading ? (
        <>
          <PauseCircle className="w-5 h-5" />
          Pausar Áudio
        </>
      ) : (
        <>
          <PlayCircle className="w-5 h-5" />
          Ouvir Notícia
        </>
      )}
    </button>
  );
}
