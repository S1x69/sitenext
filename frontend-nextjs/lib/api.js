
const BOCA_NEWS_API_URL = 'https://api.boca.com.br/api/app/';
const BOCA_NEWS_DETAIL_API_URL = 'https://api.boca.com.br/api/app/detail/';
const BOCA_NEWS_SEARCH_API_URL = 'https://api.boca.com.br/api/app/chave/';

// Buscar total de notícias de uma categoria
export async function fetchNewsTotalCount(category = null) {
  try {
    // A API da Boca retorna um campo 'total' quando passamos um limite muito alto
    const response = await fetch(BOCA_NEWS_API_URL + `?limit=9999` + (category ? `&category=${category}` : ''), {
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    // Se a API retornar um array, contar o tamanho
    if (Array.isArray(data)) {
      return data.length;
    }
    // Se retornar um objeto com total, usar esse valor
    return data.total || 0;
  } catch (error) {
    console.error('Erro ao buscar total de notícias:', error);
    return 0;
  }
}

export async function fetchNewsDetail(data, slug) {
  try {

    const url = `${BOCA_NEWS_DETAIL_API_URL}?data=${data}&news_detail=${slug}`;

    const response = await fetch(url, {
      method: "GET",
      // reduzir revalidação para tornar conteúdo mais atual
      next: { revalidate: 10 } // revalidate every 10 seconds
    });

    if (!response.ok) {
       return null;
    }

    const article = await response.json();
    
    // Validações mais rigorosas
    if (!article || 
        (Array.isArray(article) && article.length === 0) || 
        Object.keys(article).length === 0 ||
        !article.id || 
        !article.title ||
        !article.content) {
      return null;
    }

    // Verificar se o conteúdo já está no formato estruturado (com types)
    const hasStructuredContent = Array.isArray(article.content) && 
                                  article.content.some(block => block.type);

    let finalContent;
    
    if (hasStructuredContent) {
      // Conteúdo já está estruturado, usar diretamente
      finalContent = article.content;
    } else {
      // Conteúdo antigo, converter para formato estruturado
      const paragraphs = article.content
        .filter(block => block.type === 'paragraph')
        .map(block => block.text);

      finalContent = {
        introducao: paragraphs[0] || '',
        blockquote: paragraphs[1]?.substring(0, 200) || 'Notícia importante do agronegócio brasileiro.',
        desenvolvimento: paragraphs.slice(1, -1).length > 0 ? paragraphs.slice(1, -1) : [paragraphs[1] || ''],
        conclusao: paragraphs[paragraphs.length - 1] || '',
        pontosChave: [
          'Informações relevantes do mercado agropecuário',
          'Análise de especialistas do setor',
          'Impactos para produtores e consumidores'
        ]
      };
    }

    return {
      id: article.id,
      type: article.type,
      title: article.title,
      subtitle: article.subtitle || '',
      category: article.category,
      image: article.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
      content: finalContent,
      author: article.author || 'Redação Boca News',
      date: article.date,
      last_modified: article.last_modified,
      featured: article.featured || false,
      tags: article.tags || null,
      url: article.url ? (article.url.endsWith('.html') ? article.url : `${article.url}`) : null,
      slug: slug || article.id,
      LeiaTambem: article.LeiaTambem || [],
      MaisdeCategory: article.MaisdeCategory || [],
      NoticiasRelacionadas: article.NoticiasRelacionadas || [],
    };

  } catch (error) {
    console.error('Erro ao buscar notícias da Boca:', error);
    return null;
  }
}

export async function searchNewsFromBoca(keyword) {
  try {
    const response = await fetch(`${BOCA_NEWS_SEARCH_API_URL}?chave=${encodeURIComponent(keyword)}`, {
      method: "GET",
      next: { revalidate: 10 } // revalidate every 10 seconds
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar notícias da Boca');
    }

    const data = await response.json();
    
    // Converter formato da API Boca para o formato do sistema
    const news = data.map((article) => {
      // Extrair parágrafos do conteúdo
      
      return article;
    });

    return news;
  } catch (error) {
    console.error('Erro ao buscar notícias da Boca:', error);
    return [];
  }
}

export async function fetchNewsFromBoca(limit = 20, category = null, offset = 0) {
  try {
    // Sempre incluir offset na URL, mesmo que seja 0
    const url = `${BOCA_NEWS_API_URL}?limit=${limit}${category ? `&category=${category}` : ''}&offset=${offset}`;
    console.log('Fetching from Boca API:', url);
    
    const response = await fetch(url, {
      // manter a listagem atualizada com revalidação curta
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar notícias da Boca');
    }

    const data = await response.json();
    console.log(`Received ${data.length} news items with offset ${offset}`);
    
    // Converter formato da API Boca para o formato do sistema
    const news = data.slice(0, limit).map((article) => {
      // Extrair parágrafos do conteúdo
      const paragraphs = article.content.filter(block => block.type === 'paragraph').map(block => block.text);

      // Estruturar o conteúdo em seções
      const structuredContent = {
        introducao: paragraphs[0] || '',
        blockquote: paragraphs[1]?.substring(0, 200) || 'Notícia importante do agronegócio brasileiro.',
        desenvolvimento: paragraphs.slice(1, -1).length > 0 ? paragraphs.slice(1, -1) : [paragraphs[1] || ''],
        conclusao: paragraphs[paragraphs.length - 1] || '',
        pontosChave: [
          'Informações relevantes do mercado agropecuário',
          'Análise de especialistas do setor',
          'Impactos para produtores e consumidores'
        ]
      };

      // Extrair slug da URL se não tiver
      let slug = article.slug;
      if (!slug && article.url) {
        // Pegar última parte da URL sem .html
        slug = article.url.split('/').pop().replace('.html', '');
      }

      return {
        id: article.id,
        title: article.title,
        subtitle: article.subtitle || '',
        category: article.category,
        image: article.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449',
        content: structuredContent,
        author: article.author || 'Redação Boca News',
        date: article.date,
        LastModified: article.LastModified,
        featured: article.featured || false,
        tags: article.tags || null,
        url: article.url  ? article.url : null,
        slug: slug || article.id
      };
    });

    return news;
  } catch (error) {
    console.error('Erro ao buscar notícias da Boca:', error);
    return [];
  }
}

// Mapear categorias da Boca para categorias do sistema
function mapBocaCategory(category) {
  const categoryMap = {
    'soja': 'Agronegócio',
    'milho': 'Agronegócio',
    'trigo': 'Agronegócio',
    'cafe': 'Agronegócio',
    'pecuaria': 'Agronegócio',
    'economia': 'Economia',
    'mercado': 'Mercado',
    'tecnologia': 'Tecnologia',
    'clima': 'Clima',
    'politica': 'Política'
  };
  
  return categoryMap[category.nome?.toLowerCase()] || category.nome;
}

// ============================================
// FUNÇÃO PRINCIPAL - Buscar todas as notícias
// ============================================
export async function fetchAllNews(limit = 20, category = null, offset = 0) {
  try {
    // Garantir que offset seja sempre um número
    const validOffset = parseInt(offset) || 0;
    console.log(`fetchAllNews: limit=${limit}, category=${category}, offset=${validOffset}`);
    
    const bocaNews = await fetchNewsFromBoca(limit, category, validOffset);

    if (Array.isArray(bocaNews) && bocaNews.length > 0) {
      return bocaNews;
    }

    return [];

  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return [];
  }
}
