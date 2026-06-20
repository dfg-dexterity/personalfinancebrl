import { CATEGORIES } from './data/catalog'
import { toReais } from './money'
import { prisma } from './prisma'

const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const CAT_BY_KEY = new Map(CATEGORIES.map((c) => [c.key as string, c]))

function bounds(month: string) {
  const [y, m] = month.split('-').map(Number)
  return { y, m, start: new Date(Date.UTC(y, m - 1, 1)), end: new Date(Date.UTC(y, m, 1)) }
}

const pctInt = (n: number) => `${Math.round(n)}%`
const oneDecimal = (n: number) =>
  Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const signedPct = (n: number) => `${n >= 0 ? '+' : '−'}${oneDecimal(n)}%`

function compactBRL(reais: number): string {
  if (Math.abs(reais) >= 1000) return `R$${oneDecimal(reais / 1000)}k`
  return `R$${Math.round(reais)}`
}

export async function buildBootstrap(userId: string, month: string) {
  const { y, m, start, end } = bounds(month)
  const sixStart = new Date(Date.UTC(y, m - 6, 1))

  const [user, accounts, monthTx, windowTx, prevAgg, budgets, investments, loans, card, links, imports] =
    await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.account.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: start, lt: end } },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        include: { account: true },
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: sixStart, lt: end } },
        select: { amountCents: true, date: true },
      }),
      prisma.transaction.aggregate({
        _sum: { amountCents: true },
        where: { userId, amountCents: { lt: 0 }, date: { gte: new Date(Date.UTC(y, m - 2, 1)), lt: start } },
      }),
      prisma.budget.findMany({ where: { userId, month } }),
      prisma.investment.findMany({ where: { userId }, orderBy: { sort: 'asc' } }),
      prisma.loan.findMany({ where: { userId }, orderBy: { sort: 'asc' } }),
      prisma.card.findFirst({ where: { userId }, include: { items: true } }),
      prisma.bankLink.findMany({ where: { userId } }),
      prisma.importItem.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    ])

  // ---- KPIs ----
  let entradas = 0
  let saidas = 0
  const spendByCat: Record<string, number> = {}
  let totalSpend = 0
  for (const t of monthTx) {
    const r = toReais(t.amountCents)
    if (r > 0) entradas += r
    else {
      saidas += -r
      if (t.categoryKey) {
        spendByCat[t.categoryKey] = (spendByCat[t.categoryKey] ?? 0) - r
        totalSpend += -r
      }
    }
  }

  const accTotal = accounts.reduce((s, a) => s + toReais(a.balanceCents), 0)
  const invTotal = investments.reduce((s, i) => s + toReais(i.valueCents), 0)
  const loanTotal = loans.reduce((s, l) => s + toReais(l.remainingCents), 0)
  const patrimonio = accTotal + invTotal - loanTotal

  const savingsAmount = entradas - saidas
  const savingsRate = entradas > 0 ? savingsAmount / entradas : 0
  const savingsPct = Math.round(savingsRate * 100)
  const budgetLimit = budgets.reduce((s, b) => s + toReais(b.limitCents), 0)
  const saidasPctBudget = budgetLimit > 0 ? Math.round((saidas / budgetLimit) * 100) : 0
  const deltaRate = patrimonio > 0 ? (savingsAmount / patrimonio) * 100 : 0

  // ---- cash-flow (6 months) ----
  const cashflow = []
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(Date.UTC(y, m - 1 - i, 1))
    const yy = dt.getUTCFullYear()
    const mm = dt.getUTCMonth()
    let inc = 0
    let out = 0
    for (const t of windowTx) {
      if (t.date.getUTCFullYear() === yy && t.date.getUTCMonth() === mm) {
        const r = toReais(t.amountCents)
        if (r > 0) inc += r
        else out += -r
      }
    }
    cashflow.push({ label: MONTH_LABELS[mm], in: inc, out })
  }

  // ---- category breakdown + donut ----
  const sorted = Object.entries(spendByCat).sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, 5)
  const restSum = sorted.slice(5).reduce((s, [, v]) => s + v, 0)
  const slices = top.map(([key, amount]) => {
    const c = CAT_BY_KEY.get(key)
    return { name: c?.name ?? key, color: c?.color ?? '#8a8678', amount }
  })
  if (restSum > 0) slices.push({ name: 'Outros', color: '#8a8678', amount: restSum })

  let acc = 0
  const stops: string[] = []
  const reportCats = slices.map((s) => {
    const pct = totalSpend > 0 ? (s.amount / totalSpend) * 100 : 0
    const startPct = acc
    acc += pct
    stops.push(`${s.color} ${startPct.toFixed(1)}% ${acc.toFixed(1)}%`)
    return { name: s.name, color: s.color, pct: pctInt(pct) }
  })
  const donutGradient = stops.length ? `conic-gradient(${stops.join(',')})` : 'conic-gradient(#e6e3d8 0 100%)'

  // ---- insight ----
  const prevSpend = -toReais(prevAgg._sum.amountCents ?? 0)
  const topName = slices[0]?.name
  let insight: string
  if (prevSpend > 0) {
    const diff = totalSpend - prevSpend
    const pct = Math.round((Math.abs(diff) / prevSpend) * 100)
    insight =
      diff <= 0
        ? `Boa! Você gastou ${pct}% menos que no mês passado.`
        : `Atenção: seus gastos subiram ${pct}% em relação ao mês passado.`
  } else {
    insight = 'Conecte mais contas via Open Finance para enriquecer seus relatórios.'
  }
  if (topName) insight += ` Maior categoria: ${topName}.`

  // ---- serialize ----
  const order = new Map(CATEGORIES.map((c, i) => [c.key as string, i]))
  return {
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan, initials: user.initials },
    month,
    categories: CATEGORIES.map((c) => ({ key: c.key, name: c.name, icon: c.icon, color: c.color, bg: c.bg })),
    accounts: accounts.map((a) => ({
      id: a.id,
      name: a.name,
      kind: a.kind,
      balance: toReais(a.balanceCents),
      letter: a.letter,
      color: a.color,
    })),
    transactions: monthTx.map((t) => ({
      id: t.id,
      name: t.name,
      cat: t.categoryKey,
      amount: toReais(t.amountCents),
      account: t.account?.name ?? '',
      date: t.date.toISOString(),
    })),
    budgets: budgets
      .map((b) => ({ cat: b.categoryKey, spent: spendByCat[b.categoryKey] ?? 0, total: toReais(b.limitCents) }))
      .sort((a, b) => (order.get(a.cat) ?? 99) - (order.get(b.cat) ?? 99)),
    summary: {
      patrimonio,
      delta: `${savingsAmount >= 0 ? '↑' : '↓'} ${oneDecimal(deltaRate)}% no mês`,
      deltaColor: savingsAmount >= 0 ? '#9ee6b5' : '#f0b59b',
      entradas,
      entradasNote: '↑ salário + extras',
      saidas,
      saidasNote: `${saidasPctBudget}% do orçamento`,
      saidasColor: saidasPctBudget > 100 ? '#c2603a' : saidasPctBudget >= 90 ? '#b07b2e' : '#3f7a55',
      savings: `${savingsPct < 0 ? '−' : ''}${Math.abs(savingsPct)}%`,
      savingsNote:
        savingsAmount >= 0
          ? `R$ ${Math.round(savingsAmount).toLocaleString('pt-BR')} guardados`
          : `R$ ${Math.round(-savingsAmount).toLocaleString('pt-BR')} no vermelho`,
      savingsColor: savingsAmount >= 0 ? '#3f7a55' : '#c2603a',
      cashflow,
      reportCats,
      donutGradient,
      reportTotal: compactBRL(totalSpend),
      insight,
    },
    connections: links
      .slice()
      .sort((a, b) => a.bankId.localeCompare(b.bankId))
      .map((l) => ({ bankId: l.bankId, name: l.name, letter: l.letter, color: l.color, status: l.status })),
    imports: imports.map((i) => ({
      id: i.id,
      raw: i.raw,
      merchant: i.merchant,
      amount: toReais(i.amountCents),
      cat: i.categoryKey,
      status: i.status,
    })),
    investments: investments.map((iv) => ({
      name: iv.name,
      sub: iv.sub,
      value: toReais(iv.valueCents),
      change: signedPct(iv.changePct),
      changePct: iv.changePct,
      changeColor: iv.changePct >= 0 ? '#3f7a55' : '#c2603a',
      tag: iv.tag,
      bg: iv.bg,
      fg: iv.fg,
    })),
    loans: loans.map((l) => ({
      name: l.name,
      bank: l.bank,
      rate: l.rate,
      remaining: toReais(l.remainingCents),
      monthly: toReais(l.monthlyCents),
      paid: `${l.paidInstallments}/${l.totalInstallments}`,
      pct: pctInt((l.paidInstallments / l.totalInstallments) * 100),
    })),
    card: card
      ? {
          name: card.name,
          invoice: toReais(card.invoiceCents),
          limit: toReais(card.limitCents),
          used: toReais(card.usedCents),
          dueDate: card.dueDate,
          closeDate: card.closeDate,
          bestDay: card.bestDay,
          items: card.items.map((it) => ({
            name: it.name,
            cat: it.categoryKey,
            date: it.date,
            installment: it.installment,
            amount: toReais(it.amountCents),
          })),
        }
      : null,
  }
}
