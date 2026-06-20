import { prisma } from '../prisma'
import type { CreateConsentInput, ImportedTx, OpenFinanceProvider } from './types'

/** Synthetic "bank" transactions returned on sync, per institution. */
const SAMPLE: Record<string, ImportedTx[]> = {
  nu: [
    { raw: 'IFD*IFOOD', merchant: 'iFood', amount: -58.9, suggestedCategory: 'food' },
    { raw: 'UBER *TRIP', merchant: 'Uber', amount: -19.9, suggestedCategory: 'transport' },
  ],
  it: [
    { raw: 'AMZN MKTPLACE', merchant: 'Amazon', amount: -89.9, suggestedCategory: 'shop' },
    { raw: 'NETFLIX.COM', merchant: 'Netflix', amount: -55.9, suggestedCategory: 'subs' },
  ],
  in: [{ raw: 'DROGARIA SP', merchant: 'Drogaria SP', amount: -42.7, suggestedCategory: 'health' }],
  c6: [
    { raw: 'POSTO BR 123', merchant: 'Posto BR', amount: -210, suggestedCategory: 'transport' },
    { raw: 'RAPPI*REST', merchant: 'Rappi', amount: -72.4, suggestedCategory: 'food' },
    { raw: 'CINEMARK', merchant: 'Cinemark', amount: -64, suggestedCategory: 'leisure' },
  ],
  bb: [
    { raw: 'SUPERMERC ABC', merchant: 'Supermercado ABC', amount: -318.2, suggestedCategory: 'food' },
    { raw: 'FARMACIA POPULAR', merchant: 'Farmácia', amount: -58.3, suggestedCategory: 'health' },
  ],
}

const NINETY_DAYS = 1000 * 60 * 60 * 24 * 90

export const mockProvider: OpenFinanceProvider = {
  name: 'mock',

  async createConsent({ userId, bankId, scopes }: CreateConsentInput) {
    const consent = await prisma.consent.create({
      data: {
        userId,
        bankId,
        status: 'AWAITING_AUTHORISATION',
        scopes: JSON.stringify(scopes),
        expiresAt: new Date(Date.now() + NINETY_DAYS),
      },
    })
    // A real provider would return the bank's authorization URL here.
    return { consentId: consent.id, authUrl: null, status: consent.status }
  },

  async authorizeConsent({ consentId }) {
    // Simulate the bank-side authorization latency (redirect + consent grant).
    await new Promise((r) => setTimeout(r, 900))
    await prisma.consent.update({ where: { id: consentId }, data: { status: 'AUTHORISED' } })
    return { status: 'AUTHORISED' }
  },

  async fetchTransactions({ bankId }) {
    return SAMPLE[bankId] ?? SAMPLE.bb
  },
}
