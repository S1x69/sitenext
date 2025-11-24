import Link from 'next/link';
import Image from 'next/image';
import { Clock, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NewsCard({ news }) {
  return (
    <Link href={`/noticia/${news.id}`} className="news-card group block">
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
        {news.tag && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-lg">
              {news.tag}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {news.subtitle}
        </p>
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
