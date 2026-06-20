import { useFinance } from '../../context/useFinance'
import { m0, m2 } from '../../lib/format'

export function Investments() {
  const { data, pv } = useFinance()
  if (!data) return null

  const investments = data.investments
  const total = investments.reduce((s, iv) => s + iv.value, 0)
  const monthChange = investments.reduce((s, iv) => s + (iv.value * iv.changePct) / 100, 0)
  const monthPct = total > 0 ? (monthChange / total) * 100 : 0
  const up = monthChange >= 0
  const changeColor = up ? 'text-mint' : 'text-[#f0b59b]'

  return (
    <div>
      <div className="card-forest mb-5 flex items-center justify-between p-6">
        <div>
          <div className="text-[13px] text-on-dark-soft">Total investido</div>
          <div className="mt-[5px] text-[30px] font-extrabold">{pv(m2(total))}</div>
        </div>
        <div className="text-right">
          <div className={`text-[13px] font-semibold ${changeColor}`}>
            {up ? '+ ' : '− '}
            {pv('R$ ' + Math.round(Math.abs(monthChange)).toLocaleString('pt-BR'))} este mês
          </div>
          <div className={`text-[13px] font-semibold ${changeColor}`}>
            {up ? '+' : '−'}
            {Math.abs(monthPct).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {investments.map((iv) => (
          <div key={iv.name} className="card flex items-center gap-[15px] rounded-[18px] p-5">
            <div
              className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] text-sm font-extrabold"
              style={{ background: iv.bg, color: iv.fg }}
            >
              {iv.tag}
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-bold text-ink">{iv.name}</div>
              <div className="text-[12.5px] text-muted">{iv.sub}</div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-bold text-ink">{pv(m0(iv.value))}</div>
              <div className="text-[13px] font-semibold" style={{ color: iv.changeColor }}>
                {iv.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
