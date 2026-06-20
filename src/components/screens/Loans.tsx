import { useFinance } from '../../context/useFinance'
import { m0, m2 } from '../../lib/format'
import { ProgressBar } from '../ui/ProgressBar'

export function Loans() {
  const { data, pv } = useFinance()
  if (!data) return null

  const loans = data.loans
  const total = loans.reduce((s, l) => s + l.remaining, 0)
  const monthly = loans.reduce((s, l) => s + l.monthly, 0)

  return (
    <div>
      <div className="mb-5 flex items-center justify-between rounded-[20px] bg-[#3a2c22] p-6 text-[#f3ece4]">
        <div>
          <div className="text-[13px] text-[#cbb6a3]">Saldo devedor total</div>
          <div className="mt-[5px] text-[30px] font-extrabold">{pv(m2(total))}</div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-semibold text-[#e7c3a3]">
            {pv(m0(monthly))}/mês
          </div>
          <div className="text-[13px] font-semibold text-[#e7c3a3]">
            {loans.length} contrato{loans.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

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
                <div className="text-[17px] font-extrabold text-ink">{pv(m0(l.remaining))}</div>
                <div className="text-xs text-muted">restante</div>
              </div>
            </div>
            <ProgressBar pct={l.pct} color="#b08968" height={9} radius={5} />
            <div className="mt-[10px] flex justify-between text-[13px] text-ink-3">
              <span>{l.paid} parcelas pagas</span>
              <span>{pv(m0(l.monthly))}/mês</span>
            </div>
          </div>
        ))}
        {loans.length === 0 && <div className="card p-6 text-sm text-muted">Sem empréstimos.</div>}
      </div>
    </div>
  )
}
