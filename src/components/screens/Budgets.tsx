import { useFinance } from '../../context/useFinance'
import { m0 } from '../../lib/format'
import { mapBudget } from '../../lib/mapBudget'
import { ProgressBar } from '../ui/ProgressBar'

export function Budgets() {
  const { scen, pv, privacy } = useFinance()

  const avail = scen.bTotal - scen.bSpent
  const ratio = scen.bSpent / scen.bTotal
  const hero = {
    spent: pv(m0(scen.bSpent)),
    total: privacy ? '••••' : scen.bTotal.toLocaleString('pt-BR'),
    pct: Math.min(100, Math.round(ratio * 100)) + '%',
    barColor: scen.bSpent >= scen.bTotal ? '#f0b59b' : ratio >= 0.9 ? '#e8c98f' : '#9ee6b5',
    available: pv(
      avail < 0
        ? '− R$ ' + Math.abs(avail).toLocaleString('pt-BR')
        : 'R$ ' + avail.toLocaleString('pt-BR'),
    ),
    availColor: avail < 0 ? '#c2603a' : '#26241e',
    projection: pv(m0(scen.proj)),
    projColor: scen.projColor,
    projNote: scen.projNote,
  }

  const budgets = scen.bdata.map(mapBudget)

  return (
    <div>
      {/* hero cards */}
      <div className="mb-[22px] grid grid-cols-1 gap-[18px] md:grid-cols-3">
        <div className="card-forest p-[22px]">
          <div className="text-[13px] text-on-dark-soft">Total gasto</div>
          <div className="my-[6px] mb-3 text-[26px] font-extrabold">
            {hero.spent} <span className="text-[15px] opacity-60">/ {hero.total}</span>
          </div>
          <div className="h-[9px] rounded-md bg-white/[0.15]">
            <div
              className="h-full rounded-md"
              style={{ width: hero.pct, background: hero.barColor }}
            />
          </div>
        </div>

        <div className="card p-[22px]">
          <div className="text-[13px] text-muted">Disponível</div>
          <div className="mt-[6px] text-[26px] font-extrabold" style={{ color: hero.availColor }}>
            {hero.available}
          </div>
          <div className="mt-[6px] text-xs text-muted">para 11 dias</div>
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

      {/* budgets by category */}
      <div className="card p-6">
        <div className="mb-5 text-[15px] font-bold text-ink">Orçamentos por categoria</div>
        <div className="flex flex-col gap-5">
          {budgets.map((b) => (
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
