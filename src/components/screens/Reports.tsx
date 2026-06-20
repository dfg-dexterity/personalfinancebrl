import { useFinance } from '../../context/useFinance'
import { CashflowBars } from '../ui/CashflowBars'
import { SpendingDonut } from '../ui/SpendingDonut'

export function Reports() {
  const { data } = useFinance()
  if (!data) return null

  const { summary } = data
  const saldo = summary.cashflow.reduce((s, m) => s + (m.in - m.out), 0)
  const saldoText = `${saldo >= 0 ? '+' : '−'}R$ ${Math.round(Math.abs(saldo)).toLocaleString('pt-BR')}`

  return (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[1.4fr_1fr]">
      <div className="card p-6">
        <div className="mb-5 flex justify-between">
          <div className="text-[15px] font-bold text-ink">Entradas vs Saídas · 6 meses</div>
          <span className="text-[13px] font-bold text-forest-600">Saldo {saldoText}</span>
        </div>
        <CashflowBars
          data={summary.cashflow}
          height={220}
          barWidth={20}
          innerGap={7}
          monthGap={22}
          labelSize={12}
        />
      </div>

      <div className="flex flex-col gap-[18px]">
        <div className="card p-6">
          <div className="mb-[18px] text-[15px] font-bold text-ink">Por categoria</div>
          <SpendingDonut
            gradient={summary.donutGradient}
            cats={summary.reportCats}
            total={summary.reportTotal}
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
          <div className="text-sm leading-[1.55] text-[#3f5e4a]">{summary.insight}</div>
        </div>
      </div>
    </div>
  )
}
