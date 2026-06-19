import { REPORT_CATS, SPENDING_DONUT } from '../../data/finance'

interface SpendingDonutProps {
  size: number
  inner: number
  dot: number
  wrapGap: number
  legendGap: number
  centerSize?: number
}

/** Conic-gradient donut + category legend ("Gastos por categoria"). */
export function SpendingDonut({
  size,
  inner,
  dot,
  wrapGap,
  legendGap,
  centerSize = 15,
}: SpendingDonutProps) {
  return (
    <div className="flex items-center" style={{ gap: wrapGap }}>
      <div
        className="flex flex-none items-center justify-center rounded-full"
        style={{ width: size, height: size, background: SPENDING_DONUT }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-full bg-paper"
          style={{ width: inner, height: inner }}
        >
          <div className="font-extrabold text-ink" style={{ fontSize: centerSize }}>
            R$5,6k
          </div>
          <div className="text-[10px] text-muted">total</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col" style={{ gap: legendGap }}>
        {REPORT_CATS.map((c) => (
          <div key={c.name} className="flex items-center gap-[9px] text-[13px]">
            <span
              className="rounded-full"
              style={{ width: dot, height: dot, background: c.color }}
            />
            <span className="flex-1 font-semibold text-ink-2">{c.name}</span>
            <span className="mono text-xs text-muted">{c.pct}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
