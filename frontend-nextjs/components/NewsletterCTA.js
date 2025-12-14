'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envio
    setTimeout(() => {
      toast.success('Inscrito com sucesso! Verifique seu email.');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="my-16 p-8 md:p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <Mail className="w-8 h-8" />
          </div>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Não perca nenhuma notícia!
        </h3>
        <p className="text-center text-white/90 mb-8 text-lg max-w-2xl mx-auto">
          Receba as principais notícias e análises diretamente no seu email. Grátis e sem spam.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-row gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Endereço de email</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50 flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0"
              aria-label="Assinar newsletter"
            >
              {loading ? 'Enviando...' : <><Send className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden xs:inline sm:inline">Assinar</span><span className="xs:hidden sm:hidden">✓</span></>}
            </button>
          </div>
          <p className="text-xs text-white/70 text-center mt-3">
            Ao assinar, você concorda com nossa política de privacidade.
          </p>
        </form>
      </div>
    </div>
  );
}
