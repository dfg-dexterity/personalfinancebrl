/** Currency + privacy + date formatting helpers. */

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** Signed currency, e.g. -64.9 -> "− R$ 64,90", 8200 -> "+ R$ 8.200,00" */
export function fmt(v: number): string {
  const neg = v < 0
  const s = Math.abs(v).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return (neg ? '− ' : '+ ') + 'R$ ' + s
}

/** Rounded currency without decimals, e.g. 5640 -> "R$ 5.640" */
export function m0(v: number): string {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR')
}

/** Currency with 2 decimals, e.g. 64847.9 -> "R$ 64.847,90" */
export function m2(v: number): string {
  return (
    'R$ ' +
    v.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

/** Privacy mask: replaces digit runs inside any string mentioning "R$". */
export function maskValue(privacy: boolean, str: string): string {
  return privacy && /R\$/.test(String(str))
    ? String(str).replace(/[\d][\d.,]*/g, '••••')
    : str
}

/** ISO date -> "Hoje" / "Ontem" / "05 jun". */
export function formatDateLabel(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (sameDay(d, now)) return 'Hoje'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (sameDay(d, yesterday)) return 'Ontem'
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}`
}
