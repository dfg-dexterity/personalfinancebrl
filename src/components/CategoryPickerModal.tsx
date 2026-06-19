import { useFinance } from '../context/useFinance'
import { CATS, PICKER_CATEGORIES } from '../data/finance'

export function CategoryPickerModal() {
  const { picker, transactions, setCat, closePicker } = useFinance()
  if (picker == null) return null

  const tx = transactions.find((t) => t.id === picker)

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fadeUp items-center justify-center bg-[rgba(28,31,26,0.4)]"
      onClick={closePicker}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[480px] max-w-[calc(100vw-32px)] rounded-[22px] bg-canvas p-[26px] shadow-[0_30px_80px_-20px_rgba(28,31,26,0.5)]"
      >
        <div className="text-[13px] text-muted">{tx?.name ?? ''}</div>
        <div className="mb-[18px] text-[19px] font-extrabold text-ink">
          Escolher categoria
        </div>
        <div className="grid grid-cols-2 gap-[11px]">
          {PICKER_CATEGORIES.map((k) => {
            const c = CATS[k]
            return (
              <button
                key={k}
                type="button"
                onClick={() => setCat(picker, k)}
                className="flex items-center gap-[11px] rounded-[14px] border border-line bg-paper p-[14px] text-left transition-colors hover:border-forest-500"
              >
                <div
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-base"
                  style={{ background: c.bg }}
                >
                  {c.icon}
                </div>
                <span className="text-sm font-semibold text-ink">{c.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
