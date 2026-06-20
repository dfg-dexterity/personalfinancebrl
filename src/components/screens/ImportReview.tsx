import { useFinance } from '../../context/useFinance'
import { CATS } from '../../data/finance'
import { fmt } from '../../lib/format'
import type { CategoryKey } from '../../types'

export function ImportReview() {
  const { data, resolveImport, go } = useFinance()
  if (!data) return null

  const imports = data.imports
  const total = imports.length
  const pending = imports.filter((i) => i.status === 'pending')
  const pendingCount = pending.length
  const addedCount = imports.filter((i) => i.status === 'added').length
  const resolved = total - pendingCount
  const progress = total > 0 ? Math.round((resolved / total) * 100) + '%' : '100%'
  const done = pendingCount === 0

  return (
    <div className="max-w-[760px]">
      <div className="mb-5 h-[9px] overflow-hidden rounded-md bg-track">
        <div
          className="h-full rounded-md bg-forest-600 transition-[width] duration-300"
          style={{ width: progress }}
        />
      </div>

      {!done && (
        <>
          <div className="mb-4 text-sm text-ink-3">
            {pendingCount} pendentes · {addedCount} confirmadas. Confirme a categoria sugerida ou
            pule — decisões viram regras automáticas.
          </div>
          <div className="flex flex-col gap-[13px]">
            {pending.map((i) => {
              const c = CATS[i.cat as CategoryKey] ?? CATS.other
              return (
                <div key={i.id} className="card flex items-center gap-[18px] rounded-[18px] p-[18px]">
                  <div className="min-w-0 flex-1">
                    <div className="mono text-xs text-muted">{i.raw}</div>
                    <div className="mt-[3px] text-[15px] font-bold text-ink">{i.merchant}</div>
                  </div>
                  <div className="hidden items-center gap-[7px] sm:flex">
                    <span className="text-[11px] text-muted">sugerido:</span>
                    <span
                      className="rounded-full px-[11px] py-1 text-xs font-semibold"
                      style={{ color: c.color, background: c.bg }}
                    >
                      {c.icon} {c.name}
                    </span>
                  </div>
                  <div className="w-[110px] text-right text-base font-extrabold text-[#c2603a]">
                    {fmt(i.amount)}
                  </div>
                  <div className="flex gap-[9px]">
                    <button
                      type="button"
                      onClick={() => void resolveImport(i.id, true)}
                      className="rounded-xl bg-forest-800 px-[18px] py-[10px] text-[13px] font-bold text-white transition-opacity hover:opacity-90"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => void resolveImport(i.id, false)}
                      className="rounded-xl bg-line-soft px-4 py-[10px] text-[13px] font-semibold text-ink-3 transition-colors hover:bg-track"
                    >
                      Pular
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {done && (
        <div className="card rounded-[20px] px-5 py-[70px] text-center">
          <div className="mx-auto mb-[18px] flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#dfe9df] text-4xl">
            ✓
          </div>
          <div className="text-xl font-extrabold text-ink">Tudo revisado!</div>
          <div className="mt-[7px] text-sm text-muted">
            {addedCount} transações categorizadas e adicionadas aos seus gastos.
          </div>
          <button
            type="button"
            onClick={() => go('dash')}
            className="mt-[22px] rounded-[13px] bg-forest-800 px-7 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Voltar à visão geral
          </button>
        </div>
      )}
    </div>
  )
}
