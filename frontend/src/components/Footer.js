import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Inscrição realizada com sucesso!');
      setEmail('');
    }
  };

  return (
    <footer className="footer-bg mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Sobre Nós</h3>
            <p className="footer-text text-sm leading-relaxed">
              NewsNow é seu portal de notícias moderno, trazendo as últimas informações de tecnologia, esportes, cultura e mundo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="footer-link text-sm">Sobre Nós</Link></li>
              <li><Link to="/contato" className="footer-link text-sm">Contato</Link></li>
              <li><Link to="/publicidade" className="footer-link text-sm">Publicidade</Link></li>
              <li><Link to="/privacidade" className="footer-link text-sm">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="footer-link text-sm">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li><Link to="/categoria/tecnologia" className="footer-link text-sm">Tecnologia</Link></li>
              <li><Link to="/categoria/esportes" className="footer-link text-sm">Esportes</Link></li>
              <li><Link to="/categoria/mundo" className="footer-link text-sm">Mundo</Link></li>
              <li><Link to="/categoria/entretenimento" className="footer-link text-sm">Entretenimento</Link></li>
              <li><Link to="/categoria/cultura" className="footer-link text-sm">Cultura</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="footer-text text-sm mb-4">
              Receba as principais notícias diretamente no seu email.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input w-full"
                required
              />
              <button type="submit" className="newsletter-button w-full">
                <Mail className="w-4 h-4 mr-2" />
                Assinar
              </button>
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="footer-text text-sm">
              © 2025 NewsNow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
