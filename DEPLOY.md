# Deploy na nuvem (Vercel + Postgres)

Este guia coloca o app **inteiro** no ar numa única URL pública da Vercel:

- **Frontend** (Vite/React) servido como site estático.
- **Backend** (Express + Prisma) rodando como **função serverless** em `/api/*`.
- **Banco** PostgreSQL gerenciado (Vercel Postgres/Neon ou Supabase).

O schema do banco e o usuário de demonstração são criados **automaticamente** no
build do deploy (`vercel-build` roda `prisma db push` + seed, de forma idempotente).
Você não precisa rodar nada na sua máquina.

> Login de demonstração: **marina@financas.app** / **demo1234**

---

## 1. Importar o repositório na Vercel

1. Acesse <https://vercel.com/new> e faça login com o GitHub.
2. **Import** o repositório `dfg-dexterity/personalfinancebrl`.
3. Em *Branch*, selecione `claude/funny-cerf-bgn8ws` (ou faça o merge na main antes).
4. A Vercel detecta **Vite** automaticamente. Não mexa em Build/Output — o
   `vercel.json` já define `buildCommand` e `outputDirectory`.
5. **Não clique em Deploy ainda** — primeiro configure o banco (passo 2) e as
   variáveis (passo 3), senão o build falha ao criar as tabelas.

## 2. Provisionar o Postgres

Escolha **uma** opção.

### Opção A — Vercel Postgres (Neon) · recomendado
Sem copiar segredos: a Vercel injeta as variáveis no projeto.

1. No projeto da Vercel → aba **Storage** → **Create Database** → **Postgres (Neon)**.
2. Conecte ao projeto. Isso cria variáveis como `DATABASE_URL` e
   `DATABASE_URL_UNPOOLED` (os nomes podem variar).
3. Garanta que existam **exatamente** estas duas (passo 3):
   - `DATABASE_URL`  → a string **pooled** (porta 6543 / contém `pgbouncer=true`).
   - `DIRECT_URL`    → a string **direta/não-pooled** (porta 5432). Se a
     integração criou `DATABASE_URL_UNPOOLED` ou `POSTGRES_URL_NON_POOLING`,
     copie o valor dela para uma nova variável chamada `DIRECT_URL`.

### Opção B — Supabase
1. Crie um projeto em <https://supabase.com> (free tier).
2. Em **Project Settings → Database → Connection string**:
   - **Connection pooling** (Transaction, porta 6543) → use em `DATABASE_URL`
     (acrescente `?pgbouncer=true&connection_limit=1`).
   - **Direct connection** (porta 5432) → use em `DIRECT_URL`.

> Posso provisionar o Supabase pra você automaticamente (via integração) e te
> entregar as duas strings prontas — é só pedir.

## 3. Variáveis de ambiente (Settings → Environment Variables)

| Variável             | Valor                                                        |
| -------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`       | string **pooled** do Postgres (porta 6543, `pgbouncer=true`) |
| `DIRECT_URL`         | string **direta** do Postgres (porta 5432)                   |
| `JWT_SECRET`         | uma string longa e aleatória                                 |
| `OPENFINANCE_PROVIDER` | `mock` (dados de demonstração) — opcional                  |
| `CLIENT_ORIGIN`      | a URL pública do site (ex.: `https://seu-app.vercel.app`) — opcional |

Gere um `JWT_SECRET` forte, por exemplo: `openssl rand -hex 32`.

## 4. Deploy

Clique em **Deploy**. O build vai:

1. `prisma generate` — gera o client (com binário do runtime da Vercel).
2. `prisma db push` — cria as tabelas no Postgres (usa `DIRECT_URL`).
3. `seed` — cria o catálogo de categorias + o usuário de demonstração (idempotente).
4. `vite build` — gera o site estático.

Ao terminar, abra a URL (`https://seu-app.vercel.app`) e faça login com
**marina@financas.app / demo1234**.

---

## Como funciona (visão técnica)

- `api/index.ts` exporta o app Express como função serverless.
- `vercel.json` reescreve `/api/*` para essa função e faz fallback de SPA para
  `index.html` nas demais rotas.
- `server/src/app.ts` contém o app Express **sem** `listen()`; `server/src/index.ts`
  só dá `listen()` no desenvolvimento local.
- `server/src/prisma.ts` reaproveita um único `PrismaClient` (evita estourar o
  pool de conexões em ambiente serverless).
- O `binaryTargets` no `schema.prisma` inclui `rhel-openssl-3.0.x` para o runtime
  da Vercel.

## Notas

- **Re-seed a cada deploy:** o `seed` roda em todo build, mas é idempotente
  (usa `upsert` e checa se o usuário demo já existe). Para parar de semear após o
  primeiro deploy, remova `&& tsx server/prisma/seed.ts` do script `vercel-build`.
- **Build falhou no `prisma db push`?** Quase sempre é `DIRECT_URL` ausente ou
  incorreta — confira o passo 2/3.
- **Erro de engine do Prisma na função?** Confirme o `binaryTargets` em
  `server/prisma/schema.prisma`.
- **Dev local agora usa Postgres** (não mais SQLite): aponte `DATABASE_URL`/
  `DIRECT_URL` em `server/.env` para um Postgres (pode ser o mesmo da nuvem) e rode
  `npm run server:setup && npm run server` + `npm run dev`.
