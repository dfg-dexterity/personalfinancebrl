import { createContext } from 'react'
import type { Bootstrap } from '../api/types'
import type { Density, ScreenKey } from '../types'

export type TxFilter = string // 'all' | 'uncat' | category key

export interface FinanceContextValue {
  // data
  data: Bootstrap | null
  loading: boolean
  error: string | null
  // ui state
  screen: ScreenKey
  picker: string | null // transaction id
  txFilter: TxFilter
  privacy: boolean
  density: Density
  month: string
  connecting: string | null // bankId being connected
  // derived
  dens: { pad: string; gap: string }
  pv: (s: string) => string
  // ui actions
  go: (s: ScreenKey) => void
  openPicker: (id: string) => void
  closePicker: () => void
  setTxFilter: (f: TxFilter) => void
  setPrivacy: (p: boolean) => void
  setDensity: (d: Density) => void
  setMonth: (m: string) => void
  reload: () => Promise<void>
  // async mutations (call API, then refetch)
  categorize: (id: string, cat: string) => Promise<void>
  connectBank: (bankId: string) => Promise<void>
  resolveImport: (id: string, approve: boolean) => Promise<void>
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
