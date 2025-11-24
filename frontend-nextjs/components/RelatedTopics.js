'use client';

import Link from 'next/link';
import { Tag } from 'lucide-react';

const topics = [
  { name: 'Tecnologia', slug: 'tecnologia', color: 'blue' },
  { name: 'Inovação', slug: 'inovacao', color: 'purple' },
  { name: 'IA', slug: 'ia', color: 'pink' },
  { name: 'Startups', slug: 'startups', color: 'green' },
  { name: 'Investimento', slug: 'investimento', color: 'orange' },
];

export default function RelatedTopics() {
  return (
    <div className="my-12 p-6 bg-card border rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold">Tópicos Relacionados</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/busca?q=${topic.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
              topic.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900' :
              topic.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900' :
              topic.color === 'pink' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900' :
              topic.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900' :
              'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900'
            }`}
          >
            #{topic.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
