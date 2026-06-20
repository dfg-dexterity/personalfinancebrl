import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../auth/middleware'
import { CATEGORIES } from '../data/catalog'
import { AppError, asyncHandler } from '../http'
import { toCents } from '../money'
import { prisma } from '../prisma'

const router = Router()
const CAT_KEYS = new Set<string>(CATEGORIES.map((c) => c.key))

// Create or update a category budget for a month
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { cat, month, limit } = z
      .object({
        cat: z.string(),
        month: z.string().regex(/^\d{4}-\d{2}$/),
        limit: z.number().positive(),
      })
      .parse(req.body)
    if (!CAT_KEYS.has(cat)) throw new AppError(400, 'Categoria inválida')
    await prisma.budget.upsert({
      where: { userId_categoryKey_month: { userId: req.userId!, categoryKey: cat, month } },
      update: { limitCents: toCents(limit) },
      create: { userId: req.userId!, categoryKey: cat, month, limitCents: toCents(limit) },
    })
    res.status(201).json({ ok: true })
  }),
)

export default router
