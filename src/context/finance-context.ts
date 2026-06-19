import { createContext } from 'react'
import type {
  BankId,
  BankStatusMap,
  CategoryKey,
  Density,
  ImportItem,
  Scenario,
  ScenarioData,
  ScreenKey,
  Transaction,
} from '../types'

export type TxFilter = CategoryKey | 'all' | 'uncat'

export interface FinanceContextValue {
  // navigation + ui state
  screen: ScreenKey
  picker: number | null
  txFilter: TxFilter
  bankStatus: BankStatusMap
  connecting: BankId | null
  transactions: Transaction[]
  imports: ImportItem[]
  // tweakable controls (scenario / privacy / density)
  scenario: Scenario
  privacy: boolean
  density: Density
  // derived config
  scen: ScenarioData
  dens: { pad: string; gap: string }
  pv: (s: string) => string
  // actions
  go: (s: ScreenKey) => void
  openPicker: (id: number) => void
  closePicker: () => void
  setCat: (id: number, cat: CategoryKey) => void
  setTxFilter: (f: TxFilter) => void
  connectBank: (id: BankId) => void
  resolveImport: (id: string, approve: boolean) => void
  setScenario: (s: Scenario) => void
  setPrivacy: (p: boolean) => void
  setDensity: (d: Density) => void
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
