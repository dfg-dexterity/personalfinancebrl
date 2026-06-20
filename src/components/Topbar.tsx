import { useAuth } from '../auth/useAuth'
import { useFinance } from '../context/useFinance'
import { TITLES } from '../data/finance'
import type { Density } from '../types'
import { Dropdown } from './ui/Dropdown'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function monthOptions(count = 6): { value: string; label: string }[] {
  const now = new Date()
  const opts: { value: string; label: string }[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    opts.push({ value, label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` })
  }
  return opts
}

const DENS_OPTS: { value: Density; label: string }[] = [
  { value: 'Compacto', label: 'Compacto' },
  { value: 'Confortável', label: 'Confortável' },
  { value: 'Espaçoso', label: 'Espaçoso' },
]

const pill =
  'flex items-center gap-[7px] rounded-xl border border-line bg-paper px-[14px] py-[9px] text-[13px] font-semibold text-ink-2 cursor-pointer hover:border-forest-500 transition-colors'
const iconBtn =
  'flex h-[38px] w-[40px] items-center justify-center rounded-xl border border-line bg-paper text-[15px] hover:border-forest-500 transition-colors'

export function Topbar() {
  const { screen, month, setMonth, privacy, setPrivacy, density, setDensity, go } = useFinance()
  const { user } = useAuth()
  const [title, sub] = TITLES[screen]
  const months = monthOptions()
  const monthLabel = months.find((m) => m.value === month)?.label ?? 'Mês'
  const displaySub = screen === 'dash' && user ? `Bem-vinda de volta, ${user.name.split(' ')[0]}` : sub

  return (
    <header className="flex flex-none items-center gap-[18px] border-b border-line bg-canvas px-9 py-5">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[22px] font-extrabold tracking-[-0.4px] text-ink">{title}</div>
        <div className="truncate text-[13px] text-muted">{displaySub}</div>
      </div>

      <div
        className="hidden items-center gap-2 rounded-xl border border-line bg-paper px-[14px] py-[9px] text-faint lg:flex"
        style={{ width: 240 }}
      >
        <span className="text-sm">⌕</span>
        <span className="text-[13px]">Buscar transação…</span>
      </div>

      <Dropdown<string>
        trigger={
          <span className="flex items-center gap-[7px]">
            📅 {monthLabel} <span className="text-faint">⌄</span>
          </span>
        }
        triggerClassName={pill}
        heading="Mês de referência"
        options={months}
        value={month}
        onChange={setMonth}
        width={210}
      />

      <button
        type="button"
        title={privacy ? 'Mostrar valores' : 'Ocultar valores'}
        onClick={() => setPrivacy(!privacy)}
        className={iconBtn}
      >
        {privacy ? '🙈' : '👁'}
      </button>

      <Dropdown<Density>
        trigger={<span className="text-[15px]">⇕</span>}
        triggerClassName={iconBtn}
        title="Densidade"
        heading="Densidade"
        options={DENS_OPTS}
        value={density}
        onChange={setDensity}
        width={190}
      />

      <button
        type="button"
        onClick={() => go('tx')}
        className="rounded-xl bg-forest-800 px-[18px] py-[10px] text-[13px] font-bold text-white transition-opacity hover:opacity-90"
      >
        + Adicionar
      </button>
    </header>
  )
}
