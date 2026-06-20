import { useFinance } from '../../context/useFinance'
import type { TxFilter } from '../../context/finance-context'
import { mapTx } from '../../lib/mapTx'

const FILTERS: { key: TxFilter; label: string }[] = [
  { key: 'all', label: 'Tudo' },
  { key: 'uncat', label: 'Sem categoria' },
  { key: 'food', label: '🍽 Alimentação' },
  { key: 'transport', label: '🚗 Transporte' },
  { key: 'subs', label: '📺 Assinaturas' },
]

export function Transactions() {
  const { data, txFilter, setTxFilter, pv, openPicker } = useFinance()
  if (!data) return null

  let list = data.transactions
  if (txFilter === 'uncat') list = list.filter((t) => !t.cat)
  else if (txFilter !== 'all') list = list.filter((t) => t.cat === txFilter)
  const visibleTx = list.map((t) => mapTx(t, pv))

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap gap-2 border-b border-line-soft px-[22px] py-[18px]">
        {FILTERS.map((f) => {
          const active = txFilter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setTxFilter(f.key)}
              className="rounded-full border px-[15px] py-2 text-[13px] font-semibold transition-colors"
              style={{
                background: active ? '#1f3d2b' : '#fff',
                color: active ? '#fff' : '#6b6759',
                borderColor: active ? '#1f3d2b' : '#e9e7df',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center border-b border-line-soft px-[22px] py-[11px] text-[11px] font-semibold uppercase tracking-[0.5px] text-faint">
        <div className="flex-1">Descrição</div>
        <div className="w-[160px]">Categoria</div>
        <div className="w-[140px]">Conta</div>
        <div className="w-[90px]">Data</div>
        <div className="w-[120px] text-right">Valor</div>
      </div>

      {visibleTx.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => openPicker(t.id)}
          className="flex w-full items-center border-b border-line-faint px-[22px] py-[14px] text-left transition-colors last:border-0 hover:brightness-[0.98]"
          style={{ background: t.rowBg }}
        >
          <div className="flex flex-1 items-center gap-[13px]">
            <div
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] text-base"
              style={{ background: t.iconBg }}
            >
              {t.icon}
            </div>
            <span className="text-sm font-semibold text-ink">{t.name}</span>
          </div>
          <div className="w-[160px]">
            <span
              className="rounded-full px-[11px] py-1 text-xs font-semibold"
              style={{ color: t.catTextColor, background: t.catBg }}
            >
              {t.catLabel}
            </span>
          </div>
          <div className="w-[140px] text-[13px] text-ink-3">{t.account}</div>
          <div className="w-[90px] text-[13px] text-faint">{t.dateLabel}</div>
          <div className="w-[120px] text-right text-sm font-bold" style={{ color: t.amountColor }}>
            {t.amountText}
          </div>
        </button>
      ))}

      {visibleTx.length === 0 && (
        <div className="px-[22px] py-16 text-center text-sm text-muted">
          Nenhuma transação nesse filtro.
        </div>
      )}
    </div>
  )
}
