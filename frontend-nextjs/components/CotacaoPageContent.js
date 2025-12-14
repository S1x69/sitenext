'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CotacaoCard from '@/components/CotacaoCard';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { trackPageView } from '@/lib/tracking';

export default function CotacaoPageContent({ category, cotacoes }) {
  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  const router = useRouter();

  // Scroll suave para o topo ao carregar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView('Categoria: Cotações do Agronegócio');
  }, []);

  const handleCotacaoClick = (cotacao) => {
    router.push(`/cotacoes/${cotacao.id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-green-600 to-green-500 border-b text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-2">💰 {category.name}</h1>
          <p className="text-sm md:text-base text-center text-green-50">
            Acompanhe as cotações do agronegócio em tempo real - Clique para ver detalhes
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-12 space-y-8 md:space-y-12">
        {/* Cards de Cotação */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {cotacoes.map(cotacao => (
            <CotacaoCard 
              key={cotacao.id} 
              cotacao={cotacao} 
              onClick={handleCotacaoClick}
            />
          ))}
        </div>

        {/* Tabela Resumida */}
        <div className="bg-card rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 md:p-6">
            <h2 className="text-lg md:text-2xl font-bold">📊 Resumo das Cotações</h2>
            <p className="text-sm md:text-base text-blue-100">Visão geral do mercado agropecuário</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left py-2 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold">Commodity</th>
                  <th className="text-center py-2 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold">Unidade</th>
                  <th className="text-right py-2 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold">Preço Atual</th>
                  <th className="text-right py-2 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold">Variação</th>
                  <th className="text-right py-2 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold">Mínima</th>
                  <th className="text-right py-2 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold">Máxima</th>
                </tr>
              </thead>
              <tbody>
                {cotacoes.map((cotacao) => {
                  const isPositive = cotacao.variacao >= 0;
                  return (
                      <tr 
                      key={cotacao.id} 
                      className="border-b hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => handleCotacaoClick(cotacao)}
                    >
                      <td className="py-2 md:py-4 px-3 md:px-6">
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className="text-lg md:text-2xl">{cotacao.icon}</span>
                          <span className="font-semibold text-xs md:text-sm">{cotacao.nome}</span>
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6 text-center text-xs text-muted-foreground">
                        {cotacao.unidade}
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6 text-right font-bold text-sm md:text-lg">
                        R$ {formatPrice(cotacao.preco)}
                      </td>
                      <td className={`py-2 md:py-4 px-3 md:px-6 text-right font-bold text-xs md:text-sm ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="flex items-center justify-end gap-1">
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                          ) : (
                            <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                          {isPositive ? '+' : ''}{cotacao.variacao.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6 text-right text-red-600 font-semibold text-xs md:text-sm">
                        R$ {formatPrice(cotacao.minimo)}
                      </td>
                      <td className="py-2 md:py-4 px-3 md:px-6 text-right text-green-600 font-semibold text-xs md:text-sm">
                        R$ {formatPrice(cotacao.maximo)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Análise de Mercado */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 md:p-6 rounded-xl md:rounded-2xl border border-green-200 dark:border-green-800">
            <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4 text-green-800 dark:text-green-200">📈 Maiores Altas</h3>
            <div className="space-y-2 md:space-y-3">
              {cotacoes
                .filter(c => c.variacao > 0)
                .sort((a, b) => b.variacao - a.variacao)
                .slice(0, 3)
                .map(cotacao => (
                  <div key={cotacao.id} className="flex justify-between items-center p-2 md:p-3 bg-white dark:bg-green-950 rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-xl">{cotacao.icon}</span>
                      <span className="font-semibold text-xs md:text-sm">{cotacao.nome}</span>
                    </div>
                    <span className="text-green-600 font-bold text-xs md:text-sm">+{cotacao.variacao.toFixed(2)}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-4 md:p-6 rounded-xl md:rounded-2xl border border-red-200 dark:border-red-800">
            <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4 text-red-800 dark:text-red-200">📉 Maiores Quedas</h3>
            <div className="space-y-2 md:space-y-3">
              {cotacoes
                .filter(c => c.variacao < 0)
                .sort((a, b) => a.variacao - b.variacao)
                .slice(0, 3)
                .map(cotacao => (
                  <div key={cotacao.id} className="flex justify-between items-center p-2 md:p-3 bg-white dark:bg-red-950 rounded-lg md:rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-xl">{cotacao.icon}</span>
                      <span className="font-semibold text-xs md:text-sm">{cotacao.nome}</span>
                    </div>
                    <span className="text-red-600 font-bold text-xs md:text-sm">{cotacao.variacao.toFixed(2)}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
