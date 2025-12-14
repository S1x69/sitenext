'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      
      // Encontrar o elemento "Tópicos Relacionados" pelo ID
      const relatedTopicsElement = document.getElementById('related-topics');
      
      let targetHeight;
      if (relatedTopicsElement) {
        // Usar a posição do final do elemento (topo + altura)
        const elementTop = relatedTopicsElement.getBoundingClientRect().top + window.scrollY;
        const elementHeight = relatedTopicsElement.offsetHeight;
        const elementBottom = elementTop + elementHeight;
        targetHeight = elementBottom - window.innerHeight;
      } else {
        // Fallback: usar altura total da página
        targetHeight = document.documentElement.scrollHeight - window.innerHeight;
      }
      
      // Garantir que targetHeight não seja negativo
      targetHeight = Math.max(targetHeight, 1);
      
      const scrollPercent = Math.min((scrollTop / targetHeight) * 100, 100);
      setProgress(scrollPercent >= 0 ? scrollPercent : 0);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-[100]">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
