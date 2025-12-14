import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const updatedNews = await request.json();
    
    console.log('Recebendo atualização da notícia:', {
      id: updatedNews.id,
      title: updatedNews.title,
      contentBlocks: updatedNews.content?.length
    });

    // Validações básicas
    if (!updatedNews.id) {
      return NextResponse.json(
        { error: 'ID da notícia é obrigatório' },
        { status: 400 }
      );
    }

    if (!updatedNews.title || !updatedNews.title.trim()) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    if (!updatedNews.content || !Array.isArray(updatedNews.content) || updatedNews.content.length === 0) {
      return NextResponse.json(
        { error: 'Conteúdo deve ter pelo menos um bloco' },
        { status: 400 }
      );
    }

    // Enviar para a API PHP
    // IMPORTANTE: Ajuste a URL conforme seu ambiente
    const phpApiUrl = 'https://boca.com.br/api/news/update/update_news.php';
    
    console.log('Enviando para API PHP:', phpApiUrl);
    
    const response = await fetch(phpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNews)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API PHP:', errorText);
      throw new Error('Erro ao atualizar na API PHP: ' + response.status);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Erro desconhecido ao atualizar notícia');
    }

    console.log('Notícia salva com sucesso:', result);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar atualização:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao salvar notícia',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
