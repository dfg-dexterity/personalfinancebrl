/**
 * Currency + privacy formatting helpers.
 * Ported 1:1 from the "Finanças Web" design logic so values render identically.
 */

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

/**
 * Privacy mask: when enabled, replaces digit runs inside any string that
 * mentions "R$" with bullets — mirrors the design's `pv()` helper.
 */
export function maskValue(privacy: boolean, str: string): string {
  return privacy && /R\$/.test(String(str))
    ? String(str).replace(/[\d][\d.,]*/g, '••••')
    : str
}
