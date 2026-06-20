import { useFinance } from '../../context/useFinance'
import { CATS } from '../../data/finance'
import { m0, m2 } from '../../lib/format'
import type { CategoryKey } from '../../types'

export function Cards() {
  const { data, pv } = useFinance()
  if (!data) return null

  const card = data.card
  if (!card) {
    return <div className="card p-6 text-sm text-muted">Nenhum cartão cadastrado.</div>
  }

  const usedPct = card.limit > 0 ? Math.round((card.used / card.limit) * 100) : 0
  const items = card.items.map((it) => ({
    ...it,
    icon: CATS[it.cat as CategoryKey]?.icon ?? '•',
    catBg: CATS[it.cat as CategoryKey]?.bg ?? '#eceae2',
  }))

  return (
    <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[340px_1fr]">
      <div className="flex flex-col gap-4">
        <div className="relative h-[200px] overflow-hidden rounded-[22px] bg-gradient-to-br from-forest-700 to-[#1a2f22] p-6 text-on-dark">
          <div className="absolute -bottom-[50px] -right-[30px] h-[170px] w-[170px] rounded-full bg-mint/[0.08]" />
          <div className="flex justify-between">
            <span className="text-[13px] text-on-dark-soft">Fatura atual</span>
            <span className="text-[13px] text-on-dark-soft">Vence {card.dueDate}</span>
          </div>
          <div className="mt-2 text-[32px] font-extrabold">{pv(m2(card.invoice))}</div>
          <div className="absolute inset-x-6 bottom-6">
            <div className="h-[7px] rounded-[5px] bg-white/[0.18]">
              <div className="h-full rounded-[5px] bg-mint" style={{ width: `${usedPct}%` }} />
            </div>
            <div className="mt-[9px] flex justify-between text-xs text-on-dark-soft">
              <span>Limite usado</span>
              <span>
                {pv(m0(card.used))} / {pv(m0(card.limit))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="card flex-1 rounded-2xl p-[14px] text-center">
            <div className="text-[11px] text-muted">Fecha</div>
            <div className="text-[15px] font-bold text-ink">{card.closeDate}</div>
          </div>
          <div className="card flex-1 rounded-2xl p-[14px] text-center">
            <div className="text-[11px] text-muted">Melhor dia</div>
            <div className="text-[15px] font-bold text-forest-600">{card.bestDay}</div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 text-[15px] font-bold text-ink">Lançamentos da fatura</div>
        <div className="flex flex-col">
          {items.map((t) => (
            <div
              key={t.name + t.date}
              className="flex items-center gap-[14px] border-b border-line-faint py-[13px] last:border-0"
            >
              <div
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] text-base"
                style={{ background: t.catBg }}
              >
                {t.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-faint">
                  {t.date} · {t.installment}
                </div>
              </div>
              <div className="text-sm font-bold text-ink">{pv(m2(t.amount))}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
