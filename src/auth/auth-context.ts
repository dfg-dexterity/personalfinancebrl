import { createContext } from 'react'
import type { ApiUser } from '../api/types'

export interface AuthContextValue {
  token: string | null
  user: ApiUser | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
