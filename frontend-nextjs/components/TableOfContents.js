'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, List } from 'lucide-react';

export default function TableOfContents({ sections }) {
  const [activeSection, setActiveSection] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  return (
    <div className="sticky top-20 z-40">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-card border rounded-xl mb-2 hover:bg-secondary transition-colors"
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5" />
          <span className="font-semibold">Navegar por Seções</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop/Mobile Menu */}
      <nav className={`bg-card border rounded-xl p-4 shadow-lg ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}>
        <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">
          Nesta Notícia
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-left w-full p-2 rounded-lg transition-all text-sm ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-secondary'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
