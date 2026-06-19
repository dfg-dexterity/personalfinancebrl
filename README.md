# finanças · controle de finanças pessoais

Painel web de finanças pessoais (em português, valores em **BRL / R$**), implementado
a partir do design **“Finanças Web”** — a direção visual *Sereno*: clara, calma e verde.

Conecta contas via **Open Finance**, centraliza transações, categoriza gastos, acompanha
orçamentos, cartões, aplicações, empréstimos e relatórios.

> Construído com **React + Vite + Tailwind CSS (TypeScript)**.

## ✨ Telas

Navegação por barra lateral entre 9 telas, todas implementadas:

| Tela | Conteúdo |
| --- | --- |
| **Visão geral** | KPIs (patrimônio, entradas, saídas, taxa de poupança), banner de importação, fluxo de caixa, transações recentes, contas, gastos por categoria e mini-orçamento |
| **Transações** | Lista filtrável; clicar numa linha abre o modal de categorização |
| **Orçamentos** | Cards-resumo + barras por categoria (viram âmbar perto do limite, vermelho ao estourar) |
| **Cartões** | Cartão de crédito, fatura, limite e lançamentos |
| **Aplicações** | Carteira de investimentos com variação |
| **Empréstimos** | Saldo devedor, parcelas e progresso de quitação |
| **Relatórios** | Entradas × Saídas (6 meses), donut por categoria e insight |
| **Revisar importação** | Confirmação/descarte de transações importadas via Open Finance |
| **Conexões** | Bancos conectados via Open Finance, com fluxo de conexão |

## 🎛️ Controles interativos

Disponíveis na barra superior — reproduzem os “knobs” do design original:

- **Cenário do mês** (`📅 Junho 2026`): *Mês tranquilo · Mês apertado · Mês cheio* — recalcula
  todos os números, gráficos e cores da aplicação.
- **Privacidade** (`👁`): oculta/mostra todos os valores em R$.
- **Densidade** (`⇕`): *Compacto · Confortável · Espaçoso* — ajusta o espaçamento do conteúdo.

Outras interações: navegação entre telas, categorização de transações (modal), filtros de
transações, revisão de importação (confirmar/pular) e conexão de bancos (com estado de
carregamento).

## 🚀 Começando

```bash
npm install      # instala as dependências
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
npm run build    # type-check + build de produção (dist/)
npm run preview  # serve o build de produção
npm run lint     # ESLint
npm run typecheck
```

Requer **Node 18+**.

## 🗂️ Estrutura

```
src/
├── App.tsx                  # shell: sidebar + topbar + roteamento de telas + modal
├── main.tsx                 # ponto de entrada (envolve em <FinanceProvider>)
├── index.css                # Tailwind + estilos base (fontes, scrollbar, cards)
├── types.ts                 # tipos do domínio
├── context/
│   ├── finance-context.ts   # contrato do contexto
│   ├── FinanceProvider.tsx  # estado global + ações (cenário, privacidade, etc.)
│   └── useFinance.ts        # hook de acesso
├── data/finance.ts          # categorias, cenários, contas, bancos, dados mock
├── lib/                     # format (R$/máscara), mapTx, mapBudget
└── components/
    ├── Sidebar.tsx · Topbar.tsx · CategoryPickerModal.tsx
    ├── ui/                  # Dropdown · ProgressBar · CashflowBars · SpendingDonut
    └── screens/             # 9 telas

design/                      # arquivos-fonte do design (.dc.html) para referência
```

## 🎨 Design tokens

Os tokens da direção *Sereno* estão em `tailwind.config.js`:

- **Fundo**: `#f7f6f2` (canvas) · **Cards**: `#fff` com borda `#ecebe3`
- **Verdes**: `#1c3525` (sidebar), `#1f3d2b` (cards escuros/botões), `#3f7a55` (positivo), `#9ee6b5` (mint)
- **Texto**: `#26241e` / `#8a8678` / `#a8a499`
- **Tipografia**: *Plus Jakarta Sans* (interface) + *IBM Plex Mono* (valores)

## 📝 Notas

- Os dados são **mock** em `src/data/finance.ts` — não há backend. A integração Open
  Finance é simulada (inclusive o estado de “Conectando…”).
- Os arquivos originais do design ficam em `design/` apenas como referência.
