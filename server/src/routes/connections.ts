import { Router } from 'express'
import { requireAuth } from '../auth/middleware'
import { AppError, asyncHandler } from '../http'
import { toCents } from '../money'
import { DEFAULT_SCOPES, getOpenFinanceProvider } from '../openfinance'
import { prisma } from '../prisma'

const router = Router()

/** Connect a bank via Open Finance: consent → authorize → sync transactions. */
router.post(
  '/:bankId/connect',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.userId!
    const { bankId } = req.params
    const link = await prisma.bankLink.findUnique({ where: { userId_bankId: { userId, bankId } } })
    if (!link) throw new AppError(404, 'Banco não encontrado')

    if (link.status === 'on') {
      res.json({ ok: true, imported: 0 })
      return
    }

    const provider = getOpenFinanceProvider()
    const consent = await provider.createConsent({ userId, bankId, scopes: DEFAULT_SCOPES })
    await provider.authorizeConsent({ userId, consentId: consent.consentId })
    await prisma.bankLink.update({
      where: { id: link.id },
      data: { status: 'on', connectedAt: new Date(), consentId: consent.consentId },
    })

    const txs = await provider.fetchTransactions({ userId, bankId, consentId: consent.consentId })
    if (txs.length) {
      await prisma.importItem.createMany({
        data: txs.map((t) => ({
          userId,
          raw: t.raw,
          merchant: t.merchant,
          amountCents: toCents(t.amount),
          categoryKey: t.suggestedCategory,
          status: 'pending',
          bankId,
        })),
      })
    }
    res.json({ ok: true, imported: txs.length })
  }),
)

/** Re-sync an already-connected bank (pulls new transactions to review). */
router.post(
  '/:bankId/sync',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.userId!
    const { bankId } = req.params
    const link = await prisma.bankLink.findUnique({ where: { userId_bankId: { userId, bankId } } })
    if (!link || link.status !== 'on' || !link.consentId) throw new AppError(400, 'Banco não conectado')

    const provider = getOpenFinanceProvider()
    const txs = await provider.fetchTransactions({ userId, bankId, consentId: link.consentId })
    if (txs.length) {
      await prisma.importItem.createMany({
        data: txs.map((t) => ({
          userId,
          raw: t.raw,
          merchant: t.merchant,
          amountCents: toCents(t.amount),
          categoryKey: t.suggestedCategory,
          status: 'pending',
          bankId,
        })),
      })
    }
    res.json({ ok: true, imported: txs.length })
  }),
)

export default router
