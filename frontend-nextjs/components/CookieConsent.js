'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Settings, Shield, ChevronRight } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Sempre true, não pode desabilitar
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Verificar se já aceitou os cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Mostrar após 1 segundo
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowPreferences(false);
    setIsVisible(false);
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return; // Não pode desabilitar necessários
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay escuro */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998] animate-fade-in" />

      {/* Banner Principal */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] animate-slide-up">
        <div className="container mx-auto px-4 pb-4 sm:pb-6">
          <div className="bg-card border-2 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
              {/* Ícone e Texto */}
              <div className="flex-1">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      🍪 Sua Privacidade é Importante
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Usamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
                      Ao continuar navegando, você concorda com nossa{' '}
                      <a href="/privacidade" className="text-blue-600 hover:underline font-medium">
                        Política de Privacidade
                      </a>
                      {' '}e o uso de cookies conforme a LGPD.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 hover:bg-secondary transition-all font-medium text-sm whitespace-nowrap"
                >
                  <Settings className="w-4 h-4" />
                  Preferências
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2.5 rounded-xl border-2 hover:bg-secondary transition-all font-medium text-sm whitespace-nowrap"
                >
                  Apenas Necessários
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm whitespace-nowrap shadow-lg shadow-blue-500/30"
                >
                  Aceitar Todos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Preferências */}
      {showPreferences && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPreferences(false)}
          />
          <div className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">Preferências de Cookies</h2>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <p className="text-muted-foreground mb-6">
                Gerencie suas preferências de cookies. Você pode habilitar ou desabilitar diferentes tipos de cookies abaixo.
              </p>

              {/* Necessários */}
              <div className="mb-6 p-4 bg-secondary rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Cookies Necessários</h3>
                    <p className="text-sm text-muted-foreground">
                      Essenciais para o funcionamento do site. Não podem ser desabilitados.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                  Autenticação, segurança, preferências do site
                </div>
              </div>

              {/* Analytics */}
              <div className="mb-6 p-4 border-2 rounded-xl hover:border-blue-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Cookies de Análise</h3>
                    <p className="text-sm text-muted-foreground">
                      Nos ajudam a entender como você usa o site para melhorar sua experiência.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className="ml-4"
                  >
                    <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.analytics ? 'bg-blue-600 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
                    } px-1`}>
                      <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                  Google Analytics, estatísticas de uso
                </div>
              </div>

              {/* Marketing */}
              <div className="mb-6 p-4 border-2 rounded-xl hover:border-blue-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Cookies de Marketing</h3>
                    <p className="text-sm text-muted-foreground">
                      Usados para exibir anúncios relevantes e medir a eficácia de campanhas.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className="ml-4"
                  >
                    <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.marketing ? 'bg-blue-600 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
                    } px-1`}>
                      <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                  Publicidade direcionada, remarketing
                </div>
              </div>

              {/* Preferências */}
              <div className="p-4 border-2 rounded-xl hover:border-blue-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Cookies de Preferências</h3>
                    <p className="text-sm text-muted-foreground">
                      Lembram suas escolhas e personalizações (idioma, tema, etc).
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('preferences')}
                    className="ml-4"
                  >
                    <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.preferences ? 'bg-blue-600 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
                    } px-1`}>
                      <div className="w-4 h-4 bg-white rounded-full transition-transform" />
                    </div>
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                  Idioma, tema, configurações personalizadas
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t bg-secondary/50">
              <a
                href="/politica-privacidade"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Ver Política de Privacidade
              </a>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 rounded-lg hover:bg-background transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Salvar Preferências
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
