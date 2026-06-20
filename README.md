# finanças · controle de finanças pessoais

App **full-stack** de finanças pessoais (em português, valores em **BRL / R$**), a partir do
design **“Finanças Web”** — direção visual *Sereno*: clara, calma e verde.

Conta com **frontend React** e um **backend real (Express + Prisma + SQLite)** com
**multiusuário (login JWT)**, persistência e um módulo de **Open Finance** com provider
plugável (mock por padrão; pronto para um agregador real como Pluggy/Belvo).

| Camada | Stack |
| --- | --- |
| Frontend | React 18 + Vite + Tailwind CSS + TypeScript |
| Backend | Node + Express + Prisma + SQLite + TypeScript |
| Auth | JWT (cadastro/login), senhas com bcrypt |
| Open Finance | Provider abstrato — `mock` (default) ou `pluggy` (adaptador) |

## ✨ Funcionalidades

- **9 telas**: Visão geral, Transações, Orçamentos, Cartões, Aplicações, Empréstimos,
  Relatórios, Revisar importação e Conexões.
- **Tudo persiste no backend**: categorizar transação, conectar banco, confirmar/pular
  importação — tudo grava no banco de dados e recalcula os números de verdade.
- **Dashboard calculado**: KPIs (patrimônio, entradas, saídas, taxa de poupança), fluxo de
  caixa de 6 meses, donut de gastos por categoria e orçamentos com gasto real — todos
  derivados das transações.
- **Multiusuário**: cada conta tem seus próprios dados (semeados automaticamente no cadastro).
- **Controles**: seletor de **mês**, **privacidade** (oculta valores) e **densidade**.

## 🔓 Open Finance

> **Importante:** uma conexão **real** com o Open Finance Brasil exige ser instituição
> autorizada pelo BACEN (com certificados ICP-Brasil, mTLS e perfil FAPI) **ou** usar um
> agregador autorizado (ex.: **Pluggy**, **Belvo**) — em geral pago e com chaves de API.

Por isso o backend usa um **provider plugável** (`server/src/openfinance/`):

- **`mock`** (padrão): simula fielmente o fluxo `consentimento → autorização → sincronização`.
  Conectar um banco cria um consentimento, autoriza e importa transações para revisão —
  tudo funcional, sem credenciais.
- **`pluggy`** (adaptador): `pluggyProvider.ts` mostra exatamente onde plugar um agregador
  real. Basta implementar os 3 métodos da interface, preencher `PLUGGY_*` no `.env` e definir
  `OPENFINANCE_PROVIDER="pluggy"` — o resto do app já fala essa interface.

## 🚀 Como rodar

Pré-requisito: **Node 18+**.

### 1) Backend (porta 3001)

```bash
cd server
npm install
cp .env.example .env          # ajuste JWT_SECRET
npm run db:push               # cria o banco SQLite (server/prisma/dev.db)
npm run seed                  # popula categorias + usuário demo
npm run dev                   # API em http://localhost:3001
```

### 2) Frontend (porta 5173)

Em outro terminal, na raiz do projeto:

```bash
npm install
npm run dev                   # http://localhost:5173 (faz proxy de /api → 3001)
```

Atalhos a partir da raiz: `npm run server:install`, `npm run server:setup`, `npm run server`.

### Login de teste

```
marina@financas.app  ·  demo1234
```

Ou crie uma conta nova na tela de cadastro (ela vem com dados de exemplo).

## 🗂️ Estrutura

```
.
├── src/                      # Frontend (React + Vite + Tailwind)
│   ├── api/                  # client HTTP + tipos da API
│   ├── auth/                 # AuthProvider + hook (JWT)
│   ├── components/           # Login, Sidebar, Topbar, telas, ui/
│   ├── context/              # FinanceProvider (busca bootstrap + mutações)
│   └── lib/                  # format (R$/máscara/data), mapTx, mapBudget
│
├── server/                   # Backend (Express + Prisma + SQLite)
│   ├── prisma/               # schema.prisma + seed
│   └── src/
│       ├── routes/           # auth, bootstrap, transactions, budgets, imports, connections
│       ├── openfinance/      # provider (interface + mock + pluggy stub)
│       ├── bootstrap.ts      # calcula KPIs/fluxo/donut/orçamentos a partir do DB
│       └── seedUser.ts       # dados de exemplo por usuário
│
└── design/                   # arquivos-fonte do design (.dc.html) para referência
```

## 🔌 API (resumo)

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/register` · `/api/auth/login` | cadastro / login (retorna JWT) |
| GET | `/api/bootstrap?month=YYYY-MM` | tudo que a UI precisa para o mês |
| PATCH | `/api/transactions/:id` | (re)categorizar transação |
| POST | `/api/transactions` | criar transação |
| POST | `/api/budgets` | criar/atualizar orçamento |
| POST | `/api/imports/:id/resolve` | confirmar (vira transação) ou pular import |
| POST | `/api/connections/:bankId/connect` | conectar banco via Open Finance |
| POST | `/api/connections/:bankId/sync` | re-sincronizar banco conectado |

Rotas de dados exigem `Authorization: Bearer <token>`.

## 📝 Notas

- O banco é **SQLite** (`server/prisma/dev.db`) — zero configuração. Os dados de exemplo são
  semeados por usuário; a integração Open Finance é simulada pelo provider `mock`.
- `.env` (com segredos) e `dev.db` não são versionados.
