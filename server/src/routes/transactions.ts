import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../auth/middleware'
import { CATEGORIES } from '../data/catalog'
import { AppError, asyncHandler } from '../http'
import { toCents } from '../money'
import { prisma } from '../prisma'

const router = Router()
const CAT_KEYS = new Set<string>(CATEGORIES.map((c) => c.key))

// Set / clear a transaction's category
router.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { cat } = z.object({ cat: z.string().nullable() }).parse(req.body)
    if (cat !== null && !CAT_KEYS.has(cat)) throw new AppError(400, 'Categoria inválida')
    const tx = await prisma.transaction.findFirst({ where: { id: req.params.id, userId: req.userId! } })
    if (!tx) throw new AppError(404, 'Transação não encontrada')
    await prisma.transaction.update({ where: { id: tx.id }, data: { categoryKey: cat } })
    res.json({ ok: true })
  }),
)

// Create a transaction (used by "+ Adicionar")
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        name: z.string().min(1).max(120),
        amount: z.number(),
        cat: z.string().nullable().optional(),
        date: z.string().datetime().optional(),
      })
      .parse(req.body)
    const cat = body.cat ?? null
    if (cat !== null && !CAT_KEYS.has(cat)) throw new AppError(400, 'Categoria inválida')
    const tx = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        name: body.name,
        categoryKey: cat,
        amountCents: toCents(body.amount),
        date: body.date ? new Date(body.date) : new Date(),
        source: 'manual',
      },
    })
    res.status(201).json({ id: tx.id })
  }),
)

export default router
