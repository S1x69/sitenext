// Mock data para o portal de notícias
export const mockNews = [];

export const categories = [
  { id: 'all', name: 'Todas', slug: 'todas' },
  { id: 'agronegocio', name: 'Agronegócio', slug: 'agronegocio' },
  { id: 'economia', name: 'Economia', slug: 'economia' },
  { id: 'mercado', name: 'Mercado', slug: 'mercado' },
  { id: 'clima', name: 'Clima', slug: 'clima' },
  { id: 'politica', name: 'Política', slug: 'politica' },
  { id: 'saude', name: 'Saúde', slug: 'saude' },
  { id: 'internacional', name: 'Internacional', slug: 'internacional' },

  //{ id: 'news', name: 'Notícias', slug: 'noticias' },
   { id: 'tech', name: 'Tecnologia', slug: 'tecnologia' },
  //{ id: 'culture', name: 'Cultura', slug: 'cultura' },
  //{ id: 'sports', name: 'Esportes', slug: 'esportes' },
  //{ id: 'world', name: 'Mundo', slug: 'mundo' },
  //{ id: 'entertainment', name: 'Entretenimento', slug: 'entretenimento' },
  { id: 'cotacao', name: 'Cotações', slug: 'cotacoes' }

];

export const searchPrefixes = [
  { id: 1, label: 'Tecnologia', icon: '🔍' },
  { id: 2, label: 'Últimas Notícias', icon: '📰' },
  { id: 3, label: 'Mercado', icon: '📈' },
  { id: 4, label: 'Internacional', icon: '🌍' },
  { id: 5, label: 'Curiosidades', icon: '💡' },
  { id: 6, label: 'Entretenimento', icon: '🎬' }
];

// Dados de cotações
export const cotacoes = [
  {
    id: 'milho',
    nome: 'Milho',
    unidade: 'saca 60kg',
    preco: 67.50,
    variacao: 2.3,
    minimo: 65.20,
    maximo: 68.90,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🌽',
    cor: 'yellow',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 65.80, variacao: -1.2 },
      { dia: 'Ter', data: '2025-01-09', preco: 66.30, variacao: 0.8 },
      { dia: 'Qua', data: '2025-01-10', preco: 64.90, variacao: -2.1 },
      { dia: 'Qui', data: '2025-01-11', preco: 66.50, variacao: 2.5 },
      { dia: 'Sex', data: '2025-01-12', preco: 67.70, variacao: 1.8 },
      { dia: 'Sáb', data: '2025-01-13', preco: 67.50, variacao: -0.3 },
      { dia: 'Hoje', data: '2025-01-15', preco: 67.50, variacao: 2.3 }
    ]
  },
  {
    id: 'soja',
    nome: 'Soja',
    unidade: 'saca 60kg',
    preco: 142.80,
    variacao: -1.5,
    minimo: 140.50,
    maximo: 145.20,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🫘',
    cor: 'green',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 145.20, variacao: 0.5 },
      { dia: 'Ter', data: '2025-01-09', preco: 146.10, variacao: 0.6 },
      { dia: 'Qua', data: '2025-01-10', preco: 144.80, variacao: -0.9 },
      { dia: 'Qui', data: '2025-01-11', preco: 145.50, variacao: 0.5 },
      { dia: 'Sex', data: '2025-01-12', preco: 144.20, variacao: -0.9 },
      { dia: 'Sáb', data: '2025-01-13', preco: 144.95, variacao: 0.5 },
      { dia: 'Hoje', data: '2025-01-15', preco: 142.80, variacao: -1.5 }
    ]
  },
  {
    id: 'boi-gordo',
    nome: 'Boi Gordo',
    unidade: 'arroba',
    preco: 312.50,
    variacao: 1.8,
    minimo: 305.00,
    maximo: 318.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🐄',
    cor: 'red',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 307.00, variacao: 0.3 },
      { dia: 'Ter', data: '2025-01-09', preco: 308.50, variacao: 0.5 },
      { dia: 'Qua', data: '2025-01-10', preco: 306.80, variacao: -0.6 },
      { dia: 'Qui', data: '2025-01-11', preco: 309.20, variacao: 0.8 },
      { dia: 'Sex', data: '2025-01-12', preco: 310.50, variacao: 0.4 },
      { dia: 'Sáb', data: '2025-01-13', preco: 306.95, variacao: -1.1 },
      { dia: 'Hoje', data: '2025-01-15', preco: 312.50, variacao: 1.8 }
    ]
  },
  {
    id: 'frango',
    nome: 'Frango',
    unidade: 'kg',
    preco: 8.45,
    variacao: 0.5,
    minimo: 8.20,
    maximo: 8.60,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🐔',
    cor: 'orange',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 8.35, variacao: -0.2 },
      { dia: 'Ter', data: '2025-01-09', preco: 8.40, variacao: 0.6 },
      { dia: 'Qua', data: '2025-01-10', preco: 8.32, variacao: -1.0 },
      { dia: 'Qui', data: '2025-01-11', preco: 8.38, variacao: 0.7 },
      { dia: 'Sex', data: '2025-01-12', preco: 8.42, variacao: 0.5 },
      { dia: 'Sáb', data: '2025-01-13', preco: 8.41, variacao: -0.1 },
      { dia: 'Hoje', data: '2025-01-15', preco: 8.45, variacao: 0.5 }
    ]
  },
  {
    id: 'suino',
    nome: 'Suíno',
    unidade: 'kg',
    preco: 9.20,
    variacao: -0.8,
    minimo: 9.00,
    maximo: 9.50,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🐷',
    cor: 'pink',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 9.35, variacao: 0.5 },
      { dia: 'Ter', data: '2025-01-09', preco: 9.40, variacao: 0.5 },
      { dia: 'Qua', data: '2025-01-10', preco: 9.28, variacao: -1.3 },
      { dia: 'Qui', data: '2025-01-11', preco: 9.32, variacao: 0.4 },
      { dia: 'Sex', data: '2025-01-12', preco: 9.27, variacao: -0.5 },
      { dia: 'Sáb', data: '2025-01-13', preco: 9.27, variacao: 0.0 },
      { dia: 'Hoje', data: '2025-01-15', preco: 9.20, variacao: -0.8 }
    ]
  },
  {
    id: 'cafe',
    nome: 'Café Arábica',
    unidade: 'saca 60kg',
    preco: 1284.00,
    variacao: 3.2,
    minimo: 1240.00,
    maximo: 1320.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '☕',
    cor: 'brown',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 1245.00, variacao: 0.8 },
      { dia: 'Ter', data: '2025-01-09', preco: 1252.50, variacao: 0.6 },
      { dia: 'Qua', data: '2025-01-10', preco: 1240.00, variacao: -1.0 },
      { dia: 'Qui', data: '2025-01-11', preco: 1258.00, variacao: 1.5 },
      { dia: 'Sex', data: '2025-01-12', preco: 1270.00, variacao: 1.0 },
      { dia: 'Sáb', data: '2025-01-13', preco: 1244.50, variacao: -2.0 },
      { dia: 'Hoje', data: '2025-01-15', preco: 1284.00, variacao: 3.2 }
    ]
  },
  {
    id: 'acucar',
    nome: 'Açúcar',
    unidade: 'saca 50kg',
    preco: 112.30,
    variacao: 1.1,
    minimo: 110.00,
    maximo: 115.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🍬',
    cor: 'white',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 111.20, variacao: 0.4 },
      { dia: 'Ter', data: '2025-01-09', preco: 111.80, variacao: 0.5 },
      { dia: 'Qua', data: '2025-01-10', preco: 110.90, variacao: -0.8 },
      { dia: 'Qui', data: '2025-01-11', preco: 111.50, variacao: 0.5 },
      { dia: 'Sex', data: '2025-01-12', preco: 112.00, variacao: 0.4 },
      { dia: 'Sáb', data: '2025-01-13', preco: 111.08, variacao: -0.8 },
      { dia: 'Hoje', data: '2025-01-15', preco: 112.30, variacao: 1.1 }
    ]
  },
  {
    id: 'trigo',
    nome: 'Trigo',
    unidade: 'saca 60kg',
    preco: 78.90,
    variacao: -2.1,
    minimo: 76.50,
    maximo: 82.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🌾',
    cor: 'amber',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 80.50, variacao: -0.6 },
      { dia: 'Ter', data: '2025-01-09', preco: 81.20, variacao: 0.9 },
      { dia: 'Qua', data: '2025-01-10', preco: 80.00, variacao: -1.5 },
      { dia: 'Qui', data: '2025-01-11', preco: 80.60, variacao: 0.8 },
      { dia: 'Sex', data: '2025-01-12', preco: 81.00, variacao: 0.5 },
      { dia: 'Sáb', data: '2025-01-13', preco: 80.60, variacao: -0.5 },
      { dia: 'Hoje', data: '2025-01-15', preco: 78.90, variacao: -2.1 }
    ]
  },
  {
    id: 'arroz',
    nome: 'Arroz',
    unidade: 'saca 50kg',
    preco: 95.40,
    variacao: 1.4,
    minimo: 92.80,
    maximo: 97.50,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🍚',
    cor: 'white',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 94.10, variacao: 0.3 },
      { dia: 'Ter', data: '2025-01-09', preco: 94.50, variacao: 0.4 },
      { dia: 'Qua', data: '2025-01-10', preco: 93.80, variacao: -0.7 },
      { dia: 'Qui', data: '2025-01-11', preco: 94.20, variacao: 0.4 },
      { dia: 'Sex', data: '2025-01-12', preco: 95.00, variacao: 0.8 },
      { dia: 'Sáb', data: '2025-01-13', preco: 94.08, variacao: -1.0 },
      { dia: 'Hoje', data: '2025-01-15', preco: 95.40, variacao: 1.4 }
    ]
  },
  {
    id: 'algodao',
    nome: 'Algodão',
    unidade: 'arroba',
    preco: 158.70,
    variacao: 2.8,
    minimo: 152.00,
    maximo: 162.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🌸',
    cor: 'white',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 154.30, variacao: 0.8 },
      { dia: 'Ter', data: '2025-01-09', preco: 155.80, variacao: 1.0 },
      { dia: 'Qua', data: '2025-01-10', preco: 153.90, variacao: -1.2 },
      { dia: 'Qui', data: '2025-01-11', preco: 156.20, variacao: 1.5 },
      { dia: 'Sex', data: '2025-01-12', preco: 157.40, variacao: 0.8 },
      { dia: 'Sáb', data: '2025-01-13', preco: 154.35, variacao: -1.9 },
      { dia: 'Hoje', data: '2025-01-15', preco: 158.70, variacao: 2.8 }
    ]
  },
  {
    id: 'cana-acucar',
    nome: 'Cana-de-açúcar',
    unidade: 'tonelada',
    preco: 142.50,
    variacao: 0.7,
    minimo: 138.00,
    maximo: 146.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🎋',
    cor: 'green',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 141.50, variacao: 0.4 },
      { dia: 'Ter', data: '2025-01-09', preco: 141.90, variacao: 0.3 },
      { dia: 'Qua', data: '2025-01-10', preco: 140.80, variacao: -0.8 },
      { dia: 'Qui', data: '2025-01-11', preco: 141.60, variacao: 0.6 },
      { dia: 'Sex', data: '2025-01-12', preco: 142.20, variacao: 0.4 },
      { dia: 'Sáb', data: '2025-01-13', preco: 141.50, variacao: -0.5 },
      { dia: 'Hoje', data: '2025-01-15', preco: 142.50, variacao: 0.7 }
    ]
  },
  {
    id: 'mandioca',
    nome: 'Mandioca',
    unidade: 'tonelada',
    preco: 420.00,
    variacao: -1.2,
    minimo: 405.00,
    maximo: 435.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🥔',
    cor: 'brown',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 425.00, variacao: 0.6 },
      { dia: 'Ter', data: '2025-01-09', preco: 427.50, variacao: 0.6 },
      { dia: 'Qua', data: '2025-01-10', preco: 423.00, variacao: -1.1 },
      { dia: 'Qui', data: '2025-01-11', preco: 426.00, variacao: 0.7 },
      { dia: 'Sex', data: '2025-01-12', preco: 425.00, variacao: -0.2 },
      { dia: 'Sáb', data: '2025-01-13', preco: 425.10, variacao: 0.0 },
      { dia: 'Hoje', data: '2025-01-15', preco: 420.00, variacao: -1.2 }
    ]
  },
  {
    id: 'leite',
    nome: 'Leite',
    unidade: 'litro',
    preco: 2.85,
    variacao: 1.6,
    minimo: 2.70,
    maximo: 2.95,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🥛',
    cor: 'white',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 2.80, variacao: 0.4 },
      { dia: 'Ter', data: '2025-01-09', preco: 2.82, variacao: 0.7 },
      { dia: 'Qua', data: '2025-01-10', preco: 2.78, variacao: -1.4 },
      { dia: 'Qui', data: '2025-01-11', preco: 2.81, variacao: 1.1 },
      { dia: 'Sex', data: '2025-01-12', preco: 2.83, variacao: 0.7 },
      { dia: 'Sáb', data: '2025-01-13', preco: 2.80, variacao: -1.1 },
      { dia: 'Hoje', data: '2025-01-15', preco: 2.85, variacao: 1.6 }
    ]
  },
  {
    id: 'ovos',
    nome: 'Ovos',
    unidade: 'caixa 30dz',
    preco: 189.50,
    variacao: 2.1,
    minimo: 182.00,
    maximo: 195.00,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🥚',
    cor: 'yellow',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 185.60, variacao: 0.5 },
      { dia: 'Ter', data: '2025-01-09', preco: 186.80, variacao: 0.6 },
      { dia: 'Qua', data: '2025-01-10', preco: 184.50, variacao: -1.2 },
      { dia: 'Qui', data: '2025-01-11', preco: 186.00, variacao: 0.8 },
      { dia: 'Sex', data: '2025-01-12', preco: 187.50, variacao: 0.8 },
      { dia: 'Sáb', data: '2025-01-13', preco: 185.60, variacao: -1.0 },
      { dia: 'Hoje', data: '2025-01-15', preco: 189.50, variacao: 2.1 }
    ]
  },
  {
    id: 'tilapia',
    nome: 'Tilápia',
    unidade: 'kg',
    preco: 12.80,
    variacao: 0.9,
    minimo: 12.30,
    maximo: 13.20,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🐟',
    cor: 'blue',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 12.65, variacao: 0.4 },
      { dia: 'Ter', data: '2025-01-09', preco: 12.70, variacao: 0.4 },
      { dia: 'Qua', data: '2025-01-10', preco: 12.55, variacao: -1.2 },
      { dia: 'Qui', data: '2025-01-11', preco: 12.68, variacao: 1.0 },
      { dia: 'Sex', data: '2025-01-12', preco: 12.75, variacao: 0.6 },
      { dia: 'Sáb', data: '2025-01-13', preco: 12.68, variacao: -0.5 },
      { dia: 'Hoje', data: '2025-01-15', preco: 12.80, variacao: 0.9 }
    ]
  },
  {
    id: 'ovinos',
    nome: 'Ovinos',
    unidade: 'kg vivo',
    preco: 9.85,
    variacao: 1.3,
    minimo: 9.50,
    maximo: 10.20,
    ultimaAtualizacao: '2025-01-15T14:30:00Z',
    icon: '🐑',
    cor: 'gray',
    historico7dias: [
      { dia: 'Seg', data: '2025-01-08', preco: 9.70, variacao: 0.5 },
      { dia: 'Ter', data: '2025-01-09', preco: 9.75, variacao: 0.5 },
      { dia: 'Qua', data: '2025-01-10', preco: 9.62, variacao: -1.3 },
      { dia: 'Qui', data: '2025-01-11', preco: 9.72, variacao: 1.0 },
      { dia: 'Sex', data: '2025-01-12', preco: 9.78, variacao: 0.6 },
      { dia: 'Sáb', data: '2025-01-13', preco: 9.72, variacao: -0.6 },
      { dia: 'Hoje', data: '2025-01-15', preco: 9.85, variacao: 1.3 }
    ]
  }
];
