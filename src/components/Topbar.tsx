import { useFinance } from '../context/useFinance'
import { TITLES } from '../data/finance'
import type { Density, Scenario } from '../types'
import { Dropdown } from './ui/Dropdown'

const SCEN_OPTS: { value: Scenario; label: string; hint: string }[] = [
  { value: 'Mês tranquilo', label: 'Mês tranquilo', hint: '· sobra' },
  { value: 'Mês apertado', label: 'Mês apertado', hint: '· no limite' },
  { value: 'Mês cheio', label: 'Mês cheio', hint: '· estourou' },
]

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
  const { screen, scenario, setScenario, privacy, setPrivacy, density, setDensity, go } =
    useFinance()
  const [title, sub] = TITLES[screen]

  return (
    <header className="flex flex-none items-center gap-[18px] border-b border-line bg-canvas px-9 py-5">
      <div className="min-w-0 flex-1">
        <div className="truncate text-[22px] font-extrabold tracking-[-0.4px] text-ink">
          {title}
        </div>
        <div className="truncate text-[13px] text-muted">{sub}</div>
      </div>

      {/* search (visual, matches design) */}
      <div
        className="hidden items-center gap-2 rounded-xl border border-line bg-paper px-[14px] py-[9px] text-faint lg:flex"
        style={{ width: 240 }}
      >
        <span className="text-sm">⌕</span>
        <span className="text-[13px]">Buscar transação…</span>
      </div>

      {/* scenario selector (the "month") */}
      <Dropdown<Scenario>
        trigger={
          <span className="flex items-center gap-[7px]">
            📅 Junho 2026 <span className="text-faint">⌄</span>
          </span>
        }
        triggerClassName={pill}
        heading="Como foi o mês?"
        options={SCEN_OPTS}
        value={scenario}
        onChange={setScenario}
        width={230}
      />

      {/* privacy toggle */}
      <button
        type="button"
        title={privacy ? 'Mostrar valores' : 'Ocultar valores'}
        onClick={() => setPrivacy(!privacy)}
        className={iconBtn}
      >
        {privacy ? '🙈' : '👁'}
      </button>

      {/* density selector */}
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
