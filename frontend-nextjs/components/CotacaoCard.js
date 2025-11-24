'use client';

import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default function CotacaoCard({ cotacao }) {
  const isPositive = cotacao.variacao >= 0;
  const variacaoClass = isPositive ? 'text-green-600' : 'text-red-600';
  const bgClass = isPositive 
    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`p-6 rounded-2xl border-2 ${bgClass} hover:scale-105 transition-all duration-300 cursor-pointer group`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{cotacao.icon}</div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
              {cotacao.nome}
            </h3>
            <p className="text-xs text-muted-foreground">{cotacao.unidade}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
          isPositive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
        }`}>
          {isPositive ? (
            <TrendingUp className={`w-4 h-4 ${variacaoClass}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 ${variacaoClass}`} />
          )}
          <span className={`text-sm font-bold ${variacaoClass}`}>
            {isPositive ? '+' : ''}{cotacao.variacao.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Preço Principal */}
      <div className="mb-4">
        <div className="text-3xl font-black mb-1">
          R$ {cotacao.preco.toFixed(2)}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          Atualizado às {formatDate(cotacao.ultimaAtualizacao)}
        </div>
      </div>

      {/* Máxima e Mínima */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-300 dark:border-gray-700">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Mínima</div>
          <div className="font-semibold text-sm">R$ {cotacao.minimo.toFixed(2)}</div>
        </div>
        <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Máxima</div>
          <div className="font-semibold text-sm">R$ {cotacao.maximo.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
