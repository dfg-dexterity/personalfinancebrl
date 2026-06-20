import type { ApiBudget } from '../api/types'
import { CATS } from '../data/finance'
import type { CategoryKey } from '../types'

export interface BudgetView {
  name: string
  icon: string
  spent: string
  total: string
  pct: string
  barColor: string
  textColor: string
}

/** Budget row → label + progress %, amber near the limit, red when over. */
export function mapBudget(b: ApiBudget): BudgetView {
  const c = CATS[b.cat as CategoryKey]
  const r = b.total > 0 ? b.spent / b.total : 0
  const over = r >= 1
  const warn = r >= 0.9
  return {
    name: c?.name ?? b.cat,
    icon: c?.icon ?? '•',
    spent: 'R$ ' + Math.round(b.spent).toLocaleString('pt-BR'),
    total: 'R$ ' + Math.round(b.total).toLocaleString('pt-BR'),
    pct: Math.min(100, r * 100) + '%',
    barColor: over ? '#c2603a' : warn ? '#d99a3f' : c?.color ?? '#3f7a55',
    textColor: over ? '#c2603a' : warn ? '#b07b2e' : '#6b6759',
  }
}
