import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Agora mesmo';
  if (diffInHours < 24) return `Há ${diffInHours}h`;
  if (diffInHours < 48) return 'Ontem';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function formatDateLong(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Função para converter conteúdo estruturado em texto simples
export function getContentAsText(content) {
  if (typeof content === 'string') {
    return content;
  }
  
  // Verificar se é o novo formato estruturado (array de blocos)
  if (Array.isArray(content)) {
    return content
      .filter(block => ['paragraph', 'subtitle', 'quote', 'info_box', 'highlight', 'list'].includes(block.type))
      .map(block => {
        if (block.type === 'list') {
          return block.items.join('. ');
        }
        return block.text || '';
      })
      .filter(Boolean)
      .join(' ');
  }
  
  // Formato antigo (objeto com introducao, desenvolvimento, conclusao)
  if (typeof content === 'object' && content !== null) {
    const parts = [
      content.introducao || '',
      Array.isArray(content.desenvolvimento) 
        ? content.desenvolvimento.join(' ') 
        : content.desenvolvimento || '',
      content.conclusao || ''
    ];
    return parts.filter(Boolean).join(' ');
  }
  
  return '';
}
