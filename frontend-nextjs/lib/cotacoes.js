const COTACOES_API_URL = 'https://api.boca.com.br/api/cotacoes';

/**
 * Busca as cotações atualizadas do banco de dados
 * Retorna array com cotações no formato necessário para o frontend
 * 
 * A API deve retornar um JSON com o seguinte formato:
 * [
 *   {
 *     "id": "milho",
 *     "nome": "Milho",
 *     "unidade": "saca 60kg",
 *     "icon": "🌽",
 *     "cor": "yellow",
 *     "historico": [
 *       { "data": "2025-12-01T00:00:00-03:00", "preco": 65.80 },
 *       { "data": "2025-12-02T00:00:00-03:00", "preco": 66.30 }
 *     ]
 *   }
 * ]
 */
export async function fetchCotacoes() {
  try {
    const response = await fetch(COTACOES_API_URL, {
      next: { revalidate: 10 } // Revalidar a cada 10 segundos
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar cotações');
    }

    const data = await response.json();
    
    // Processar dados do banco e calcular variações
    return data.map(cotacao => processCotacao(cotacao));
  } catch (error) {
    console.error('Erro ao buscar cotações:', error);
    return [];
  }
}

/**
 * Processa uma cotação individual, calculando variações e formatando dados
 */
function processCotacao(cotacao) {
  // Ordenar histórico completo por data
  const historicoCompleto = cotacao.historico?.sort((a, b) => 
    new Date(a.data) - new Date(b.data)
  ) || [];

  // Pegar apenas os últimos 7 dias para cálculos
  const historico7dias = historicoCompleto.slice(-7);

  // Calcular variações baseado nos últimos 7 dias
  const historicoComVariacao = historico7dias.map((item, index) => {
    let variacao = 0;
    
    if (index > 0) {
      const precoAnterior = historico7dias[index - 1].preco;
      variacao = ((item.preco - precoAnterior) / precoAnterior) * 100;
    }
    
    return {
      ...item,
      variacao: Number(variacao.toFixed(2))
    };
  });

  // Pegar último item (hoje)
  const hoje = historicoComVariacao[historicoComVariacao.length - 1] || {};
  
  // Calcular variação do dia (hoje vs ontem)
  let variacaoDia = 0;
  if (historicoComVariacao.length >= 2) {
    const ontem = historicoComVariacao[historicoComVariacao.length - 2];
    variacaoDia = ((hoje.preco - ontem.preco) / ontem.preco) * 100;
  }

  // Calcular mínimo e máximo dos últimos 7 dias
  const precos = historicoComVariacao.map(h => h.preco);
  const minimo = Math.min(...precos);
  const maximo = Math.max(...precos);

  return {
    id: cotacao.id,
    nome: cotacao.nome,
    unidade: cotacao.unidade,
    preco: hoje.preco || 0,
    variacao: Number(variacaoDia.toFixed(2)),
    minimo: Number(minimo.toFixed(2)),
    maximo: Number(maximo.toFixed(2)),
    ultimaAtualizacao: hoje.data || new Date().toISOString(),
    icon: cotacao.icon || '📊',
    cor: cotacao.cor || 'gray',
    historico7dias: historicoComVariacao,
    historico30dias: historicoCompleto.map((item, index) => {
      let variacao = 0;
      if (index > 0) {
        const precoAnterior = historicoCompleto[index - 1].preco;
        variacao = ((item.preco - precoAnterior) / precoAnterior) * 100;
      }
      return {
        ...item,
        variacao: Number(variacao.toFixed(2))
      };
    })
  };
}

/**
 * Busca uma cotação específica por ID
 */
export async function fetchCotacaoById(id) {
  try {
    const response = await fetch(`${COTACOES_API_URL}?id=${id}`, {
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar cotação ${id}`);
    }

    const data = await response.json();
    
    // Se retornar array, pegar o primeiro item
    const cotacao = Array.isArray(data) ? data[0] : data;
    
    if (!cotacao) {
      return null;
    }
    
    return processCotacao(cotacao);
  } catch (error) {
    console.error(`Erro ao buscar cotação ${id}:`, error);
    return null;
  }
}

/**
 * Formata o histórico para display nos gráficos
 */
export function formatHistoricoParaGrafico(historico) {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return historico.map((item, index) => {
    const data = new Date(item.data);
    const isHoje = index === historico.length - 1;
    
    return {
      dia: isHoje ? 'Hoje' : diasSemana[data.getDay()],
      data: item.data,
      dataOriginal: item.data,
      preco: item.preco,
      variacao: item.variacao
    };
  });
}
