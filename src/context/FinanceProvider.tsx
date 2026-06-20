import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, type ApiError } from '../api/client'
import type { Bootstrap } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { DENSITY } from '../data/finance'
import { maskValue } from '../lib/format'
import type { Density, ScreenKey } from '../types'
import { FinanceContext, type FinanceContextValue, type TxFilter } from './finance-context'

const currentMonth = () => new Date().toISOString().slice(0, 7)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth()

  const [data, setData] = useState<Bootstrap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [screen, setScreen] = useState<ScreenKey>('dash')
  const [picker, setPicker] = useState<string | null>(null)
  const [txFilter, setTxFilter] = useState<TxFilter>('all')
  const [privacy, setPrivacy] = useState(() => localStorage.getItem('financas.privacy') === '1')
  const [density, setDensity] = useState<Density>(
    () => (localStorage.getItem('financas.density') as Density) || 'Confortável',
  )
  const [month, setMonth] = useState<string>(currentMonth)
  const [connecting, setConnecting] = useState<string | null>(null)

  const load = useCallback(
    async (m: string) => {
      setLoading(true)
      setError(null)
      try {
        setData(await api.get<Bootstrap>(`/bootstrap?month=${m}`))
      } catch (e) {
        const err = e as ApiError
        if (err.status === 401) {
          logout()
          return
        }
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    },
    [logout],
  )

  useEffect(() => {
    void load(month)
  }, [month, load])

  useEffect(() => {
    localStorage.setItem('financas.privacy', privacy ? '1' : '0')
  }, [privacy])
  useEffect(() => {
    localStorage.setItem('financas.density', density)
  }, [density])

  const reload = useCallback(() => load(month), [load, month])

  const categorize = useCallback(
    async (id: string, cat: string) => {
      setPicker(null)
      await api.patch(`/transactions/${id}`, { cat })
      await load(month)
    },
    [load, month],
  )

  const connectBank = useCallback(
    async (bankId: string) => {
      setConnecting(bankId)
      try {
        await api.post(`/connections/${bankId}/connect`)
        await load(month)
      } finally {
        setConnecting(null)
      }
    },
    [load, month],
  )

  const resolveImport = useCallback(
    async (id: string, approve: boolean) => {
      await api.post(`/imports/${id}/resolve`, { approve })
      await load(month)
    },
    [load, month],
  )

  const go = useCallback((s: ScreenKey) => setScreen(s), [])
  const openPicker = useCallback((id: string) => setPicker(id), [])
  const closePicker = useCallback(() => setPicker(null), [])

  const dens = DENSITY[density]
  const pv = useCallback((s: string) => maskValue(privacy, s), [privacy])

  const value = useMemo<FinanceContextValue>(
    () => ({
      data,
      loading,
      error,
      screen,
      picker,
      txFilter,
      privacy,
      density,
      month,
      connecting,
      dens,
      pv,
      go,
      openPicker,
      closePicker,
      setTxFilter,
      setPrivacy,
      setDensity,
      setMonth,
      reload,
      categorize,
      connectBank,
      resolveImport,
    }),
    [
      data,
      loading,
      error,
      screen,
      picker,
      txFilter,
      privacy,
      density,
      month,
      connecting,
      dens,
      pv,
      go,
      openPicker,
      closePicker,
      reload,
      categorize,
      connectBank,
      resolveImport,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
