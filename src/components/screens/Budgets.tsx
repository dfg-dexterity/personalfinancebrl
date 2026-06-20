import { useFinance } from '../../context/useFinance'
import { m0 } from '../../lib/format'
import { mapBudget } from '../../lib/mapBudget'
import { ProgressBar } from '../ui/ProgressBar'

export function Budgets() {
  const { data, pv, privacy } = useFinance()
  if (!data) return null

  const { budgets } = data
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)
  const totalLimit = budgets.reduce((s, b) => s + b.total, 0)
  const avail = totalLimit - totalSpent
  const ratio = totalLimit > 0 ? totalSpent / totalLimit : 0

  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const projection = Math.round((totalSpent / Math.max(1, now.getDate())) * daysInMonth)
  const willOverrun = projection > totalLimit

  const hero = {
    spent: pv(m0(totalSpent)),
    total: privacy ? '••••' : Math.round(totalLimit).toLocaleString('pt-BR'),
    pct: Math.min(100, Math.round(ratio * 100)) + '%',
    barColor: ratio >= 1 ? '#f0b59b' : ratio >= 0.9 ? '#e8c98f' : '#9ee6b5',
    available: pv(
      avail < 0
        ? '− R$ ' + Math.round(Math.abs(avail)).toLocaleString('pt-BR')
        : 'R$ ' + Math.round(avail).toLocaleString('pt-BR'),
    ),
    availColor: avail < 0 ? '#c2603a' : '#26241e',
    projection: pv(m0(projection)),
    projColor: willOverrun ? '#c2603a' : '#3f7a55',
    projNote: willOverrun ? 'pode estourar o limite' : 'dentro do limite ✓',
  }

  const rows = budgets.map(mapBudget)

  return (
    <div>
      <div className="mb-[22px] grid grid-cols-1 gap-[18px] md:grid-cols-3">
        <div className="card-forest p-[22px]">
          <div className="text-[13px] text-on-dark-soft">Total gasto</div>
          <div className="my-[6px] mb-3 text-[26px] font-extrabold">
            {hero.spent} <span className="text-[15px] opacity-60">/ {hero.total}</span>
          </div>
          <div className="h-[9px] rounded-md bg-white/[0.15]">
            <div className="h-full rounded-md" style={{ width: hero.pct, background: hero.barColor }} />
          </div>
        </div>

        <div className="card p-[22px]">
          <div className="text-[13px] text-muted">Disponível</div>
          <div className="mt-[6px] text-[26px] font-extrabold" style={{ color: hero.availColor }}>
            {hero.available}
          </div>
          <div className="mt-[6px] text-xs text-muted">para {daysInMonth - now.getDate()} dias</div>
        </div>

        <div className="card p-[22px]">
          <div className="text-[13px] text-muted">Projeção do mês</div>
          <div className="mt-[6px] text-[26px] font-extrabold" style={{ color: hero.projColor }}>
            {hero.projection}
          </div>
          <div className="mt-[6px] text-xs" style={{ color: hero.projColor }}>
            {hero.projNote}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-5 text-[15px] font-bold text-ink">Orçamentos por categoria</div>
        <div className="flex flex-col gap-5">
          {rows.map((b) => (
            <div key={b.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">
                  {b.icon} {b.name}
                </span>
                <span className="mono text-[13px]" style={{ color: b.textColor }}>
                  {b.spent} / {b.total}
                </span>
              </div>
              <ProgressBar pct={b.pct} color={b.barColor} height={10} radius={6} />
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-sm text-muted">Nenhum orçamento definido para este mês.</div>
          )}
        </div>
        <button
          type="button"
          className="mt-[22px] w-full rounded-2xl border-[1.5px] border-dashed border-[#cfcdc1] p-[15px] text-center text-[13px] text-muted transition-colors hover:border-forest-500 hover:text-ink-3"
        >
          + Criar novo orçamento
        </button>
      </div>
    </div>
  )
}
