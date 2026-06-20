import type { ApiCashflow } from '../../api/types'

interface CashflowBarsProps {
  data: ApiCashflow[]
  height: number
  barWidth: number
  innerGap: number
  monthGap: number
  labelSize: number
}

/** Entradas (green) vs Saídas (sand) grouped bar chart, scaled to the period max. */
export function CashflowBars({
  data,
  height,
  barWidth,
  innerGap,
  monthGap,
  labelSize,
}: CashflowBarsProps) {
  const max = Math.max(1, ...data.flatMap((m) => [m.in, m.out]))

  return (
    <div className="flex items-end" style={{ height, gap: monthGap }}>
      {data.map((m) => (
        <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div className="flex h-full w-full items-end justify-center" style={{ gap: innerGap }}>
            <div
              className="rounded-t"
              style={{ width: barWidth, height: `${(m.in / max) * 100}%`, background: '#3f7a55' }}
            />
            <div
              className="rounded-t"
              style={{ width: barWidth, height: `${(m.out / max) * 100}%`, background: '#d9bba6' }}
            />
          </div>
          <span className="text-faint" style={{ fontSize: labelSize }}>
            {m.label}
          </span>
        </div>
      ))}
    </div>
  )
}
