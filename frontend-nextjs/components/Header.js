'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Moon, Sun, Bell, User, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { categories } from '@/lib/mock';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMobileSearchOpen(false);
        setSearchQuery('');
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileSearchOpen || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileSearchOpen, mobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileSearchOpen(false);
    }
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    if (mobileSearchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <header className="header-gradient sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-2">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="logo-icon">
              <span className="text-xl sm:text-2xl font-bold">BN</span>
            </div>
            <span className="text-base sm:text-xl font-bold">BocaNoticias</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {categories.slice(1).map(cat => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="nav-link text-sm font-medium transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-secondary border rounded-xl px-4 py-2">
            <label htmlFor="search-desktop" className="sr-only">Buscar notícias</label>
            <input
              id="search-desktop"
              type="text"
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-48"
            />
            <button type="submit" className="ml-2 p-1 hover:bg-primary/10 rounded" aria-label="Buscar">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              ref={searchRef}
              onClick={toggleMobileSearch}
              className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              {mounted ? (
                theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors hidden md:block" aria-label="Notificações">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors hidden md:block" aria-label="Perfil do usuário">
              <User className="w-5 h-5" />
            </button>
            <button
              ref={menuRef}
              className="p-2 rounded-lg hover:bg-secondary transition-colors lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div ref={searchRef} className="lg:hidden pb-3 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="flex items-center bg-secondary border rounded-xl px-4 py-2">
              <label htmlFor="search-mobile" className="sr-only">Buscar notícias</label>
              <input
                id="search-mobile"
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1"
                autoFocus
              />
              <button type="submit" className="ml-2 p-1 hover:bg-primary/10 rounded" aria-label="Buscar">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <nav ref={menuRef} className="lg:hidden absolute left-0 right-0 top-full bg-background/95 backdrop-blur-md border-b shadow-lg pb-3 pt-3 space-y-2 px-4 animate-in slide-in-from-top duration-300">
            {categories.slice(1).map(cat => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="block py-2 px-3 rounded-lg hover:bg-secondary text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
