# 🚀 Como Executar o Portal de Notícias no seu PC

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado no seu computador:

### 1. Node.js (versão 16 ou superior)
**Verificar se já tem:**
```bash
node --version
npm --version
```

**Se não tiver, baixe em:** https://nodejs.org/

### 2. Python (versão 3.8 ou superior)
**Verificar se já tem:**
```bash
python --version
# ou
python3 --version
```

**Se não tiver, baixe em:** https://www.python.org/downloads/

### 3. MongoDB
**Opção 1 - MongoDB Local:**
- Baixe e instale: https://www.mongodb.com/try/download/community

**Opção 2 - MongoDB Atlas (Nuvem - Grátis):**
- Crie conta em: https://www.mongodb.com/cloud/atlas
- Crie um cluster gratuito
- Copie a connection string

### 4. Git (opcional, para clonar)
**Verificar se já tem:**
```bash
git --version
```

**Se não tiver, baixe em:** https://git-scm.com/downloads

---

## 📦 Passo 1: Obter o Projeto

### Opção A - Se você tem acesso ao repositório Git:
```bash
git clone <url-do-repositório>
cd <nome-da-pasta>
```

### Opção B - Se você baixou um ZIP:
1. Extraia o arquivo ZIP
2. Abra o terminal/prompt na pasta extraída

---

## ⚙️ Passo 2: Configurar o Backend

### 2.1 - Navegar para a pasta do backend
```bash
cd backend
```

### 2.2 - Criar ambiente virtual Python (recomendado)

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

### 2.3 - Instalar dependências Python
```bash
pip install -r requirements.txt
```

### 2.4 - Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend`:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**Edite o arquivo `.env` e configure:**

```env
# MongoDB Local
MONGO_URL=mongodb://localhost:27017
DB_NAME=newsnow_db

# OU MongoDB Atlas (se estiver usando a nuvem)
MONGO_URL=mongodb+srv://usuario:senha@cluster.mongodb.net/
DB_NAME=newsnow_db

# Outras configurações (opcional por enquanto)
JWT_SECRET=sua_chave_secreta_aqui
```

### 2.5 - Iniciar MongoDB Local (se não estiver usando Atlas)

**Windows:**
```bash
# Abra outro terminal e execute:
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 2.6 - Iniciar o servidor Backend
```bash
# Ainda na pasta backend com ambiente virtual ativo
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Você verá algo como:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

✅ **Backend rodando em:** http://localhost:8001

---

## 🎨 Passo 3: Configurar o Frontend

### 3.1 - Abrir NOVO terminal (deixe o backend rodando)

### 3.2 - Navegar para a pasta do frontend
```bash
cd frontend
```

### 3.3 - Instalar Yarn (se não tiver)
```bash
npm install -g yarn
```

### 3.4 - Instalar dependências
```bash
yarn install
```

### 3.5 - Verificar/Criar arquivo .env

Crie um arquivo `.env` na pasta `frontend`:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**O arquivo `.env` deve conter:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 3.6 - Iniciar o servidor Frontend
```bash
yarn start
```

**Você verá algo como:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ **Frontend rodando em:** http://localhost:3000

**O navegador deve abrir automaticamente!** 🎉

---

## 🎯 Resumo dos Comandos

### Terminal 1 - Backend
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

### Terminal 2 - Frontend
```bash
cd frontend
yarn install
yarn start
```

---

## 🔍 Verificar se está funcionando

1. **Backend:** Abra http://localhost:8001/api
   - Deve mostrar: `{"message":"Hello World"}`

2. **Frontend:** Abra http://localhost:3000
   - Deve mostrar o portal de notícias completo

---

## ❌ Problemas Comuns

### Erro: "Port 8001 already in use"
**Solução:** Outro processo está usando a porta
```bash
# Windows - Encontrar e matar o processo
netstat -ano | findstr :8001
taskkill /PID <número_do_processo> /F

# Mac/Linux
lsof -ti:8001 | xargs kill -9
```

### Erro: "Port 3000 already in use"
**Solução:** Use outra porta ou mate o processo
```bash
# Quando perguntado, digite 'Y' para usar outra porta
# OU mate o processo atual na porta 3000
```

### Erro: "MongoDB connection failed"
**Soluções:**
1. Verifique se o MongoDB está rodando
2. Verifique a connection string no `.env`
3. Se usando Atlas, verifique suas credenciais

### Erro: "Module not found"
**Solução:** Instale as dependências novamente
```bash
# Backend
pip install -r requirements.txt

# Frontend
yarn install
```

### Erro: "Cannot find module 'react-scripts'"
**Solução:**
```bash
cd frontend
rm -rf node_modules
yarn install
```

---

## 🛑 Como Parar os Servidores

### Parar Backend:
No terminal do backend, pressione: `CTRL + C`

### Parar Frontend:
No terminal do frontend, pressione: `CTRL + C`

### Parar MongoDB (se local):
**Windows:**
```bash
# No terminal onde iniciou o mongod, pressione CTRL + C
```

**Mac:**
```bash
brew services stop mongodb-community
```

**Linux:**
```bash
sudo systemctl stop mongod
```

---

## 📁 Estrutura de Pastas

```
projeto/
├── backend/
│   ├── server.py          # Servidor FastAPI
│   ├── requirements.txt   # Dependências Python
│   ├── .env              # Configurações (criar)
│   └── .env.example      # Template
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas
│   │   ├── App.js        # Componente principal
│   │   └── mock.js       # Dados de exemplo
│   ├── package.json      # Dependências Node
│   ├── .env             # Configurações (criar)
│   └── .env.example     # Template
│
├── API_CONFIG.md         # Guia de APIs
├── FUNCIONALIDADES.md    # Lista de funcionalidades
└── COMO_EXECUTAR.md     # Este arquivo
```

---

## 🎓 Próximos Passos

Depois de ter tudo rodando:

1. **Explore o site:** Navegue pelas notícias, teste a busca, mude o tema
2. **Leia a documentação:** 
   - `FUNCIONALIDADES.md` - O que o site faz
   - `API_CONFIG.md` - Como adicionar APIs reais
3. **Personalize:** Edite os arquivos em `frontend/src/` para customizar

---

## 📞 Precisa de Ajuda?

Se encontrar algum problema:

1. Verifique se todos os pré-requisitos estão instalados
2. Confirme que os dois servidores estão rodando
3. Verifique os arquivos `.env` 
4. Leia as mensagens de erro com atenção
5. Tente os passos de "Problemas Comuns"

---

**Boa sorte! 🚀**
