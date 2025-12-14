import Link from 'next/link';
import { Home, Search, TrendingUp, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background px-4">
      <div className="max-w-2xl w-full text-center animate-in fade-in slide-in-from-bottom duration-700">
        {/* Número 404 Estilizado */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 md:w-28 md:h-28 text-blue-600/20 animate-pulse" />
          </div>
        </div>

        {/* Mensagem */}
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Oops! Página não encontrada
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Link>
          <Link
            href="/busca"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border-2 rounded-xl hover:bg-secondary transition-all font-semibold hover:scale-105"
          >
            <Search className="w-5 h-5" />
            Buscar Notícias
          </Link>
        </div>

        {/* Links Rápidos */}
        <div className="bg-card border rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg">Navegue por Categorias</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/categoria/agronegocio"
              className="px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white rounded-lg transition-all text-sm font-medium"
            >
              Agronegócio
            </Link>
            <Link
              href="/categoria/esportes"
              className="px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white rounded-lg transition-all text-sm font-medium"
            >
              Esportes
            </Link>
            <Link
              href="/categoria/tecnologia"
              className="px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white rounded-lg transition-all text-sm font-medium"
            >
              Tecnologia
            </Link>
            <Link
              href="/categoria/cotacoes"
              className="px-4 py-2 bg-secondary hover:bg-blue-600 hover:text-white rounded-lg transition-all text-sm font-medium"
            >
              Cotações
            </Link>
          </div>
        </div>

        {/* Mensagem Extra */}
        <p className="mt-8 text-sm text-muted-foreground">
          Se você acredita que isso é um erro, por favor entre em contato conosco.
        </p>
      </div>
    </div>
  );
}
