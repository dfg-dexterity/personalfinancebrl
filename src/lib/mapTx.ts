import { CATS } from '../data/finance'
import type { Transaction } from '../types'
import { fmt } from './format'

export interface TxView extends Transaction {
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

/**
 * Decorates a raw transaction with icon + category colors and the formatted,
 * privacy-aware amount. Uncategorized rows get the warm "Categorizar" styling.
 */
export function mapTx(t: Transaction, pv: (s: string) => string): TxView {
  const c = t.cat ? CATS[t.cat] : null
  const uncat = c === null
  return {
    ...t,
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
