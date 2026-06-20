import App from './App'
import { Login } from './components/Login'
import { useAuth } from './auth/useAuth'
import { FinanceProvider } from './context/FinanceProvider'

/** Auth gate: show the login screen until there's a token, then the app. */
export function Root() {
  const { token } = useAuth()
  if (!token) return <Login />
  return (
    <FinanceProvider>
      <App />
    </FinanceProvider>
  )
}
