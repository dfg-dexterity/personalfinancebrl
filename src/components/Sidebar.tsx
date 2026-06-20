import { useAuth } from '../auth/useAuth'
import { useFinance } from '../context/useFinance'
import { NAV_DEF } from '../data/finance'

export function Sidebar() {
  const { user, logout } = useAuth()
  const { screen, go, data } = useFinance()
  const pendingCount = data ? data.imports.filter((i) => i.status === 'pending').length : 0

  return (
    <aside className="flex w-[252px] flex-none flex-col bg-forest-900 px-4 py-6 text-side-text">
      <div className="flex items-center gap-[11px] px-[10px] pb-[26px] pt-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-mint text-[17px] font-extrabold text-forest-900">
          f
        </div>
        <div className="text-[17px] font-extrabold tracking-[-0.3px] text-white">finanças</div>
      </div>

      <nav className="flex flex-1 flex-col gap-[3px]">
        {NAV_DEF.map((n) => {
          const active = screen === n.key
          const showBadge = n.key === 'import' && pendingCount > 0
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => go(n.key)}
              className={`flex items-center gap-3 rounded-xl px-[13px] py-[11px] text-left text-sm transition-colors ${
                active
                  ? 'bg-white/10 font-bold text-white'
                  : 'font-medium text-side-item hover:bg-white/[0.05]'
              }`}
            >
              <span className={`w-5 text-center text-base ${active ? 'opacity-100' : 'opacity-70'}`}>
                {n.icon}
              </span>
              <span className="flex-1">{n.label}</span>
              {showBadge && (
                <span className="rounded-full bg-warn px-2 py-[1px] text-[11px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-4 flex items-center gap-[11px] rounded-2xl bg-white/[0.06] p-[13px]">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-mint text-sm font-extrabold text-forest-900">
          {user?.initials || 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-bold text-white">{user?.name ?? 'Usuário'}</div>
          <div className="text-[11px] text-side-muted">Plano {user?.plan ?? 'Free'}</div>
        </div>
        <button
          type="button"
          onClick={logout}
          title="Sair da conta"
          className="text-base text-side-muted transition-colors hover:text-white"
        >
          ⎋
        </button>
      </div>
    </aside>
  )
}
