'use client';

import { TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';

export default function CotacaoCard({ cotacao, onClick }) {
  const isPositive = cotacao.variacao >= 0;
  const variacaoClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div 
      onClick={() => onClick && onClick(cotacao)}
      className="relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Gradient Background Accent */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${
        isPositive ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
      }`} />
      
      {/* Layout Vertical em Mobile */}
      <div className="relative space-y-3">
        {/* Badge de Variação - Topo em Mobile */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
              {cotacao.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight group-hover:text-primary transition-colors">
                {cotacao.nome}
              </h3>
              <p className="text-xs text-muted-foreground">{cotacao.unidade}</p>
            </div>
          </div>
          
          {/* Badge de Variação Compacto */}
          <div className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-1 rounded-lg font-bold text-xs ${
            isPositive 
              ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800' 
              : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
            <span className="whitespace-nowrap">{isPositive ? '+' : ''}{cotacao.variacao.toFixed(2)}%</span>
          </div>
        </div>

        {/* Preço Principal */}
        <div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black leading-none mb-1.5 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            R$ {formatPrice(cotacao.preco)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span className="truncate">{formatDate(cotacao.ultimaAtualizacao)}</span>
          </div>
        </div>

        {/* Estatísticas Compactas */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-border">
          <div className="bg-secondary/50 p-2 sm:p-2.5 rounded-lg">
            <div className="text-xs text-muted-foreground mb-0.5 sm:mb-1 flex items-center gap-1">
              <span className="text-red-500">↓</span>
              <span className="hidden sm:inline">Mínima</span>
              <span className="sm:hidden">Mín</span>
            </div>
            <div className="font-bold text-xs sm:text-sm md:text-base text-red-600 dark:text-red-400 leading-none">
              {formatPrice(cotacao.minimo)}
            </div>
          </div>
          <div className="bg-secondary/50 p-2 sm:p-2.5 rounded-lg">
            <div className="text-xs text-muted-foreground mb-0.5 sm:mb-1 flex items-center gap-1">
              <span className="text-green-500">↑</span>
              <span className="hidden sm:inline">Máxima</span>
              <span className="sm:hidden">Máx</span>
            </div>
            <div className="font-bold text-xs sm:text-sm md:text-base text-green-600 dark:text-green-400 leading-none">
              {formatPrice(cotacao.maximo)}
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de Hover - Oculto em mobile */}
      <div className="hidden sm:block absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="w-5 h-5 text-primary" />
      </div>
    </div>
  );
}
