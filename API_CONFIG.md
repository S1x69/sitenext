# 🔑 Guia de Configuração de APIs - NewsNow

Este documento explica como configurar as principais APIs utilizadas no portal de notícias NewsNow.

## 📋 Índice
- [Configuração Inicial](#configuração-inicial)
- [APIs de Inteligência Artificial](#apis-de-inteligência-artificial)
- [APIs de Notícias](#apis-de-notícias)
- [APIs de Texto-para-Voz](#apis-de-texto-para-voz)
- [Outras Configurações](#outras-configurações)

---

## 🚀 Configuração Inicial

1. **Copie o arquivo de exemplo:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Edite o arquivo `.env` e adicione suas chaves de API**

3. **Reinicie o servidor backend após adicionar as chaves:**
   ```bash
   sudo supervisorctl restart backend
   ```

---

## 🤖 APIs de Inteligência Artificial

### OpenAI (Recomendado)
**Para que serve:** Geração automática de resumos, análise de sentimento, categorização de notícias

**Como obter:**
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma conta ou faça login
3. Clique em "Create new secret key"
4. Copie a chave e adicione em `.env`:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
   ```

**Modelos disponíveis:**
- `gpt-4` - Melhor qualidade (mais caro)
- `gpt-3.5-turbo` - Bom custo-benefício

---

### Anthropic Claude
**Para que serve:** Alternativa ao OpenAI para processamento de texto

**Como obter:**
1. Acesse: https://console.anthropic.com/
2. Crie uma conta
3. Vá em "API Keys"
4. Gere uma nova chave
5. Adicione em `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
   ```

---

### Google Gemini
**Para que serve:** Análise de conteúdo e geração de texto

**Como obter:**
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Get API key"
4. Adicione em `.env`:
   ```
   GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxx
   ```

---

## 📰 APIs de Notícias

### NewsAPI (Essencial)
**Para que serve:** Buscar notícias reais de milhares de fontes ao redor do mundo

**Como obter:**
1. Acesse: https://newsapi.org/register
2. Preencha o formulário de registro
3. Confirme seu email
4. Copie sua API Key
5. Adicione em `.env`:
   ```
   NEWS_API_KEY=xxxxxxxxxxxxxxxxxxxxx
   ```

**Recursos:**
- 100 requisições/dia (plano gratuito)
- Acesso a +80.000 fontes de notícias
- Busca por categoria, palavra-chave, país

**Exemplo de uso no backend:**
```python
import requests

def buscar_noticias(categoria):
    url = f"https://newsapi.org/v2/top-headlines"
    params = {
        'apiKey': os.environ.get('NEWS_API_KEY'),
        'category': categoria,
        'language': 'pt',
        'country': 'br'
    }
    response = requests.get(url, params=params)
    return response.json()
```

---

### The Guardian API
**Para que serve:** Fonte adicional de notícias de qualidade

**Como obter:**
1. Acesse: https://open-platform.theguardian.com/access/
2. Preencha o formulário
3. Confirme seu email
4. Adicione em `.env`:
   ```
   GUARDIAN_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

---

## 🎙️ APIs de Texto-para-Voz

### Web Speech API (Já implementado - GRÁTIS)
**Status:** ✅ Funcionando sem necessidade de API key
**Limitações:**
- Funciona apenas no navegador
- Vozes limitadas do sistema operacional
- Qualidade variável

---

### ElevenLabs (Melhor qualidade)
**Para que serve:** Síntese de voz ultra-realista em português

**Como obter:**
1. Acesse: https://elevenlabs.io/
2. Crie uma conta
3. Vá em "Profile" → "API Key"
4. Copie a chave
5. Adicione em `.env`:
   ```
   ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxx
   ```

**Vantagens:**
- Vozes muito naturais
- Suporte a português brasileiro
- 10.000 caracteres/mês (plano gratuito)

---

### Google Cloud Text-to-Speech
**Para que serve:** Alternativa robusta para síntese de voz

**Como obter:**
1. Acesse: https://cloud.google.com/text-to-speech
2. Crie um projeto no Google Cloud
3. Ative a API Text-to-Speech
4. Crie credenciais de serviço
5. Baixe o arquivo JSON
6. Configure o caminho em `.env`:
   ```
   GOOGLE_CLOUD_TTS_KEY=caminho/para/credentials.json
   ```

---

## 🔧 Outras Configurações

### JWT Secret
**Para que serve:** Autenticação e segurança de sessões

**Como gerar:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Adicione em `.env`:
```
JWT_SECRET=sua_chave_gerada_aqui
```

---

### Pinecone (Busca Semântica)
**Para que serve:** Busca inteligente de notícias por significado

**Como obter:**
1. Acesse: https://www.pinecone.io/
2. Crie uma conta
3. Crie um novo índice
4. Copie as credenciais
5. Adicione em `.env`:
   ```
   PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   PINECONE_ENVIRONMENT=us-west1-gcp
   ```

---

## 📊 Resumo de Custos (Planos Gratuitos)

| Serviço | Limite Gratuito | Suficiente para? |
|---------|----------------|------------------|
| OpenAI | $5 créditos iniciais | Testes e desenvolvimento |
| NewsAPI | 100 req/dia | Protótipo e MVP |
| ElevenLabs | 10k caracteres/mês | ~100 notícias lidas |
| Google TTS | 1M caracteres/mês | Uso intensivo |
| Anthropic | $5 créditos iniciais | Testes |

---

## ⚠️ Importante

1. **Nunca compartilhe suas API keys**
2. **Adicione `.env` no `.gitignore`**
3. **Use variáveis de ambiente em produção**
4. **Monitore o uso das APIs para evitar cobranças inesperadas**
5. **Implemente rate limiting no seu backend**

---

## 🆘 Suporte

Se tiver dúvidas sobre a configuração de alguma API, consulte:
- Documentação oficial de cada serviço
- GitHub Issues do projeto
- Comunidade do portal

---

**Última atualização:** Janeiro 2025
