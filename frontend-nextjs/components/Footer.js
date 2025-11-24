'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Inscrição realizada com sucesso!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-secondary border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Sobre Nós</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NewsNow é seu portal de notícias moderno, trazendo as últimas informações de tecnologia, esportes, cultura e mundo.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li><Link href="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</Link></li>
              <li><Link href="/publicidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Publicidade</Link></li>
              <li><Link href="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li><Link href="/categoria/tecnologia" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tecnologia</Link></li>
              <li><Link href="/categoria/esportes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Esportes</Link></li>
              <li><Link href="/categoria/mundo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mundo</Link></li>
              <li><Link href="/categoria/entretenimento" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entretenimento</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Receba as principais notícias diretamente no seu email.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background border rounded-lg outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Assinar
              </button>
            </form>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-background transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-background transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-background transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-background transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-background transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 NewsNow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
