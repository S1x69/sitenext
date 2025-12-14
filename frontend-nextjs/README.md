# 📰 BocaNoticias - Next.js (Com SEO Otimizado)

Portal de notícias moderno construído com Next.js 14, otimizado para motores de busca (SEO).

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- Backend rodando na porta 8001

### Instalação

```bash
# Entre na pasta do projeto Next.js
cd frontend-nextjs

# Instale as dependências
yarn install

# Inicie o servidor de desenvolvimento
yarn dev
```

O projeto estará disponível em: http://localhost:3000

### Build para Produção

```bash
# Criar build otimizado
yarn build

# Iniciar servidor de produção
yarn start
```

## 🎯 Otimizações de SEO Implementadas

### 1. Metadata API (Next.js 14)
✅ Meta tags dinâmicas por página
✅ Open Graph tags para redes sociais
✅ Twitter Cards
✅ Canonical URLs
✅ Keywords relevantes

### 2. Geração Estática (SSG)
✅ Todas as páginas de notícias são pré-renderizadas
✅ Todas as categorias são estáticas
✅ Carregamento instantâneo
✅ Melhor indexação pelos motores de busca

### 3. Sitemap.xml Dinâmico
✅ Gerado automaticamente
✅ Inclui todas as páginas
✅ Atualizado dinamicamente
✅ Acessível em: `/sitemap.xml`

### 4. Robots.txt
✅ Configurado para permitir crawlers
✅ Aponta para o sitemap
✅ Acessível em: `/robots.txt`

### 5. JSON-LD Schema
✅ Schema.org NewsArticle para artigos
✅ Schema.org NewsMediaOrganization
✅ Dados estruturados para melhor indexação

### 6. Otimização de Imagens
✅ Next.js Image com lazy loading automático
✅ Formatos otimizados (WebP)
✅ Tamanhos responsivos
✅ Priority loading para imagens above-the-fold

### 7. Performance
✅ Server Components por padrão
✅ Code splitting automático
✅ Prefetching de links
✅ Streaming SSR

## 📊 Comparação React vs Next.js

| Recurso | React (CRA) | Next.js 14 |
|---------|-------------|------------|
| **Renderização** | Client-side | Server + Client |
| **SEO** | Limitado (CSR) | Excelente (SSR/SSG) |
| **Meta Tags** | Via React Helmet | Metadata API nativa |
| **Sitemap** | Manual | Automático |
| **Robots.txt** | Estático | Dinâmico |
| **Images** | `<img>` tag | Next/Image otimizado |
| **Routing** | React Router | File-based routing |
| **Performance** | Boa | Excelente |
| **Bundle Size** | Maior | Menor (code splitting) |
| **Time to Interactive** | ~2-3s | ~0.5-1s |
| **Google Lighthouse** | 70-80 | 95-100 |

## 🔍 Recursos de SEO por Página

### Página Inicial (/)
- Title: "Início - Últimas Notícias | BocaNoticias"
- Description otimizada
- Schema: NewsMediaOrganization
- Open Graph completo

### Página de Notícia (/noticia/[id])
- Title dinâmico com título da notícia
- Description com subtítulo
- Schema: NewsArticle
- Author information
- Published/Modified dates
- Canonical URL

### Página de Categoria (/categoria/[slug])
- Title: "[Categoria] - Notícias"
- Description contextual
- Canonical URL

### Página de Busca (/busca)
- Title: "Buscar Notícias"
- No-index para queries (opcional)

## 📁 Estrutura do Projeto Next.js

```
frontend-nextjs/
├── app/
│   ├── layout.js              # Root layout com metadata
│   ├── page.js                # Home page (SSG)
│   ├── globals.css            # Estilos globais
│   ├── sitemap.js             # Sitemap dinâmico
│   ├── robots.js              # Robots.txt
│   ├── noticia/
│   │   └── [id]/
│   │       └── page.js        # Página de notícia (SSG)
│   ├── categoria/
│   │   └── [slug]/
│   │       └── page.js        # Página de categoria (SSG)
│   └── busca/
│       └── page.js            # Página de busca (CSR)
├── components/
│   ├── Header.js              # Client component
│   ├── Footer.js              # Client component
│   ├── NewsCard.js            # Server component
│   ├── NewsCarousel.js        # Client component
│   ├── ShareButton.js         # Client component
│   ├── ReadAloudButton.js     # Client component
│   └── FontControls.js        # Client component
├── lib/
│   ├── mock.js                # Dados mock
│   └── utils.js               # Utilitários
├── public/                    # Arquivos estáticos
├── next.config.js             # Configuração Next.js
├── tailwind.config.js         # Configuração Tailwind
└── package.json               # Dependências
```

## 🎨 Funcionalidades Mantidas

✅ Todas as funcionalidades do React foram mantidas
✅ Modo escuro/claro
✅ Carrossel de notícias
✅ Sistema de busca
✅ Text-to-Speech
✅ Compartilhamento
✅ Design responsivo
✅ Animações

## 🔧 Variáveis de Ambiente

Arquivo `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=BocaNoticias
```

## 📈 Benefícios do Next.js para SEO

1. **Indexação mais rápida**: Conteúdo pré-renderizado
2. **Melhor ranking**: Performance superior
3. **Rich snippets**: Dados estruturados
4. **Social sharing**: Open Graph otimizado
5. **Mobile-first**: Performance em dispositivos móveis
6. **Core Web Vitals**: Métricas excelentes

## 🧪 Testar SEO

### Google Search Console
```bash
# Verificar sitemap
https://localhost:3000/sitemap.xml

# Verificar robots
https://localhost:3000/robots.txt
```

### Lighthouse (DevTools)
- Abra DevTools (F12)
- Vá em "Lighthouse"
- Execute audit de SEO
- Score esperado: 95-100

### Meta Tags
- Use extensão "SEO Meta in 1 Click"
- Verifique Open Graph tags
- Teste compartilhamento no Facebook/Twitter

## 🚀 Deploy Recomendado

### Vercel (Recomendado)
```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
yarn build

# Publish directory
.next
```

## 📝 Próximos Passos

- [ ] Conectar com backend real
- [ ] Implementar ISR (Incremental Static Regeneration)
- [ ] Adicionar Analytics
- [ ] Configurar sitemap com mais dados
- [ ] Implementar AMP pages
- [ ] Adicionar Breadcrumbs schema

## 🔗 Links Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js SEO](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)

---

**Desenvolvido com Next.js 14 + React 18 + Tailwind CSS**
