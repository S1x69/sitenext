// API endpoint para contar total de notícias
const BOCA_NEWS_COUNT_API_URL = 'https://api.boca.com.br/api/news/count/';

export async function fetchNewsCount() {
  try {
    const response = await fetch(BOCA_NEWS_COUNT_API_URL, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.total || 0;
  } catch (error) {
    console.error('Erro ao buscar contagem de notícias:', error);
    return 0;
  }
}
