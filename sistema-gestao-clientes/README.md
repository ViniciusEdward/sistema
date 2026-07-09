# Sistema Gestão Clientes — v1.0

Sistema web privado para uma única pessoa gerenciar clientes, mensalidades, pagamentos e dashboard financeiro.

## Stack escolhida

- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Node.js + TypeScript + Express
- Banco: MySQL
- ORM: Prisma
- Auth: JWT em cookie `httpOnly` + senha com hash bcrypt
- Deploy: Frontend na Vercel, API no Render, MySQL no Clever Cloud

### Por que Prisma?

Escolhi Prisma pela produtividade e segurança de tipos no TypeScript. Para este sistema, o Prisma deixa as consultas CRUD, transações de pagamento e leitura de relacionamento muito claras. O SQL continua sendo entregue em `database/schema.sql`, então o banco pode ser criado diretamente no MySQL do Clever Cloud sem depender de Supabase ou de migrations automáticas.

### Decisão sobre pagamentos

O pagamento foi modelado em tabela própria (`pagamentos`) e não apenas dentro de `mensalidades`. A mensalidade mantém `status`, `pago_em` e `forma_pagamento` para leitura rápida, mas o registro em `pagamentos` funciona como histórico financeiro/auditoria. Ao marcar uma mensalidade como paga, o backend atualiza a mensalidade, cria um pagamento e cria uma entrada em `caixa_transacoes` dentro de uma única transação do banco.

### Cookie httpOnly vs localStorage

A v1.0 usa JWT em cookie `httpOnly`. Isso é mais seguro contra XSS porque o JavaScript do navegador não consegue ler o token. Em deploy separado Vercel + Render, o backend usa CORS com `credentials: true` e cookie `SameSite=None; Secure` em produção. `localStorage` seria mais simples em CORS, mas expõe o token a scripts maliciosos caso ocorra XSS.

---

## Estrutura

```txt
sistema-gestao-clientes/
├── frontend/
├── backend/
├── database/
└── README.md
```

---

## Rodar localmente

### 1. Banco local ou Clever Cloud

Crie um MySQL e rode:

Rode os arquivos no MySQL Workbench nesta ordem:

```txt
1. database/schema.sql
2. database/seed.sql
```

O seed cria categorias padrão e deixa um usuário dev de referência. Ao iniciar o backend com o `.env.example`, o serviço cria/atualiza automaticamente o usuário único:

```txt
email: admin@sistema.local
senha: Admin@123456
```

Em produção, prefira usar `ADMIN_PASSWORD_HASH` no Render em vez de senha em texto.

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run dev
```

API local:

```txt
http://localhost:4000/api
```

Para gerar um hash bcrypt de senha:

```bash
npm run hash:password -- MinhaSenhaForte123
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend local:

```txt
http://localhost:5173
```

---

## Deploy passo a passo

## 1. Clever Cloud — MySQL

1. Acesse o console da Clever Cloud.
2. Crie um add-on MySQL.
3. Copie as credenciais/connection string do banco.
4. Rode o schema e seed usando MySQL Workbench ou outro cliente MySQL:

```txt
1. Abra database/schema.sql, cole no editor SQL e execute.
2. Abra database/seed.sql, cole no editor SQL e execute.
```

Observação: se preferir não inserir o usuário pelo `seed.sql`, rode apenas o schema e configure `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` no Render. O backend cria/atualiza o usuário único ao iniciar.

### Conexão pelo MySQL Workbench

No MySQL Workbench, crie uma conexão com os dados do add-on MySQL do Clever Cloud:

```txt
Hostname: HOST do MYSQL_ADDON_HOST
Port: 3306
Username: usuário do MYSQL_ADDON_USER
Password: senha do MYSQL_ADDON_PASSWORD
Default Schema: nome do MYSQL_ADDON_DB
```

Depois abra uma aba de SQL, execute primeiro `database/schema.sql` e depois `database/seed.sql`.


## 2. Render — Backend/API

1. Suba este projeto para um repositório GitHub.
2. No Render, crie um **Web Service**.
3. Selecione o repositório.
4. Configure:

```txt
Root Directory: backend
Build Command: npm ci && npm run prisma:generate && npm run build
Start Command: npm run start
Health Check Path: /health
```

5. Configure as variáveis de ambiente:

```txt
NODE_ENV=production
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DBNAME
FRONTEND_URL=https://seu-frontend.vercel.app
JWT_SECRET=um-segredo-forte-com-32-caracteres-ou-mais
JWT_EXPIRES_IN=7d
COOKIE_SECURE=true
ADMIN_EMAIL=seuemail@dominio.com
ADMIN_NAME=Administrador
ADMIN_PASSWORD_HASH=hash_bcrypt_da_senha
```

6. Faça o deploy e copie a URL pública da API, por exemplo:

```txt
https://sistema-gestao-clientes-api.onrender.com
```

## 3. Vercel — Frontend

1. Na Vercel, importe o mesmo repositório.
2. Configure:

```txt
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

3. Configure a variável:

```txt
VITE_API_URL=https://sistema-gestao-clientes-api.onrender.com/api
```

4. Faça o deploy.
5. Volte ao Render e atualize `FRONTEND_URL` com a URL final da Vercel.
6. Redeploy no Render para aplicar CORS/cookie.

---

## Roadmap

### v1.0 — entregue neste pacote

- Login único
- Dashboard
- Clientes
- Mensalidades
- Pagamentos
- Criação automática de entrada no caixa ao pagar mensalidade
- Banco com tabelas completas para v1.1

### v1.1 — próxima etapa

- Caixa completo
- Despesas completo
- Relatórios

### v1.2 — etapa seguinte

- Integração WhatsApp
- Exportação PDF
- Exportação Excel

---

## Observações de segurança

- Nunca coloque `DATABASE_URL`, `JWT_SECRET` ou senha em código fonte.
- Use `ADMIN_PASSWORD_HASH` em produção.
- O backend aceita `ADMIN_PASSWORD` para facilitar ambiente local, mas no deploy é melhor usar hash.
- O cookie usa `httpOnly`; o frontend não lê o token diretamente.
