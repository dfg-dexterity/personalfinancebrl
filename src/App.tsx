import { CategoryPickerModal } from './components/CategoryPickerModal'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Budgets } from './components/screens/Budgets'
import { Cards } from './components/screens/Cards'
import { Connections } from './components/screens/Connections'
import { Dashboard } from './components/screens/Dashboard'
import { ImportReview } from './components/screens/ImportReview'
import { Investments } from './components/screens/Investments'
import { Loans } from './components/screens/Loans'
import { Reports } from './components/screens/Reports'
import { Transactions } from './components/screens/Transactions'
import { useFinance } from './context/useFinance'
import type { ComponentType } from 'react'
import type { ScreenKey } from './types'

const SCREENS: Record<ScreenKey, ComponentType> = {
  dash: Dashboard,
  tx: Transactions,
  budget: Budgets,
  card: Cards,
  invest: Investments,
  loan: Loans,
  report: Reports,
  import: ImportReview,
  connect: Connections,
}

export default function App() {
  const { screen, dens } = useFinance()
  const Screen = SCREENS[screen]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main key={screen} className="sb flex-1 animate-fadeUp overflow-y-auto" style={{ padding: dens.pad }}>
          <Screen />
        </main>
      </div>
      <CategoryPickerModal />
    </div>
  )
}
