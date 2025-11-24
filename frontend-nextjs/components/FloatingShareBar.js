'use client';

import { useEffect, useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function FloatingShareBar({ title }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div
      className={`fixed left-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'
      }`}
    >
      <div className="bg-card border rounded-2xl p-3 shadow-2xl space-y-3">
        <button
          onClick={shareOnTwitter}
          className="block p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors group"
          aria-label="Compartilhar no Twitter"
        >
          <Twitter className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={shareOnFacebook}
          className="block p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors group"
          aria-label="Compartilhar no Facebook"
        >
          <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={shareOnLinkedin}
          className="block p-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors group"
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
        </button>
        <div className="h-px bg-border" />
        <button
          onClick={copyToClipboard}
          className={`block p-3 rounded-xl transition-all group ${
            copied ? 'bg-green-100 dark:bg-green-950' : 'hover:bg-secondary'
          }`}
          aria-label="Copiar link"
        >
          <LinkIcon className={`w-5 h-5 group-hover:scale-110 transition-transform ${
            copied ? 'text-green-600' : ''
          }`} />
        </button>
      </div>
    </div>
  );
}
