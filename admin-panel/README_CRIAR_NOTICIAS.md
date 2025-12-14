# Editor de Notícias - Sistema de Criação e Atualização

## 📝 Funcionalidades

O painel administrativo agora suporta:

1. **Criar novas notícias** do zero
2. **Buscar e editar** notícias existentes
3. **Salvar alterações** em notícias existentes

## 🎯 Como Usar

### Criar Nova Notícia

1. Clique no botão **"Nova Notícia"** (roxo) no topo
2. Preencha os campos:
   - Título da notícia
   - Subtítulo (opcional)
   - Categoria
   - Data de publicação
   - Tags
   - Imagem (arraste ou cole)
3. Adicione blocos de conteúdo:
   - Parágrafos de texto
   - Imagens
   - Citações
   - Vídeos
4. Clique em **"Salvar Nova"** para criar

### Editar Notícia Existente

1. Clique em **"Buscar"**
2. Digite título ou palavras-chave
3. Selecione a notícia da lista
4. Edite os campos necessários
5. Clique em **"Atualizar"** para salvar

## 🔧 Endpoints da API

### Criar Nova Notícia
```
POST https://api.boca.com.br/api/news/create/
Content-Type: application/json
```

**Payload:**
```json
{
  "title": "Título da Notícia",
  "subtitle": "Subtítulo opcional",
  "category": {
    "nome": "Agronegócio",
    "slug": "agro"
  },
  "date": "2024-12-06",
  "author": "Admin",
  "status": "published",
  "type": "noticia",
  "niches": "agro",
  "image": "data:image/jpeg;base64,..." ou "https://url.com/imagem.jpg",
  "tags": ["agricultura", "economia"],
  "content": [
    {
      "type": "paragraph",
      "content": "<p>Texto do parágrafo</p>"
    }
  ]
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "Notícia criada com sucesso",
  "id": 12345,
  "slug": "titulo-da-noticia",
  "data": {
    "id": 12345,
    "title": "Título da Notícia",
    "slug": "titulo-da-noticia",
    "category": {
      "nome": "Agronegócio",
      "slug": "agro"
    },
    "image": "/upload/imagens-resizes/img_xxx.jpg",
    "date": "2024-12-06",
    "author": "Admin",
    "status": "published"
  }
}
```

### Atualizar Notícia Existente
```
POST https://api.boca.com.br/api/news/update/
Content-Type: application/json
```

**Payload:** (igual ao create, mas com campo `id`)
```json
{
  "id": 12345,
  "title": "Título Atualizado",
  ...
}
```

## 🗂️ Estrutura do Banco de Dados

A tabela `noticias` deve ter os seguintes campos:

```sql
CREATE TABLE noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  category_slug VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  summary TEXT,
  content LONGTEXT NOT NULL,
  tags JSON,
  author VARCHAR(100) DEFAULT 'Admin',
  published_date DATE,
  status ENUM('draft', 'published', 'archived') DEFAULT 'published',
  content_type VARCHAR(50) DEFAULT 'noticia',
  niche VARCHAR(50) DEFAULT 'agro',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_category (category_slug),
  INDEX idx_date (published_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 📋 Validações

### Campos Obrigatórios
- ✅ Título (não pode estar vazio)
- ✅ Categoria (deve ser selecionada)
- ✅ Conteúdo (pelo menos 1 bloco)

### Campos Opcionais
- Subtítulo
- Imagem (mas recomendado para SEO)
- Tags
- Autor (padrão: "Admin")
- Data (padrão: data atual)

## 🖼️ Upload de Imagens

### Formatos Suportados
- JPEG/JPG
- PNG
- GIF
- WebP

### Métodos de Upload

1. **Base64** (para imagens coladas ou arrastadas)
   - Automaticamente convertido e salvo no servidor
   - Retorna URL relativa: `/upload/imagens-resizes/img_xxx.jpg`

2. **URL Externa** (para imagens já hospedadas)
   - Mantém a URL original
   - Exemplo: `https://exemplo.com/imagem.jpg`

## 🎨 Estados dos Botões

| Botão | Cor | Ação | Quando Aparece |
|-------|-----|------|----------------|
| **Nova Notícia** | Roxo | Limpa formulário para nova notícia | Sempre |
| **Buscar** | Azul | Abre modal de busca | Sempre |
| **Salvar Nova** | Verde | Cria nova notícia no banco | Quando `newsId` é null |
| **Atualizar** | Verde | Atualiza notícia existente | Quando `newsId` existe |

## 🔄 Fluxo de Trabalho

### Criar Nova
```
Clique "Nova Notícia" → Preencha campos → Adicione conteúdo → "Salvar Nova"
                                                                      ↓
                                                          POST /api/news/create/
                                                                      ↓
                                                          Retorna ID da notícia
                                                                      ↓
                                                          newsId é atualizado
                                                                      ↓
                                                    Próximo save usa /update/
```

### Editar Existente
```
Clique "Buscar" → Selecione notícia → Edite campos → "Atualizar"
                                                           ↓
                                               POST /api/news/update/
                                                           ↓
                                               Notícia atualizada
```

## 📁 Arquivos Modificados

### Frontend
- `admin-panel/components/NewsEditor.js`
  - Adicionada função `createNewArticle()`
  - Modificada função `saveNews()` para detectar create/update
  - Adicionado botão "Nova Notícia"
  - Texto dinâmico no botão salvar

### Backend (Novo)
- `admin-panel/api/create_news.php`
  - Endpoint para criar notícias
  - Gera slug único automaticamente
  - Processa upload de imagens Base64
  - Valida campos obrigatórios
  - Retorna ID e dados da notícia criada

## 🚀 Deploy

### Requisitos
- PHP 7.4+
- MySQL 5.7+ ou MariaDB 10.3+
- Extensões PHP: PDO, JSON, GD (para imagens)

### Configuração

1. **Permissões de Diretório**
```bash
chmod 755 admin-panel/api/
chmod 777 upload/imagens-resizes/
```

2. **Criar Diretórios**
```bash
mkdir -p upload/imagens-resizes
mkdir -p admin-panel/api/logs
```

3. **Configurar URLs**

Em `NewsEditor.js`, ajuste se necessário:
```javascript
const endpoint = newsId 
  ? 'https://api.boca.com.br/api/news/update/'
  : 'https://api.boca.com.br/api/news/create/';
```

## 🐛 Logs e Debug

### Logs de Criação
Arquivo: `admin-panel/api/create_news.log`

Exemplo:
```
[2024-12-06 14:30:15] [INFO] Nova requisição de criação de notícia recebida
[2024-12-06 14:30:15] [INFO] Imagem salva: img_674d8a97_1733504415.jpg
[2024-12-06 14:30:16] [INFO] Notícia criada com sucesso: ID 12345 - Título da Notícia
```

### Logs de Atualização
Arquivo: `admin-panel/api/update_news.log`

### Console do Navegador
```javascript
// Ver dados enviados
console.log('Salvando notícia:', newsData);

// Ver resposta da API
console.log('Resposta da API:', result);
```

## ✅ Testes

### Teste Manual

1. **Criar Nova Notícia**
   - [ ] Clicar "Nova Notícia"
   - [ ] Formulário deve limpar
   - [ ] Preencher título, categoria e conteúdo
   - [ ] Salvar deve mostrar "Salvar Nova"
   - [ ] Após salvar, botão muda para "Atualizar"

2. **Validações**
   - [ ] Tentar salvar sem título → Erro
   - [ ] Tentar salvar sem categoria → Erro
   - [ ] Tentar salvar sem conteúdo → Erro

3. **Upload de Imagem**
   - [ ] Arrastar imagem funciona
   - [ ] Colar imagem funciona
   - [ ] URL externa funciona

4. **Buscar e Editar**
   - [ ] Buscar notícia existente
   - [ ] Campos preenchem corretamente
   - [ ] Editar e salvar funciona
   - [ ] Botão mostra "Atualizar"

## 🔒 Segurança

### Implementado
✅ CORS configurado
✅ Validação de tipos de arquivo (imagens)
✅ Prepared statements (PDO)
✅ Sanitização de entrada
✅ Transações do banco de dados
✅ Logs de auditoria

### Recomendações Futuras
- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Validação de tamanho de imagem
- [ ] Compressão de imagens
- [ ] Versionamento de notícias

## 📞 Suporte

Em caso de erros:

1. Verifique logs PHP: `admin-panel/api/create_news.log`
2. Console do navegador (F12)
3. Network tab para ver requisições
4. Permissões dos diretórios de upload

## 🎉 Pronto!

Agora você pode criar e editar notícias com facilidade no painel administrativo!
