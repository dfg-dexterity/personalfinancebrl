import { BANKS } from './data/catalog'
import { toCents } from './money'
import { prisma } from './prisma'

/** UTC date helper for the seed (year fixed at 2026 to match the design). */
function d(month1to12: number, day: number): Date {
  return new Date(Date.UTC(2026, month1to12 - 1, day, 12, 0, 0))
}

interface Expense {
  name: string
  cat: string | null
  amount: number // positive number; sign applied below
  day: number
}

/** A "typical" month of spending, scaled per month to vary the cash-flow chart. */
const TEMPLATE: Expense[] = [
  { name: 'Aluguel', cat: 'home', amount: 2100, day: 5 },
  { name: 'Supermercado Pão de Açúcar', cat: 'food', amount: 742.6, day: 8 },
  { name: 'Hortifruti', cat: 'food', amount: 184.2, day: 14 },
  { name: 'iFood', cat: 'food', amount: 213.5, day: 19 },
  { name: 'Posto Shell', cat: 'transport', amount: 312, day: 15 },
  { name: 'Uber', cat: 'transport', amount: 168.3, day: 11 },
  { name: '99 Táxi', cat: 'transport', amount: 92.7, day: 24 },
  { name: 'Netflix', cat: 'subs', amount: 55.9, day: 4 },
  { name: 'Spotify', cat: 'subs', amount: 21.9, day: 6 },
  { name: 'Drogaria São Paulo', cat: 'health', amount: 189.7, day: 10 },
  { name: 'Academia', cat: 'health', amount: 119, day: 9 },
  { name: 'Cinema', cat: 'leisure', amount: 96, day: 18 },
  { name: 'Bar do Zé', cat: 'leisure', amount: 184, day: 26 },
  { name: 'Amazon', cat: 'shop', amount: 149.9, day: 1 },
  { name: 'Renner', cat: 'shop', amount: 219.8, day: 16 },
]

const MONTH_MULTIPLIER: Record<number, number> = { 1: 0.92, 2: 1.0, 3: 0.86, 4: 1.08, 5: 0.95 }

/** Curated June (current month) — includes the design's recent + one uncategorized row. */
const JUNE: Expense[] = [
  { name: 'Aluguel', cat: 'home', amount: 2100, day: 5 },
  { name: 'Supermercado Pão de Açúcar', cat: 'food', amount: 742.6, day: 8 },
  { name: 'Hortifruti', cat: 'food', amount: 184.2, day: 14 },
  { name: 'Netflix', cat: 'subs', amount: 55.9, day: 4 },
  { name: 'Spotify', cat: 'subs', amount: 21.9, day: 6 },
  { name: 'Academia', cat: 'health', amount: 119, day: 9 },
  { name: 'Drogaria São Paulo', cat: 'health', amount: 89.7, day: 12 },
  { name: 'Cinema', cat: 'leisure', amount: 96, day: 13 },
  { name: 'Bar do Zé', cat: 'leisure', amount: 184, day: 15 },
  { name: 'Amazon', cat: 'shop', amount: 149.9, day: 1 },
  { name: 'Renner', cat: 'shop', amount: 150.1, day: 16 },
  { name: 'Posto Shell', cat: 'transport', amount: 180, day: 17 },
  { name: 'Uber', cat: 'transport', amount: 23.4, day: 19 },
  { name: 'iFood', cat: 'food', amount: 64.9, day: 20 },
  { name: 'Padaria Aurora', cat: null, amount: 32.5, day: 20 },
]

const ACCOUNTS = [
  { bankId: 'nu', name: 'Conta digital', kind: 'Crédito · débito', balance: 9120, letter: 'N', color: '#7a3fb8' },
  { bankId: 'it', name: 'Conta corrente', kind: 'Salário', balance: 12430, letter: 'I', color: '#e35728' },
  { bankId: 'in', name: 'Banco Inter', kind: 'Aplicações', balance: 3297, letter: 'B', color: '#f5a623' },
]

const INVESTMENTS = [
  { name: 'CDB Liquidez Diária', sub: 'Banco Inter · 102% CDI', value: 12430, changePct: 0.9, tag: 'CDB', bg: '#e3eee6', fg: '#3f7a55', sort: 1 },
  { name: 'Tesouro Selic 2029', sub: 'Renda fixa', value: 8900, changePct: 0.8, tag: 'TD', bg: '#e6f0ea', fg: '#3f7a55', sort: 2 },
  { name: 'Ações & ETFs', sub: 'Carteira variável', value: 5320, changePct: 2.1, tag: 'AÇ', bg: '#ebe8f0', fg: '#7a6f9b', sort: 3 },
  { name: 'Fundos Imobiliários', sub: '4 ativos', value: 4440, changePct: -0.4, tag: 'FII', bg: '#f0e8e0', fg: '#b08968', sort: 4 },
]

const LOANS = [
  { name: 'Empréstimo pessoal', bank: 'Itaú', rate: '2,1% a.m.', remaining: 13260, monthly: 612, paid: 14, total: 36, sort: 1 },
  { name: 'Financiamento moto', bank: 'Banco Inter', rate: '1,8% a.m.', remaining: 5140, monthly: 410, paid: 18, total: 24, sort: 2 },
]

const CARD = {
  name: 'Cartão Nubank',
  invoice: 3214.7,
  limit: 12000,
  used: 3214,
  dueDate: '12/jul',
  closeDate: '05/jul',
  bestDay: '06',
  items: [
    { name: 'Amazon', cat: 'shop', date: '01 jun', installment: '1/3', amount: 149.9 },
    { name: 'iFood', cat: 'food', date: '31 mai', installment: 'à vista', amount: 64.9 },
    { name: 'Netflix', cat: 'subs', date: '30 mai', installment: 'à vista', amount: 55.9 },
    { name: 'Posto Shell', cat: 'transport', date: '29 mai', installment: 'à vista', amount: 180 },
  ],
}

const BUDGETS = [
  { cat: 'food', limit: 2000 },
  { cat: 'home', limit: 2200 },
  { cat: 'transport', limit: 1000 },
  { cat: 'leisure', limit: 800 },
  { cat: 'shop', limit: 500 },
]

const IMPORTS = [
  { raw: 'MERCADOLIVRE*ML12', merchant: 'Mercado Livre', amount: 129.9, cat: 'shop', bankId: 'nu' },
  { raw: 'PG *SPOTIFY BR', merchant: 'Spotify', amount: 21.9, cat: 'subs', bankId: 'nu' },
  { raw: 'DROGASIL 0456', merchant: 'Drogasil', amount: 47.3, cat: 'health', bankId: 'it' },
  { raw: 'POSTO IPIRANGA SP', merchant: 'Posto Ipiranga', amount: 200, cat: 'transport', bankId: 'it' },
  { raw: 'PIX REC JOAO M', merchant: 'Pix recebido', amount: 50, cat: 'other', bankId: 'in' },
]

/** Populates a freshly-registered user with believable demo data. */
export async function seedUserData(userId: string): Promise<void> {
  // Bank links (nu/it/in connected, c6/bb available)
  const linkByBank: Record<string, string> = {}
  for (const b of BANKS) {
    const on = ['nu', 'it', 'in'].includes(b.bankId)
    const link = await prisma.bankLink.create({
      data: {
        userId,
        bankId: b.bankId,
        name: b.name,
        letter: b.letter,
        color: b.color,
        status: on ? 'on' : 'off',
        connectedAt: on ? new Date() : null,
      },
    })
    linkByBank[b.bankId] = link.id
  }

  // Accounts
  const accountByBank: Record<string, string> = {}
  for (const a of ACCOUNTS) {
    const acc = await prisma.account.create({
      data: {
        userId,
        name: a.name,
        kind: a.kind,
        balanceCents: toCents(a.balance),
        letter: a.letter,
        color: a.color,
        bankLinkId: linkByBank[a.bankId],
      },
    })
    accountByBank[a.bankId] = acc.id
  }
  const defaultAccount = accountByBank['it']

  // Transactions: salary + scaled template for Jan–May, curated June
  const txData: {
    userId: string
    accountId: string | null
    name: string
    categoryKey: string | null
    amountCents: number
    date: Date
    source: string
  }[] = []

  for (let m = 1; m <= 5; m++) {
    const mult = MONTH_MULTIPLIER[m] ?? 1
    txData.push({
      userId,
      accountId: accountByBank['it'],
      name: 'Salário',
      categoryKey: 'income',
      amountCents: toCents(8200),
      date: d(m, 5),
      source: 'manual',
    })
    for (const e of TEMPLATE) {
      txData.push({
        userId,
        accountId: defaultAccount,
        name: e.name,
        categoryKey: e.cat,
        amountCents: -toCents(e.amount * mult),
        date: d(m, e.day),
        source: 'manual',
      })
    }
  }

  // June
  txData.push({
    userId,
    accountId: accountByBank['it'],
    name: 'Salário',
    categoryKey: 'income',
    amountCents: toCents(8200),
    date: d(6, 5),
    source: 'manual',
  })
  for (const e of JUNE) {
    txData.push({
      userId,
      accountId: defaultAccount,
      name: e.name,
      categoryKey: e.cat,
      amountCents: -toCents(e.amount),
      date: d(6, e.day),
      source: 'manual',
    })
  }

  await prisma.transaction.createMany({ data: txData })

  // Budgets (June)
  await prisma.budget.createMany({
    data: BUDGETS.map((b) => ({ userId, categoryKey: b.cat, month: '2026-06', limitCents: toCents(b.limit) })),
  })

  // Investments
  await prisma.investment.createMany({
    data: INVESTMENTS.map((iv) => ({
      userId,
      name: iv.name,
      sub: iv.sub,
      valueCents: toCents(iv.value),
      changePct: iv.changePct,
      tag: iv.tag,
      bg: iv.bg,
      fg: iv.fg,
      sort: iv.sort,
    })),
  })

  // Loans
  await prisma.loan.createMany({
    data: LOANS.map((l) => ({
      userId,
      name: l.name,
      bank: l.bank,
      rate: l.rate,
      remainingCents: toCents(l.remaining),
      monthlyCents: toCents(l.monthly),
      paidInstallments: l.paid,
      totalInstallments: l.total,
      sort: l.sort,
    })),
  })

  // Card + items
  const card = await prisma.card.create({
    data: {
      userId,
      name: CARD.name,
      invoiceCents: toCents(CARD.invoice),
      limitCents: toCents(CARD.limit),
      usedCents: toCents(CARD.used),
      dueDate: CARD.dueDate,
      closeDate: CARD.closeDate,
      bestDay: CARD.bestDay,
    },
  })
  await prisma.cardItem.createMany({
    data: CARD.items.map((it) => ({
      cardId: card.id,
      name: it.name,
      categoryKey: it.cat,
      date: it.date,
      installment: it.installment,
      amountCents: toCents(it.amount),
    })),
  })

  // Pending Open Finance imports
  await prisma.importItem.createMany({
    data: IMPORTS.map((i) => ({
      userId,
      raw: i.raw,
      merchant: i.merchant,
      amountCents: -toCents(i.amount),
      categoryKey: i.cat,
      status: 'pending',
      bankId: i.bankId,
    })),
  })
}
