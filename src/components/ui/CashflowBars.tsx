import { useFinance } from '../../context/useFinance'
import { MONTH_LABELS } from '../../data/finance'

interface CashflowBarsProps {
  height: number
  barWidth: number
  innerGap: number
  monthGap: number
  labelSize: number
}

/** Entradas (green) vs Saídas (sand) grouped bar chart, driven by the scenario. */
export function CashflowBars({
  height,
  barWidth,
  innerGap,
  monthGap,
  labelSize,
}: CashflowBarsProps) {
  const { scen } = useFinance()
  const months = scen.in.map((v, i) => ({
    label: MONTH_LABELS[i],
    inH: v,
    outH: scen.out[i],
  }))

  return (
    <div className="flex items-end" style={{ height, gap: monthGap }}>
      {months.map((m) => (
        <div
          key={m.label}
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
        >
          <div
            className="flex h-full w-full items-end justify-center"
            style={{ gap: innerGap }}
          >
            <div
              className="rounded-t"
              style={{ width: barWidth, height: `${m.inH}%`, background: '#3f7a55' }}
            />
            <div
              className="rounded-t"
              style={{ width: barWidth, height: `${m.outH}%`, background: '#d9bba6' }}
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
