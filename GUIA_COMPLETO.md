# 🚀 GUIA COMPLETO - Como Baixar e Executar o Projeto

## 📥 PASSO 1: BAIXAR O PROJETO

### Opção A - Via Emergent (Recomendado)
Se você está usando a plataforma Emergent:
1. Clique em "Files" ou "Arquivos" no menu lateral
2. Clique em "Download Project" ou "Baixar Projeto"
3. Um arquivo ZIP será baixado para seu computador
4. Extraia o ZIP em uma pasta de sua preferência

### Opção B - Via GitHub (se configurado)
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA]
```

---

## 💻 PASSO 2: INSTALAR PROGRAMAS NECESSÁRIOS

### 2.1 - Node.js (para o Frontend)
1. Baixe em: https://nodejs.org/
2. Instale a versão LTS (recomendada)
3. Verifique a instalação:
```bash
node --version
npm --version
```

### 2.2 - Python (para o Backend)
1. Baixe em: https://www.python.org/downloads/
2. Instale Python 3.8 ou superior
3. ⚠️ **IMPORTANTE:** Marque a opção "Add Python to PATH" durante a instalação
4. Verifique a instalação:
```bash
python --version
```
ou
```bash
python3 --version
```

### 2.3 - MongoDB
**Escolha uma das opções:**

#### Opção A - MongoDB Local (Mais Simples)
1. Baixe: https://www.mongodb.com/try/download/community
2. Instale normalmente
3. O MongoDB iniciará automaticamente

#### Opção B - MongoDB Atlas (Nuvem - Grátis)
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster gratuito
4. Em "Database Access", crie um usuário e senha
5. Em "Network Access", adicione seu IP (ou 0.0.0.0/0 para qualquer IP)
6. Em "Database", clique em "Connect" e copie a connection string

---

## ⚙️ PASSO 3: CONFIGURAR O PROJETO

### 3.1 - Abrir o Terminal/Prompt de Comando

**Windows:**
- Abra a pasta do projeto
- Na barra de endereços, digite `cmd` e pressione Enter

**Mac:**
- Abra o Terminal (Command + Espaço, digite "Terminal")
- Navegue até a pasta: `cd /caminho/para/projeto`

**Linux:**
- Abra o Terminal (Ctrl + Alt + T)
- Navegue até a pasta: `cd /caminho/para/projeto`

---

## 🔧 PASSO 4: CONFIGURAR O BACKEND

### 4.1 - Navegar para a pasta backend
```bash
cd backend
```

### 4.2 - Criar ambiente virtual Python

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

✅ Você verá `(venv)` antes do prompt, indicando que o ambiente está ativo

### 4.3 - Instalar dependências
```bash
pip install -r requirements.txt
```

⏱️ Aguarde alguns minutos enquanto instala...

### 4.4 - Configurar arquivo .env

**Windows:**
```bash
copy .env.example .env
notepad .env
```

**Mac/Linux:**
```bash
cp .env.example .env
nano .env
```

**Configure o arquivo .env:**

Se estiver usando **MongoDB Local:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=newsnow_db
```

Se estiver usando **MongoDB Atlas:**
```env
MONGO_URL=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/
DB_NAME=newsnow_db
```

Salve e feche o arquivo

### 4.5 - Iniciar o Backend

```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

✅ **Sucesso!** Você verá:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

🌐 **Teste:** Abra http://localhost:8001/api no navegador
Deve mostrar: `{"message":"Hello World"}`

⚠️ **DEIXE ESTE TERMINAL ABERTO!**

---

## 🎨 PASSO 5: CONFIGURAR O FRONTEND

### 5.1 - Abrir NOVO Terminal

Não feche o terminal do backend! Abra um novo terminal na mesma pasta do projeto.

### 5.2 - Navegar para a pasta frontend
```bash
cd frontend
```

### 5.3 - Instalar Yarn (gerenciador de pacotes)

**Windows/Mac/Linux:**
```bash
npm install -g yarn
```

### 5.4 - Instalar dependências

```bash
yarn install
```

⏱️ Aguarde alguns minutos enquanto instala...

### 5.5 - Verificar arquivo .env

**Windows:**
```bash
copy .env.example .env
notepad .env
```

**Mac/Linux:**
```bash
cp .env.example .env
nano .env
```

**O arquivo deve conter:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Salve e feche

### 5.6 - Iniciar o Frontend

```bash
yarn start
```

✅ **Sucesso!** Você verá:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
```

🎉 **O navegador abrirá automaticamente!**

---

## 🎯 RESUMO DOS COMANDOS

### Terminal 1 - Backend (manter aberto)
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Terminal 2 - Frontend (manter aberto)
```bash
cd frontend
yarn install
yarn start
```

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

### 1. Backend funcionando?
Abra: http://localhost:8001/api
Deve mostrar: `{"message":"Hello World"}`

### 2. Frontend funcionando?
Abra: http://localhost:3000
Deve mostrar o portal de notícias completo

### 3. MongoDB funcionando?
Se estiver usando MongoDB local:
- Windows: Verifique se o serviço MongoDB está rodando
- Mac: `brew services list`
- Linux: `sudo systemctl status mongod`

---

## 🛑 COMO PARAR OS SERVIDORES

### Parar Backend:
No terminal do backend, pressione: **CTRL + C**

### Parar Frontend:
No terminal do frontend, pressione: **CTRL + C**

### Parar MongoDB (se local):
**Windows:** O serviço continuará rodando (ok)
**Mac:** `brew services stop mongodb-community`
**Linux:** `sudo systemctl stop mongod`

---

## ❌ PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "python não é reconhecido"
**Solução:** Reinstale o Python e marque "Add to PATH"
Ou use `python3` em vez de `python`

### Erro: "pip não é reconhecido"
**Solução:**
```bash
python -m pip install --upgrade pip
```

### Erro: "yarn não é reconhecido"
**Solução:**
```bash
npm install -g yarn
```
Feche e abra o terminal novamente

### Erro: "Port 8001 already in use"
**Solução:** Outra aplicação está usando a porta

**Windows:**
```bash
netstat -ano | findstr :8001
taskkill /PID [NUMERO] /F
```

**Mac/Linux:**
```bash
lsof -ti:8001 | xargs kill -9
```

### Erro: "Port 3000 already in use"
Quando o yarn start perguntar, digite `Y` para usar outra porta

### Erro: "MongoDB connection failed"
**Soluções:**
1. Verifique se o MongoDB está rodando
2. Verifique o arquivo .env (especialmente MONGO_URL)
3. Se usando Atlas, verifique usuário/senha e IP permitido

### Erro: "Module not found"
**Solução:** Reinstale as dependências
```bash
# Frontend
cd frontend
rm -rf node_modules
yarn install

# Backend
cd backend
pip install -r requirements.txt --force-reinstall
```

---

## 🔄 PRÓXIMAS VEZES

Depois da primeira instalação, para rodar novamente:

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Terminal 2 - Frontend
```bash
cd frontend
yarn start
```

Pronto! Muito mais rápido 🚀

---

## 📁 ESTRUTURA DO PROJETO

```
newsnow-portal/
│
├── backend/
│   ├── server.py              # Servidor FastAPI
│   ├── requirements.txt       # Dependências Python
│   ├── .env.example          # Template de configuração
│   └── .env                  # Suas configurações (criar)
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas do site
│   │   ├── mock.js           # Dados de exemplo
│   │   ├── App.js            # App principal
│   │   └── App.css           # Estilos
│   ├── public/               # Arquivos públicos
│   ├── package.json          # Dependências Node
│   ├── .env.example          # Template
│   └── .env                  # Suas configurações (criar)
│
├── COMO_EXECUTAR.md          # Guia detalhado
├── API_CONFIG.md             # Como adicionar APIs
├── FUNCIONALIDADES.md        # O que o site faz
└── GUIA_COMPLETO.md          # Este arquivo
```

---

## 🎓 PRÓXIMOS PASSOS

1. **Explore o site:** Navegue, teste todas as funcionalidades
2. **Personalize:** Edite arquivos em `frontend/src/` para customizar
3. **Adicione APIs reais:** Siga o guia em `API_CONFIG.md`
4. **Deploy:** Quando estiver pronto, faça deploy na plataforma Emergent

---

## 📞 PRECISA DE AJUDA?

1. Releia as instruções com calma
2. Verifique se todos os programas estão instalados corretamente
3. Confirme que os dois terminais estão rodando
4. Leia as mensagens de erro com atenção
5. Tente as soluções em "Problemas Comuns"

---

**Boa sorte! 🚀 Você consegue!**

Se precisar de ajuda com algo específico, é só perguntar!
