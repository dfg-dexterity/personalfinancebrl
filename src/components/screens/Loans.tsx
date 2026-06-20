import { useFinance } from '../../context/useFinance'
import { LOANS } from '../../data/finance'
import { m2 } from '../../lib/format'

export function Loans() {
  const { pv } = useFinance()
  const loans = LOANS.map((l) => ({
    ...l,
    remaining: pv(l.remaining),
    monthly: pv(l.monthly),
  }))

  return (
    <div>
      {/* hero (debt = warm brown) */}
      <div className="mb-5 flex items-center justify-between rounded-[20px] bg-[#3a2c22] p-6 text-[#f3ece4]">
        <div>
          <div className="text-[13px] text-[#cbb6a3]">Saldo devedor total</div>
          <div className="mt-[5px] text-[30px] font-extrabold">{pv(m2(18400))}</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-semibold text-[#e7c3a3]">R$ 1.022/mês</div>
          <div className="text-[13px] font-semibold text-[#e7c3a3]">quitação mar/2028</div>
        </div>
      </div>

      {/* loans */}
      <div className="flex flex-col gap-4">
        {loans.map((l) => (
          <div key={l.name} className="card rounded-[18px] p-[22px]">
            <div className="mb-[14px] flex items-start justify-between">
              <div>
                <div className="text-base font-bold text-ink">{l.name}</div>
                <div className="text-[13px] text-muted">
                  {l.bank} · {l.rate}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[17px] font-extrabold text-ink">{l.remaining}</div>
                <div className="text-xs text-muted">restante</div>
              </div>
            </div>
            <div className="h-[9px] overflow-hidden rounded-[5px] bg-track">
              <div
                className="h-full rounded-[5px] bg-[#b08968]"
                style={{ width: l.pct }}
              />
            </div>
            <div className="mt-[10px] flex justify-between text-[13px] text-ink-3">
              <span>{l.paid} parcelas pagas</span>
              <span>{l.monthly}/mês</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
