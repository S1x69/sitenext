# Admin Panel - Editor de Notícias

Painel administrativo separado para criação e edição de notícias e artigos.

## 🚀 Como usar

### Instalar dependências
```bash
npm install
```

### Executar em modo desenvolvimento (porta 3001)
```bash
npm run dev
```

### Build para produção
```bash
npm run build
npm start
```

## 📦 Estrutura

- `/app` - Páginas Next.js
- `/components` - Componentes React (NewsEditor, StructuredContent)
- `NewsEditor.js` - Editor completo de notícias com:
  - Seletor de tipo (Notícia/Artigo)
  - Seletor de nicho (Agro/Geral)
  - Editor de metadados (título, subtítulo, categoria, tags)
  - Upload de imagem ou URL
  - 7 tipos de blocos de conteúdo
  - Preview em tempo real
  - Export/Import JSON

## 🌐 Portas

- **Admin Panel**: http://localhost:3001
- **Site Principal**: http://localhost:3000

## 🎨 Recursos

- ✅ Editor visual de conteúdo estruturado
- ✅ Suporte para upload de imagens
- ✅ Geração automática de slug
- ✅ Editor de tags com badges
- ✅ Preview em tempo real
- ✅ Export/Import JSON completo
- ✅ Dark mode
