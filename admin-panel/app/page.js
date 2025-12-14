'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  // Redireciona automaticamente para o editor
  if (typeof window !== 'undefined') {
    router.push('/editor');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
        <p className="text-gray-600 mb-6">Redirecionando para o editor...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
}
