import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { ZodError } from 'zod'
import { env } from './env'
import { AppError } from './http'
import authRoutes from './routes/auth'
import bootstrapRoutes from './routes/bootstrap'
import budgetRoutes from './routes/budgets'
import connectionRoutes from './routes/connections'
import importRoutes from './routes/imports'
import txRoutes from './routes/transactions'

// The configured Express app, with no call to listen(). This lets it run both as
// a long-lived local server (see index.ts) and as a Vercel serverless function
// (see /api/index.ts).
const app = express()

app.use(cors({ origin: env.clientOrigin }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, provider: env.openFinanceProvider })
})

app.use('/api/auth', authRoutes)
app.use('/api/bootstrap', bootstrapRoutes)
app.use('/api/transactions', txRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/imports', importRoutes)
app.use('/api/connections', connectionRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Dados inválidos', details: err.flatten() })
    return
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

export default app
