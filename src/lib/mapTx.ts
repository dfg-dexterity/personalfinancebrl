import type { ApiTransaction } from '../api/types'
import { CATS } from '../data/finance'
import type { CategoryKey } from '../types'
import { fmt, formatDateLabel } from './format'

export interface TxView {
  id: string
  name: string
  account: string
  dateLabel: string
  icon: string
  iconBg: string
  rowBg: string
  catName: string
  catColor: string
  catLabel: string
  catBg: string
  catTextColor: string
  amountText: string
  amountColor: string
}

/** Decorates an API transaction with icon + category colors and a formatted amount. */
export function mapTx(t: ApiTransaction, pv: (s: string) => string): TxView {
  const c = t.cat ? CATS[t.cat as CategoryKey] : null
  const uncat = c === null
  return {
    id: t.id,
    name: t.name,
    account: t.account,
    dateLabel: formatDateLabel(t.date),
    icon: c ? c.icon : '？',
    iconBg: uncat ? '#fbf0df' : c.bg,
    rowBg: uncat ? '#fff7ea' : 'transparent',
    catName: uncat ? '—' : c.name,
    catColor: uncat ? '#b07b2e' : c.color,
    catLabel: uncat ? 'Categorizar' : c.name,
    catBg: uncat ? '#f6e4c5' : c.bg,
    catTextColor: uncat ? '#b07b2e' : c.color,
    amountText: pv(fmt(t.amount)),
    amountColor: t.amount > 0 ? '#3f7a55' : '#26241e',
  }
}
