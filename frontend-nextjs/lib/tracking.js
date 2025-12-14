// Função para obter IP do usuário
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return null;
  }
}

// Função para registrar visualização
export async function trackPageView(title) {
  try {
    const ip = await getUserIP();
    
    if (!ip || !title) {
      return;
    }

    const url = `https://base.boca.com.br/base/data/ipsalve.php?ip=${encodeURIComponent(ip)}&title=${encodeURIComponent(title)}`;
    
    // Enviar de forma não-bloqueante
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      fetch(url, { method: 'GET', mode: 'no-cors' }).catch(() => {});
    }
  } catch (error) {
    // Silenciosamente falhar para não afetar a experiência do usuário
  }
}

// Função para rastrear visualização de notícia
export function trackNewsView(newsTitle) {
  if (typeof window !== 'undefined') {
    trackPageView(newsTitle);
  }
}

// Função para rastrear visualização de categoria
export function trackCategoryView(categoryName) {
  if (typeof window !== 'undefined') {
    trackPageView(`Categoria: ${categoryName}`);
  }
}

// Função para rastrear busca
export function trackSearch(searchQuery) {
  if (typeof window !== 'undefined') {
    trackPageView(`Busca: ${searchQuery}`);
  }
}

// Função para rastrear página inicial
export function trackHomeView() {
  if (typeof window !== 'undefined') {
    trackPageView('Página Inicial - BocaNoticias');
  }
}
