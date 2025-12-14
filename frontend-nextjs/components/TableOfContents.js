'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, List } from 'lucide-react';

export default function TableOfContents({ sections }) {
  const [activeSection, setActiveSection] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const handleScroll = () => {
      // Posição do scroll com offset para compensar o header
      const scrollPosition = window.scrollY + 200;

      let currentSection = '';

      // Percorrer seções de cima para baixo
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          // Verificar se a posição do scroll está dentro da seção
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = section.id;
          }
        }
      });

      // Se nenhuma seção foi encontrada, usar a última visível
      if (!currentSection) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i].id);
          if (element && scrollPosition >= element.offsetTop) {
            currentSection = sections[i].id;
            break;
          }
        }
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Debounce para performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    handleScroll(); // Chamada inicial

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [sections, activeSection]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Atualizar seção ativa imediatamente
      setActiveSection(id);
      setIsOpen(false);

      // Fazer scroll com offset
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-20 z-40">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-card border rounded-xl mb-2 hover:bg-secondary transition-colors"
        aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5" />
          <span className="font-semibold">Navegar por Seções</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop/Mobile Menu */}
      <nav className={`bg-card/80 backdrop-blur-md border rounded-xl p-4 shadow-md transition-all duration-300 ${
        isOpen ? 'block animate-in slide-in-from-top' : 'hidden lg:block'
      }`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b">
          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
          <h3 className="text-sm font-bold text-foreground">
            Nesta Notícia
          </h3>
          <span className="ml-auto text-xs text-muted-foreground">{sections.length}</span>
        </div>

        {/* Sections List */}
        <ul className="space-y-1">
          {sections.map((section, index) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`relative text-left w-full px-2.5 py-2 rounded-lg transition-all text-sm flex items-center gap-2.5 group ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'hover:bg-secondary/80'
                }`}
                aria-label={`Navegar para seção: ${section.title}`}
                aria-current={activeSection === section.id ? "location" : undefined}
              >
                {/* Number Badge */}
                <span className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-semibold transition-all ${
                  activeSection === section.id
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/50'
                }`}>
                  {index + 1}
                </span>
                
                {/* Section Title */}
                <span className="flex-1 leading-snug break-words text-[13px]">
                  {section.title}
                </span>

                {/* Dot indicator for active */}
                {activeSection === section.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
