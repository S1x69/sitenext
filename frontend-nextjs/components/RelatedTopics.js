'use client';

import Link from 'next/link';
import { Tag } from 'lucide-react';

const defaultTopics = [
  { name: 'Tecnologia', slug: 'tecnologia', color: 'blue' },
  { name: 'Inovação', slug: 'inovacao', color: 'purple' },
  { name: 'IA', slug: 'ia', color: 'pink' },
  { name: 'Startups', slug: 'startups', color: 'green' },
  { name: 'Investimento', slug: 'investimento', color: 'orange' },
];

const colors = ['blue', 'purple', 'pink', 'green', 'orange', 'indigo', 'teal', 'rose'];

// Função para processar tags em diferentes formatos
function parseTags(tags) {

  if (!tags) return [];
  
  // Se for objeto JSON (formato: {"0": "agricultura", "1": "noticias"})
  if (typeof tags === 'object' && !Array.isArray(tags)) {
    return Object.values(tags).map((name, index) => ({
      name: String(name),
      slug: String(name).toLowerCase().replace(/\s+/g, '-'),
      color: colors[index % colors.length]
    }));
  }
  
  // Se for array
  if (Array.isArray(tags)) {
    return tags.map((name, index) => ({
      name: String(name),
      slug: String(name).toLowerCase().replace(/\s+/g, '-'),
      color: colors[index % colors.length]
    }));
  }
  
  // Se for string no formato [tag1][tag2][tag3]
  if (typeof tags === 'string') {
    const matches = tags.match(/\[([^\]]+)\]/g);
    if (matches) {
      return matches.map((match, index) => {
        const name = match.replace(/[\[\]]/g, '').trim();
        return {
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          color: colors[index % colors.length]
        };
      });
    }
  }
  
  return [];
}

export default function RelatedTopics({ tags }) {
  // Se tags forem fornecidas, processar; senão usar tópicos padrão
  const topics = tags ? parseTags(tags) : defaultTopics;
  
  if (topics.length === 0) return null;

  return (
    <div id="related-topics" className="my-12 p-6 bg-card border rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Tópicos Relacionados</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/busca?q=${topic.slug}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 ${
              topic.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900' :
              topic.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900' :
              topic.color === 'pink' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900' :
              topic.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900' :
              topic.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900' :
              topic.color === 'indigo' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900' :
              topic.color === 'teal' ? 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900' :
              'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900'
            }`}
          >
            #{topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
