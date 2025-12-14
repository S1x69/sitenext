import './globals.css'

export const metadata = {
  title: 'Admin Panel - Editor de Notícias',
  description: 'Painel administrativo para criação e edição de notícias',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
