import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  DENSITY,
  INITIAL_IMPORTS,
  INITIAL_TRANSACTIONS,
  SCENARIOS,
} from '../data/finance'
import { maskValue } from '../lib/format'
import type {
  BankId,
  BankStatusMap,
  CategoryKey,
  Density,
  ImportItem,
  Scenario,
  ScreenKey,
  Transaction,
} from '../types'
import { FinanceContext, type FinanceContextValue, type TxFilter } from './finance-context'

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<ScreenKey>('dash')
  const [picker, setPicker] = useState<number | null>(null)
  const [txFilter, setTxFilter] = useState<TxFilter>('all')
  const [bankStatus, setBankStatus] = useState<BankStatusMap>({
    nu: 'on',
    it: 'on',
    in: 'on',
    c6: 'off',
    bb: 'off',
  })
  const [connecting, setConnecting] = useState<BankId | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)
  const [imports, setImports] = useState<ImportItem[]>(INITIAL_IMPORTS)

  const [scenario, setScenario] = useState<Scenario>('Mês tranquilo')
  const [privacy, setPrivacy] = useState(false)
  const [density, setDensity] = useState<Density>('Confortável')

  const go = useCallback((s: ScreenKey) => setScreen(s), [])
  const openPicker = useCallback((id: number) => setPicker(id), [])
  const closePicker = useCallback(() => setPicker(null), [])

  const setCat = useCallback((id: number, cat: CategoryKey) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, cat } : t)))
    setPicker(null)
  }, [])

  const connectBank = useCallback((id: BankId) => {
    setConnecting(id)
    window.setTimeout(() => {
      setConnecting((c) => (c === id ? null : c))
      setBankStatus((prev) => ({ ...prev, [id]: 'on' }))
    }, 1100)
  }, [])

  const resolveImport = useCallback((id: string, approve: boolean) => {
    setImports((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: approve ? 'added' : 'skipped' } : i,
      ),
    )
  }, [])

  const scen = SCENARIOS[scenario]
  const dens = DENSITY[density]
  const pv = useCallback((s: string) => maskValue(privacy, s), [privacy])

  const value = useMemo<FinanceContextValue>(
    () => ({
      screen,
      picker,
      txFilter,
      bankStatus,
      connecting,
      transactions,
      imports,
      scenario,
      privacy,
      density,
      scen,
      dens,
      pv,
      go,
      openPicker,
      closePicker,
      setCat,
      setTxFilter,
      connectBank,
      resolveImport,
      setScenario,
      setPrivacy,
      setDensity,
    }),
    [
      screen,
      picker,
      txFilter,
      bankStatus,
      connecting,
      transactions,
      imports,
      scenario,
      privacy,
      density,
      scen,
      dens,
      pv,
      go,
      openPicker,
      closePicker,
      setCat,
      connectBank,
      resolveImport,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
