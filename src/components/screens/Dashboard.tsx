import { useFinance } from '../../context/useFinance'
import { ACCOUNTS } from '../../data/finance'
import { m0, m2 } from '../../lib/format'
import { mapBudget } from '../../lib/mapBudget'
import { mapTx } from '../../lib/mapTx'
import { CashflowBars } from '../ui/CashflowBars'
import { ProgressBar } from '../ui/ProgressBar'
import { SpendingDonut } from '../ui/SpendingDonut'

export function Dashboard() {
  const { scen, pv, dens, transactions, imports, go } = useFinance()
  const gap = dens.gap

  const pendingCount = imports.filter((i) => i.status === 'pending').length
  const recentTx = transactions.slice(0, 5).map((t) => mapTx(t, pv))
  const budgetsMini = scen.bdata.slice(0, 3).map(mapBudget)
  const accounts = ACCOUNTS.map((a) => ({ ...a, balance: pv(a.balance) }))

  return (
    <div>
      {/* KPI row */}
      <div
        className="grid grid-cols-2 xl:grid-cols-4"
        style={{ gap, marginBottom: gap }}
      >
        <div className="card-forest p-5">
          <div className="text-xs text-on-dark-soft">Patrimônio total</div>
          <div className="my-[6px] mb-1 text-[27px] font-extrabold tracking-[-0.5px]">
            {pv(m2(scen.patrimonio))}
          </div>
          <div className="text-xs font-semibold" style={{ color: scen.deltaColor }}>
            {scen.delta}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-xs text-muted">Entradas</div>
          <div className="my-[6px] mb-1 text-[27px] font-extrabold tracking-[-0.5px] text-ink">
            {pv(m0(scen.entradas))}
          </div>
          <div className="text-xs font-semibold text-forest-600">{scen.entradasNote}</div>
        </div>

        <div className="card p-5">
          <div className="text-xs text-muted">Saídas</div>
          <div className="my-[6px] mb-1 text-[27px] font-extrabold tracking-[-0.5px] text-ink">
            {pv(m0(scen.saidas))}
          </div>
          <div className="text-xs font-semibold" style={{ color: scen.saidasColor }}>
            {scen.saidasNote}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-xs text-muted">Taxa de poupança</div>
          <div className="my-[6px] mb-1 text-[27px] font-extrabold tracking-[-0.5px] text-ink">
            {scen.savings}
          </div>
          <div className="text-xs font-semibold" style={{ color: scen.savingsColor }}>
            {pv(scen.savingsNote)}
          </div>
        </div>
      </div>

      {/* import banner */}
      {pendingCount > 0 && (
        <button
          type="button"
          onClick={() => go('import')}
          className="mb-[22px] flex w-full items-center gap-[14px] rounded-2xl border border-[#ecdcc6] border-l-4 border-l-warn bg-paper px-[18px] py-[15px] text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fbf0df] text-[17px]">
            ↻
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-ink">
              {pendingCount} transações importadas aguardando revisão
            </div>
            <div className="text-[12.5px] text-muted">
              Sincronizadas automaticamente via Open Finance · confirme as categorias
            </div>
          </div>
          <div className="text-[13px] font-bold text-warn">Revisar →</div>
        </button>
      )}

      {/* two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr]" style={{ gap }}>
        {/* left */}
        <div className="flex flex-col gap-[18px]">
          {/* cashflow */}
          <div className="card p-[22px]">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-[15px] font-bold text-ink">Fluxo de caixa</div>
              <div className="flex gap-4 text-xs">
                <span className="text-ink-3">
                  <span className="mr-[5px] inline-block h-[9px] w-[9px] rounded-sm bg-forest-600" />
                  Entradas
                </span>
                <span className="text-ink-3">
                  <span className="mr-[5px] inline-block h-[9px] w-[9px] rounded-sm bg-sand" />
                  Saídas
                </span>
              </div>
            </div>
            <CashflowBars height={180} barWidth={18} innerGap={6} monthGap={18} labelSize={11} />
          </div>

          {/* recent transactions */}
          <div className="card p-[22px]">
            <div className="mb-[14px] flex items-center justify-between">
              <div className="text-[15px] font-bold text-ink">Transações recentes</div>
              <button
                type="button"
                onClick={() => go('tx')}
                className="text-[13px] font-bold text-forest-600"
              >
                Ver todas
              </button>
            </div>
            <div className="flex flex-col">
              {recentTx.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-[14px] border-b border-line-soft py-[11px] last:border-0"
                >
                  <div
                    className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] text-base"
                    style={{ background: t.catBg }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">{t.name}</div>
                    <div className="text-xs text-faint">
                      {t.account} · {t.date}
                    </div>
                  </div>
                  <span
                    className="rounded-full px-[11px] py-[3px] text-xs font-semibold"
                    style={{ color: t.catColor, background: t.catBg }}
                  >
                    {t.catName}
                  </span>
                  <div
                    className="w-[110px] text-right text-sm font-bold"
                    style={{ color: t.amountColor }}
                  >
                    {t.amountText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col gap-[18px]">
          {/* accounts */}
          <div className="card p-[22px]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[15px] font-bold text-ink">Contas</div>
              <span className="chip bg-[#e3eee6] px-[9px] py-[3px] text-forest-600">
                Open Finance ✓
              </span>
            </div>
            <div className="flex flex-col gap-[15px]">
              {accounts.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-[11px] text-sm font-extrabold text-white"
                    style={{ background: a.color }}
                  >
                    {a.letter}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-semibold text-ink">{a.name}</div>
                    <div className="text-[11.5px] text-faint">{a.kind}</div>
                  </div>
                  <div className="text-sm font-bold text-ink">{a.balance}</div>
                </div>
              ))}
            </div>
          </div>

          {/* spending donut */}
          <div className="card p-[22px]">
            <div className="mb-4 text-[15px] font-bold text-ink">Gastos por categoria</div>
            <SpendingDonut size={108} inner={66} dot={10} wrapGap={18} legendGap={9} />
          </div>

          {/* budget mini */}
          <div className="card p-[22px]">
            <div className="mb-[14px] flex items-center justify-between">
              <div className="text-[15px] font-bold text-ink">Orçamento</div>
              <button
                type="button"
                onClick={() => go('budget')}
                className="text-[13px] font-bold text-forest-600"
              >
                Gerenciar
              </button>
            </div>
            <div className="flex flex-col gap-[13px]">
              {budgetsMini.map((b) => (
                <div key={b.name}>
                  <div className="mb-[5px] flex justify-between text-[12.5px]">
                    <span className="font-semibold text-ink-2">{b.name}</span>
                    <span className="mono" style={{ color: b.textColor }}>
                      {b.spent} / {b.total}
                    </span>
                  </div>
                  <ProgressBar pct={b.pct} color={b.barColor} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
