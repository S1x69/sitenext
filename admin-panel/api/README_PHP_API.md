# API de Atualização de Notícias - PHP

## 📁 Arquivos Criados

```
admin-panel/
└── api/
    ├── update_news.php      # API principal
    ├── config.php           # Configurações
    └── logs/                # Pasta de logs (será criada automaticamente)
```

## 🚀 Como Usar

### 1. Configuração Inicial

**Ajuste o arquivo `config.php`:**
```php
'database' => [
    'host' => 'localhost',
    'name' => 'banco_novo2',  // Seu banco de dados
    'user' => 'root',
    'password' => '',         // Sua senha do MySQL
],
```

**Ajuste a URL da API no Next.js:**
No arquivo `admin-panel/app/api/news/update/route.js`, linha ~45:
```javascript
const phpApiUrl = 'http://localhost/projetos/siteNext/sitenext/admin-panel/api/update_news.php';
```
Altere conforme seu ambiente (XAMPP, WAMP, etc).

### 2. Estrutura do Banco de Dados

A API trabalha com as seguintes tabelas:

- **articles** - Dados principais da notícia
- **article_content** - Conteúdo estruturado em JSON
- **article_tags** - Tags da notícia
- **categories** - Categorias
- **authors** - Autores

### 3. Requisição

**Endpoint:** `POST /admin-panel/api/update_news.php`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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
  "image": "data:image/jpeg;base64,/9j/4AAQ..." ou "https://...",
  "tags": ["tag1", "tag2"],
  "content": [
    {
      "type": "paragraph",
      "text": "Conteúdo..."
    }
  ]
}
```

### 4. Resposta

**Sucesso (200):**
```json
{
  "success": true,
  "message": "Notícia atualizada com sucesso",
  "data": {
    "id": 2898,
    "title": "Título da Notícia",
    "image": "/upload/imagens-resizes/abc123.jpg",
    "updated_at": "2025-12-04 10:30:00"
  }
}
```

**Erro (400/500):**
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "details": "Detalhes adicionais"
}
```

## 🖼️ Tratamento de Imagens

### A API suporta 3 formatos de imagem:

#### 1. **Base64** (Nova imagem)
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```
- ✅ Decodifica e salva em `/upload/imagens-resizes/`
- ✅ Deleta imagem antiga automaticamente
- ✅ Gera nome único (MD5 hash)

#### 2. **URL Externa**
```json
{
  "image": "https://boca.com.br/upload/imagem.jpg"
}
```
- ✅ Mantém URL como está
- ✅ Não faz download/upload

#### 3. **Caminho Local**
```json
{
  "image": "/upload/imagens-resizes/abc123.jpg"
}
```
- ✅ Mantém caminho existente
- ✅ Se for igual ao anterior, não faz nada

### Lógica de Substituição:

```
Se nova_imagem == imagem_antiga:
  → Não faz nada
  
Se nova_imagem é Base64:
  → Salva nova imagem
  → Deleta imagem antiga (se local)
  → Retorna novo caminho
  
Se nova_imagem é URL externa:
  → Mantém URL
  → Não deleta antiga
```

## 📊 Logs

Todos os logs são salvos em:
```
admin-panel/api/update_news.log
```

**Exemplo de log:**
```
[2025-12-04 10:30:15] [INFO] === Início da atualização de notícia ===
[2025-12-04 10:30:15] [INFO] Notícia encontrada: Título Exemplo
[2025-12-04 10:30:15] [INFO] Nova imagem salva: abc123def456.jpg
[2025-12-04 10:30:15] [INFO] Imagem antiga deletada: /upload/old.jpg
[2025-12-04 10:30:15] [INFO] Artigo atualizado na tabela articles
[2025-12-04 10:30:15] [INFO] === Notícia atualizada com sucesso ===
```

## 🔒 Segurança

### Implementado:
- ✅ Validação de JSON
- ✅ Prepared Statements (previne SQL Injection)
- ✅ Validação de tipos de dados
- ✅ Transações do banco (rollback em erro)
- ✅ CORS configurável
- ✅ Logs de auditoria

### Recomendações Adicionais:
1. **Ativar autenticação por token** em `config.php`:
```php
'security' => [
    'api_token' => 'seu_token_secreto_aqui'
]
```

2. **Validar referer**:
```php
'security' => [
    'check_referer' => true,
    'allowed_origins' => ['http://localhost:3000']
]
```

3. **Limitar tamanho de upload**:
```php
'upload' => [
    'max_size' => 5 * 1024 * 1024 // 5MB
]
```

## 🧪 Testando

### Via cURL:
```bash
curl -X POST http://localhost/projetos/siteNext/sitenext/admin-panel/api/update_news.php \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2898,
    "title": "Teste",
    "subtitle": "Subtítulo teste",
    "content": [{"type":"paragraph","text":"Teste"}],
    "category": {"nome": "Agronegócio"}
  }'
```

### Via Painel Admin:
1. Abra o admin-panel: `http://localhost:3000`
2. Clique em "Buscar Notícia"
3. Busque por "arroz" ou "soja"
4. Clique em "Editar"
5. Faça alterações
6. Clique em "Salvar Notícia"

## ⚠️ Troubleshooting

### Erro: "Erro ao conectar ao banco de dados"
- Verifique as credenciais em `config.php`
- Certifique-se que o MySQL está rodando
- Verifique se o banco `banco_novo2` existe

### Erro: "Erro ao salvar imagem no servidor"
- Verifique permissões da pasta `/upload/imagens-resizes/`
- No Linux: `chmod 755 /caminho/para/upload/`
- Certifique-se que o Apache tem permissão de escrita

### Erro: "JSON inválido"
- Verifique se está enviando `Content-Type: application/json`
- Valide o JSON em https://jsonlint.com/

### Erro: "Notícia com ID X não encontrada"
- Verifique se o ID existe na tabela `articles`
- Rode: `SELECT * FROM articles WHERE id = X`

## 📝 Notas Importantes

1. **Título e Slug não são atualizados** - Por design, para manter integridade das URLs
2. **Categorias são criadas automaticamente** - Se não existir, será criada
3. **Autores são mantidos** - O autor original não é alterado
4. **Transações garantem integridade** - Se algo falhar, nada é salvo
5. **Logs são essenciais** - Sempre verifique em caso de erro

## 🔄 Fluxo Completo

```
Editor (Frontend)
    ↓
Next.js API Route (/api/news/update)
    ↓
PHP API (update_news.php)
    ↓
Validações
    ↓
Processar Imagem
    ├─ Base64 → Salvar + Deletar antiga
    ├─ URL → Manter
    └─ Local → Verificar
    ↓
Atualizar Banco de Dados
    ├─ articles
    ├─ article_content
    └─ article_tags
    ↓
Retornar Sucesso/Erro
    ↓
Toast no Frontend
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `admin-panel/api/update_news.log`
2. Ative modo debug no PHP: `error_reporting(E_ALL)`
3. Verifique console do navegador (F12)
4. Verifique logs do Apache/Nginx

---

**Versão:** 1.0.0  
**Data:** 04/12/2025  
**Autor:** GitHub Copilot
