import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full"></div>
            <FileQuestion className="w-32 h-32 text-blue-600 relative" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-3xl font-bold mb-4">
          Notícia não encontrada
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8">
          Desculpe, não encontramos a notícia que você está procurando. 
          Ela pode ter sido movida, excluída ou o link pode estar incorreto.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            Voltar para Home
          </Link>
          
          <Link
            href="/busca"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-semibold"
          >
            <Search className="w-5 h-5" />
            Fazer uma Busca
          </Link>
        </div>

        <div className="mt-12 p-6 bg-secondary/50 rounded-xl">
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Sugestões:</strong>
          </p>
          <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
            <li>• Verifique se o endereço foi digitado corretamente</li>
            <li>• Tente buscar pela notícia usando nossa ferramenta de busca</li>
            <li>• Navegue pelas categorias para encontrar conteúdo relacionado</li>
            <li>• Visite nossa página inicial para ver as últimas notícias</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
