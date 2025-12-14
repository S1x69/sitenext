# API de Atualização de Notícias

## 📁 Localização
`admin-panel/app/api/news/update/route.js`

## 🎯 Funcionalidade
Esta API recebe as notícias editadas no painel administrativo e as envia para o backend da Boca News para atualização.

## 📤 Requisição

### Endpoint
```
POST /api/news/update
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "id": 2898,
  "type": "noticia",
  "niches": "agro",
  "title": "Título da Notícia",
  "subtitle": "Subtítulo da notícia",
  "slug": "titulo-da-noticia",
  "category": {
    "nome": "Agronegócio",
    "slug": "agronegocio"
  },
  "date": "2025-12-04",
  "image": "https://...",
  "tags": ["tag1", "tag2"],
  "content": [
    {
      "type": "paragraph",
      "text": "Conteúdo..."
    }
  ]
}
```

## 📥 Resposta

### Sucesso (200)
```json
{
  "success": true,
  "message": "Notícia atualizada com sucesso",
  "data": {
    "id": 2898,
    "title": "Título da Notícia",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  }
}
```

### Erro (400/500)
```json
{
  "error": "Mensagem de erro",
  "details": "Detalhes do erro"
}
```

## ⚙️ Configuração

### 1. Conectar com sua API Real

No arquivo `route.js`, localize este trecho:

```javascript
// AQUI: Envie para sua API real da Boca News
// Exemplo de como fazer a requisição para a API externa:
/*
const response = await fetch('https://boca.com.br/api/app/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Adicione headers de autenticação se necessário
    // 'Authorization': 'Bearer YOUR_TOKEN',
  },
  body: JSON.stringify(updatedNews)
});
```

Descomente e ajuste para sua API real da Boca News.

### 2. Adicionar Autenticação (se necessário)

Se sua API requer autenticação:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer SEU_TOKEN_AQUI',
  // ou
  'X-API-Key': 'SUA_CHAVE_API'
}
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do `admin-panel`:

```env
BOCA_API_URL=https://boca.com.br/api/app
BOCA_API_TOKEN=seu_token_aqui
```

E use no código:

```javascript
const response = await fetch(`${process.env.BOCA_API_URL}/update`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BOCA_API_TOKEN}`,
  },
  body: JSON.stringify(updatedNews)
});
```

## 🔄 Fluxo Completo

1. **Editor** → Usuário edita a notícia no painel
2. **Clica em "Salvar Notícia"** → Botão verde no header
3. **Frontend valida** → Verifica título, conteúdo, etc.
4. **Envia para API local** → `POST /api/news/update`
5. **API local processa** → Valida e formata os dados
6. **API local envia para Boca** → Atualiza no backend real
7. **Retorna resposta** → Mostra toast de sucesso/erro

## 🧪 Testando

### Teste Manual no Console do Navegador

```javascript
fetch('http://localhost:3000/api/news/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 123,
    title: "Teste",
    content: [{ type: "paragraph", text: "Teste" }],
    category: { nome: "Teste", slug: "teste" },
    date: "2025-12-04"
  })
})
.then(r => r.json())
.then(console.log);
```

## 📝 Logs

A API registra logs no console:
- Dados recebidos
- Validações
- Resposta da API externa
- Erros

Verifique o terminal onde o Next.js está rodando.

## ⚠️ Validações Implementadas

- ✅ ID da notícia obrigatório
- ✅ Título não pode estar vazio
- ✅ Conteúdo deve ter pelo menos 1 bloco
- ✅ Estrutura de dados válida

## 🚀 Próximos Passos

1. Configure a URL da sua API real
2. Adicione autenticação se necessário
3. Teste com dados reais
4. Implemente tratamento de erros específicos
5. Adicione logs mais detalhados
