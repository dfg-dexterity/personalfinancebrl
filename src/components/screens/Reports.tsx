import { useFinance } from '../../context/useFinance'
import { CashflowBars } from '../ui/CashflowBars'
import { SpendingDonut } from '../ui/SpendingDonut'

export function Reports() {
  const { scen } = useFinance()

  return (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[1.4fr_1fr]">
      {/* cashflow over 6 months */}
      <div className="card p-6">
        <div className="mb-5 flex justify-between">
          <div className="text-[15px] font-bold text-ink">Entradas vs Saídas · 6 meses</div>
          <span className="text-[13px] font-bold text-forest-600">Saldo +R$ 15.360</span>
        </div>
        <CashflowBars height={220} barWidth={20} innerGap={7} monthGap={22} labelSize={12} />
      </div>

      {/* right column */}
      <div className="flex flex-col gap-[18px]">
        <div className="card p-6">
          <div className="mb-[18px] text-[15px] font-bold text-ink">Por categoria · junho</div>
          <SpendingDonut
            size={120}
            inner={72}
            dot={11}
            wrapGap={20}
            legendGap={10}
            centerSize={16}
          />
        </div>

        <div className="flex items-start gap-[13px] rounded-[20px] border border-[#d7e6da] bg-[#eef3ee] p-5">
          <span className="text-xl">💡</span>
          <div className="text-sm leading-[1.55] text-[#3f5e4a]">{scen.insight}</div>
        </div>
      </div>
    </div>
  )
}
