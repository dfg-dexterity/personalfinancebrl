import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../auth/middleware'
import { AppError, asyncHandler } from '../http'
import { prisma } from '../prisma'

const router = Router()

// Confirm (adds a real transaction) or skip an imported transaction
router.post(
  '/:id/resolve',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { approve } = z.object({ approve: z.boolean() }).parse(req.body)
    const item = await prisma.importItem.findFirst({ where: { id: req.params.id, userId: req.userId! } })
    if (!item) throw new AppError(404, 'Importação não encontrada')
    if (item.status !== 'pending') {
      res.json({ ok: true })
      return
    }
    if (approve) {
      await prisma.transaction.create({
        data: {
          userId: req.userId!,
          name: item.merchant,
          categoryKey: item.categoryKey,
          amountCents: item.amountCents,
          date: new Date(),
          source: 'openfinance',
        },
      })
      await prisma.importItem.update({ where: { id: item.id }, data: { status: 'added' } })
    } else {
      await prisma.importItem.update({ where: { id: item.id }, data: { status: 'skipped' } })
    }
    res.json({ ok: true })
  }),
)

export default router
