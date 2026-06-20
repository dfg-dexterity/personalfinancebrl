import { Router } from 'express'
import { requireAuth } from '../auth/middleware'
import { buildBootstrap } from '../bootstrap'
import { asyncHandler } from '../http'

const router = Router()
const MONTH_RE = /^\d{4}-\d{2}$/

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const q = req.query.month
    const month = typeof q === 'string' && MONTH_RE.test(q) ? q : currentMonth()
    res.json(await buildBootstrap(req.userId!, month))
  }),
)

export default router
