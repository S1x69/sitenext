'use client';


import { useState } from 'react';
import dynamic from 'next/dynamic';
const NewsEditor = dynamic(() => import('@/components/NewsEditor'), { ssr: false });
const LoginPage = dynamic(() => import('@/components/LoginPage'), { ssr: false });

export default function EditorPage() {
  const [logged, setLogged] = useState(false);
  if (!logged) {
    return <LoginPage onLogin={() => setLogged(true)} />;
  }
  return <NewsEditor />;
}
