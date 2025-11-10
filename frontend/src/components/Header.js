import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Bell, User, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../mock';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="header-gradient sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="logo-icon">
              <span className="text-xl sm:text-2xl font-bold">NN</span>
            </div>
            <span className="logo-text text-base sm:text-xl font-bold">NewsNow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {categories.slice(1).map(cat => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="nav-link text-sm font-medium transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center search-bar">
            <input
              type="text"
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="icon-button"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button className="icon-button hidden md:flex" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button className="icon-button hidden md:flex" aria-label="User profile">
              <User className="w-5 h-5" />
            </button>
            <button
              className="icon-button lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="flex items-center search-bar w-full">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input flex-1"
              />
              <button type="submit" className="search-button">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-3 animate-slide-down border-t border-opacity-20 pt-3">
            <div className="flex flex-col space-y-2">
              {categories.slice(1).map(cat => (
                <Link
                  key={cat.id}
                  to={`/categoria/${cat.slug}`}
                  className="nav-link text-sm font-medium py-2 px-3 rounded-lg hover:bg-opacity-10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
