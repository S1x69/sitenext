'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ReadAloudButton({ content }) {
  const [isReading, setIsReading] = useState(false);
  const pathname = usePathname();

  // Parar áudio quando mudar de rota ou sair da página
  useEffect(() => {
    const stopSpeech = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsReading(false);
      }
    };

    // Parar quando mudar de rota
    stopSpeech();

    // Parar quando desmontar o componente
    return stopSpeech;
  }, [pathname]);

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
      className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white border rounded-lg transition-all font-medium w-full sm:w-auto text-sm sm:text-base"
      aria-label={isReading ? "Pausar leitura da notícia" : "Ouvir notícia"}
    >
      {isReading ? (
        <>
          <PauseCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          <span>Pausar</span>
        </>
      ) : (
        <>
          <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          <span>Ouvir</span>
        </>
      )}
    </button>
  );
}
