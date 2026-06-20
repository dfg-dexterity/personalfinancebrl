import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { api, getToken, setToken } from '../api/client'
import type { ApiUser, AuthResponse } from '../api/types'
import { AuthContext, type AuthContextValue } from './auth-context'

const USER_KEY = 'financas.user'

function loadUser(): ApiUser | null {
  const s = localStorage.getItem(USER_KEY)
  if (!s) return null
  try {
    return JSON.parse(s) as ApiUser
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState<string | null>(() => getToken())
  const [user, setUser] = useState<ApiUser | null>(() => loadUser())

  const apply = useCallback((res: AuthResponse) => {
    setToken(res.token)
    localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    setTok(res.token)
    setUser(res.user)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      apply(await api.post<AuthResponse>('/auth/login', { email, password }))
    },
    [apply],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      apply(await api.post<AuthResponse>('/auth/register', { name, email, password }))
    },
    [apply],
  )

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setTok(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, login, register, logout }),
    [token, user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
