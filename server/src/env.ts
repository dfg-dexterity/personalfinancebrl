import dotenv from 'dotenv'

dotenv.config()

function req(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback
  if (v === undefined) throw new Error(`Missing required env var: ${name}`)
  return v
}

export const env = {
  databaseUrl: req('DATABASE_URL'),
  jwtSecret: req('JWT_SECRET', 'dev-secret-change-me'),
  port: Number.parseInt(process.env.PORT ?? '3001', 10),
  openFinanceProvider: process.env.OPENFINANCE_PROVIDER ?? 'mock',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
}
