import Link from 'next/link';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NewsCard({ news }) {
  // Gerar URL no formato: /2025/11/19/feijao/slug.html
  const date = new Date(news.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  // categoria pode vir como string ou objeto { nome }
  const rawCategory = typeof news.category === 'string' ? news.category : (news.category?.nome || 'noticias');
  const categorySlug = rawCategory.toString().toLowerCase().replace(/\s+/g, '-');
  const slug = news.slug || news.id;
  const newsUrl = news.url || `/${year}/${month}/${day}/${categorySlug}/${slug}.html`;
  return (
    <Link href={newsUrl} className="news-card group block">
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
            {news.category}
          </span>
        </div>
        {/* Badge com primeira tag (mais discreta) */}
        {news.tag && Array.isArray(news.tag) && news.tag.length > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-medium rounded shadow-sm">
              #{news.tag[0]}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {news.subtitle}
        </p>
        {/* Tags discretas */}
        {news.tag && Array.isArray(news.tag) && news.tag.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {news.tag.slice(0, 4).map((t) => (
              <span key={t} className="inline-block text-[10px] bg-gray-100/60 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(news.date)}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {news.author}
          </span>
        </div>
      </div>
    </Link>
  );
}
