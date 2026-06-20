import { useState, type FormEvent } from 'react'
import type { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'

type Mode = 'login' | 'register'

export function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('marina@financas.app')
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    if (next === 'register') {
      setName('')
      setEmail('')
      setPassword('')
    } else {
      setEmail('marina@financas.app')
      setPassword('demo1234')
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === 'login') await login(email, password)
      else await register(name, email, password)
    } catch (err) {
      setError((err as ApiError).message || 'Algo deu errado')
    } finally {
      setBusy(false)
    }
  }

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => switchMode(m)}
      className={`flex-1 rounded-xl py-2 text-sm font-bold transition-colors ${
        mode === m ? 'bg-forest-800 text-white' : 'text-ink-3 hover:bg-line-soft'
      }`}
    >
      {label}
    </button>
  )

  const field =
    'w-full rounded-xl border border-line bg-canvas px-[14px] py-[11px] text-sm text-ink outline-none transition-colors focus:border-forest-500'

  return (
    <div className="flex min-h-screen items-center justify-center bg-body p-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex items-center justify-center gap-[11px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-forest-900 text-[20px] font-extrabold text-mint">
            f
          </div>
          <div className="text-[22px] font-extrabold tracking-[-0.3px] text-ink">finanças</div>
        </div>

        <div className="rounded-[22px] border border-line bg-paper p-6 shadow-[0_30px_80px_-30px_rgba(28,31,26,0.35)]">
          <div className="mb-5 flex gap-1 rounded-2xl bg-line-soft p-1">
            {tab('login', 'Entrar')}
            {tab('register', 'Criar conta')}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            {mode === 'register' && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted">Nome</span>
                <input
                  className={field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                />
              </label>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted">E-mail</span>
              <input
                className={field}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-muted">Senha</span>
              <input
                className={field}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                required
              />
            </label>

            {error && (
              <div className="rounded-xl border border-[#ecdcc6] bg-[#fbf0df] px-3 py-2 text-[13px] font-medium text-warn-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-1 rounded-xl bg-forest-800 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? 'Aguarde…' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-xs text-muted">
          Conta de teste: <span className="mono">marina@financas.app</span> ·{' '}
          <span className="mono">demo1234</span>
        </div>
      </div>
    </div>
  )
}
