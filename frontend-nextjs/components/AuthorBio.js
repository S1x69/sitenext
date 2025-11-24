'use client';

import { User, Twitter, Linkedin, Mail } from 'lucide-react';

export default function AuthorBio({ author, category }) {
  return (
    <div className="my-12 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{author}</h3>
          <p className="text-muted-foreground mb-4">
            Jornalista especializado em {category} com mais de 10 anos de experiência. Apaixonado por contar histórias que fazem a diferença.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-blue-500" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-blue-700" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
