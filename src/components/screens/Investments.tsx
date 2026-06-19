import { useFinance } from '../../context/useFinance'
import { INVESTMENTS } from '../../data/finance'
import { m2 } from '../../lib/format'

export function Investments() {
  const { pv } = useFinance()
  const investments = INVESTMENTS.map((iv) => ({ ...iv, value: pv(iv.value) }))

  return (
    <div>
      {/* hero */}
      <div className="card-forest mb-5 flex items-center justify-between p-6">
        <div>
          <div className="text-[13px] text-on-dark-soft">Total investido</div>
          <div className="mt-[5px] text-[30px] font-extrabold">{pv(m2(31090))}</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-semibold text-mint">+ R$ 372 este mês</div>
          <div className="text-[13px] font-semibold text-mint">+1,2%</div>
        </div>
      </div>

      {/* holdings */}
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
              <div className="text-[15px] font-bold text-ink">{iv.value}</div>
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
