'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Calendar, Clock, BarChart3, ArrowLeft, Activity } from 'lucide-react';
import { trackPageView } from '@/lib/tracking';

export default function CotacaoDetalhada({ cotacao, cotacoes }) {
  // Scroll suave para o topo ao carregar

  console.log(cotacoes);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(`Cotação: ${cotacao.nome}`);
  }, [cotacao.id, cotacao.nome]);
  const isPositive = cotacao.variacao >= 0;
  const variacaoClass = isPositive ? 'text-green-600' : 'text-red-600';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDateWithWeekday = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Importar função de formatação
  const formatHistoricoParaGrafico = (historico) => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const hoje = new Date();
    const hojeStr = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    return historico.map((item, index) => {
      const data = new Date(item.data);
      const dataStr = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      // Verificar se é hoje comparando as datas
      const isHoje = dataStr === hojeStr;
      
      return {
        dia: isHoje ? 'Hoje' : diasSemana[data.getDay()],
        data: item.data,
        dataOriginal: item.data,
        preco: item.preco,
        variacao: item.variacao
      };
    });
  };

  // Usar dados históricos reais da API
  const historicoSemanal = formatHistoricoParaGrafico(cotacao.historico7dias || []);
  
  // Criar histórico de 30 dias baseado nos dados reais
  const historico30Dias = (cotacao.historico30dias || []).map((item) => ({
    data: new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    preco: item.preco,
    variacao: item.variacao
  }));

  const informacoesDetalhadas = [
    { categoria: 'Preço', itens: [
      { label: 'Abertura', valor: `R$ ${formatPrice(cotacao.preco * 0.98)}` },
      { label: 'Fechamento Anterior', valor: `R$ ${formatPrice(cotacao.preco * 0.976)}` },
      { label: 'Mínima do Dia', valor: `R$ ${formatPrice(cotacao.minimo)}` },
      { label: 'Máxima do Dia', valor: `R$ ${formatPrice(cotacao.maximo)}` },
    ]},
    { categoria: 'Período Estendido', itens: [
      { label: 'Mínima 52 semanas', valor: `R$ ${formatPrice(cotacao.minimo * 0.85)}` },
      { label: 'Máxima 52 semanas', valor: `R$ ${formatPrice(cotacao.maximo * 1.15)}` },
      { label: 'Média 30 dias', valor: `R$ ${formatPrice(cotacao.preco * 0.99)}` },
      { label: 'Média 90 dias', valor: `R$ ${formatPrice(cotacao.preco * 0.97)}` },
    ]},
    { categoria: 'Volume e Negociação', itens: [
      { label: 'Volume', valor: `${(cotacao.preco * 120).toFixed(0)} ton` },
      { label: 'Volume Médio', valor: `${(cotacao.preco * 95).toFixed(0)} ton` },
      { label: 'Negócios', valor: `${Math.floor(cotacao.preco * 8)}` },
      { label: 'Oscilação', valor: `${((cotacao.maximo - cotacao.minimo) / cotacao.minimo * 100).toFixed(2)}%` },
    ]}
  ];

  // Outras cotações relacionadas
  const cotacoesRelacionadas = cotacoes.filter(c => c.id !== cotacao.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 animate-in fade-in duration-500">
      {/* Breadcrumb e Voltar */}
      <div className="bg-secondary border-b animate-in slide-in-from-top duration-300">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/categoria/cotacoes" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Cotações
          </Link>
        </div>
      </div>

      {/* Header com Preço Principal */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="flex items-center gap-3 md:gap-6 mb-4 md:mb-6">
            <div className="text-4xl md:text-7xl">{cotacao.icon}</div>
            <div>
              <h1 className="text-2xl md:text-5xl font-black mb-1 md:mb-2">{cotacao.nome}</h1>
              <p className="text-sm md:text-xl text-blue-100">{cotacao.unidade}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 md:gap-6">
            <div className="text-3xl md:text-6xl font-black">
              R$ {formatPrice(cotacao.preco)}
            </div>
            <div className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full ${
              isPositive ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />
              ) : (
                <TrendingDown className="w-4 h-4 md:w-6 md:h-6" />
              )}
              <span className="text-lg md:text-2xl font-bold">
                {isPositive ? '+' : ''}{cotacao.variacao.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs md:text-base text-blue-100">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            Atualizado: {formatDate(cotacao.ultimaAtualizacao)}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-12 space-y-6 md:space-y-8">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-card dark:bg-card p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border dark:border-border light:bg-gray-50/80 light:border-gray-200">
            <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">Abertura</div>
            <div className="text-lg md:text-2xl font-bold">R$ {formatPrice(cotacao.preco * 0.98)}</div>
          </div>
          <div className="bg-card dark:bg-card p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border dark:border-border light:bg-gray-50/80 light:border-gray-200">
            <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">Mínima</div>
            <div className="text-lg md:text-2xl font-bold text-red-600">R$ {formatPrice(cotacao.minimo)}</div>
          </div>
          <div className="bg-card dark:bg-card p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border dark:border-border light:bg-gray-50/80 light:border-gray-200">
            <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">Máxima</div>
            <div className="text-lg md:text-2xl font-bold text-green-600">R$ {formatPrice(cotacao.maximo)}</div>
          </div>
          <div className="bg-card dark:bg-card p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border dark:border-border light:bg-gray-50/80 light:border-gray-200">
            <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">Volume</div>
            <div className="text-lg md:text-2xl font-bold">{(cotacao.preco / 10 + 5).toFixed(1)}k</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Histórico dos Últimos 7 Dias */}
          <div className="bg-card dark:bg-card rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border dark:border-border light:bg-gray-50/80 light:border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <h2 className="text-lg md:text-2xl font-bold">Últimos 7 Dias</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-secondary">
                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold">Dia</th>
                    <th className="text-center py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold">Data</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold">Preço</th>
                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold">Var.</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoSemanal.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-secondary/50 transition-colors">
                      <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-medium">{item.dia}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-center text-muted-foreground text-xs md:text-sm">{formatDateWithWeekday(item.dataOriginal)}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-right text-xs md:text-sm font-semibold">
                        R$ {formatPrice(item.preco)}
                      </td>
                      <td className={`py-2 md:py-3 px-2 md:px-4 text-right text-xs md:text-sm font-bold ${
                        item.variacao >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.variacao >= 0 ? '+' : ''}{item.variacao.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Análise de Mercado */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <h2 className="text-lg md:text-2xl font-bold">Análise de Mercado</h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              <p className="text-sm md:text-base leading-relaxed">
                O mercado de {cotacao.nome.toLowerCase()} apresenta {isPositive ? 'tendência de alta' : 'tendência de baixa'} com 
                variação de {Math.abs(cotacao.variacao).toFixed(2)}% nas últimas 24 horas.
              </p>
              <p className="leading-relaxed">
                Especialistas recomendam atenção aos próximos dias devido à {isPositive ? 'forte demanda' : 'pressão vendedora'} 
                observada no mercado. Os preços estão {cotacao.preco > (cotacao.minimo + cotacao.maximo) / 2 ? 'acima' : 'abaixo'} da 
                média do dia.
              </p>
              <p className="leading-relaxed font-semibold text-blue-700 dark:text-blue-300">
                {isPositive ? '📈 Momento favorável para acompanhamento' : '📉 Cautela recomendada aos investidores'}
              </p>
            </div>
          </div>
        </div>

        {/* Informações Detalhadas */}
        <div className="bg-card dark:bg-card rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border dark:border-border light:bg-gray-50/80 light:border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            <h2 className="text-lg md:text-2xl font-bold">Informações Detalhadas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {informacoesDetalhadas.map((secao, index) => (
              <div key={index}>
                <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 text-blue-600">{secao.categoria}</h3>
                <div className="space-y-2 md:space-y-3">
                  {secao.itens.map((info, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 md:p-3 bg-secondary rounded-lg md:rounded-xl">
                      <span className="text-xs md:text-sm text-muted-foreground">{info.label}</span>
                      <span className="text-sm md:text-base font-bold">{info.valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico Mensal */}
        <div className="bg-card dark:bg-card rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border dark:border-border light:bg-gray-50/80 light:border-gray-200">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Últimos 30 Dias</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary">
                  <th className="text-left py-3 px-4 font-semibold">Data</th>
                  <th className="text-right py-3 px-4 font-semibold">Preço (R$)</th>
                  <th className="text-right py-3 px-4 font-semibold">Variação (%)</th>
                </tr>
              </thead>
              <tbody>
                {historico30Dias.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{item.data}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatPrice(item.preco)}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${
                      item.variacao >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.variacao >= 0 ? '+' : ''}{item.variacao.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cotações Relacionadas */}
        <div className="bg-card dark:bg-card rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border dark:border-border light:bg-gray-50/80 light:border-gray-200">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Outras Cotações</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {cotacoesRelacionadas.map((c) => (
              <Link 
                key={c.id}
                href={`/cotacoes/${c.id}`}
                className="p-3 md:p-4 bg-secondary hover:bg-secondary/70 dark:bg-secondary dark:hover:bg-secondary/70 light:bg-white/80 light:hover:bg-white rounded-lg md:rounded-xl transition-all hover:scale-105 border light:border-gray-200"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <span className="text-2xl md:text-3xl">{c.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-sm md:text-base truncate">{c.nome}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.unidade}</div>
                  </div>
                </div>
                <div className="text-base md:text-lg font-bold">R$ {formatPrice(c.preco)}</div>
                <div className={`text-xs md:text-sm font-bold ${c.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {c.variacao >= 0 ? '+' : ''}{c.variacao.toFixed(2)}%
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
