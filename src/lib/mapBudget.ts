import { CATS } from '../data/finance'
import type { BudgetDatum } from '../types'

export interface BudgetView {
  name: string
  icon: string
  spent: string
  total: string
  pct: string
  barColor: string
  textColor: string
}

/** Budget row → label + progress %, turning amber at 90% and red when over. */
export function mapBudget(b: BudgetDatum): BudgetView {
  const c = CATS[b.cat]
  const r = b.spent / b.total
  const over = r >= 1
  const warn = r >= 0.9
  return {
    name: c.name,
    icon: c.icon,
    spent: 'R$ ' + b.spent.toLocaleString('pt-BR'),
    total: 'R$ ' + b.total.toLocaleString('pt-BR'),
    pct: Math.min(100, r * 100) + '%',
    barColor: over ? '#c2603a' : warn ? '#d99a3f' : c.color,
    textColor: over ? '#c2603a' : warn ? '#b07b2e' : '#6b6759',
  }
}
