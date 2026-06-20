/**
 * Open Finance provider seam.
 *
 * Models the real Open Finance Brasil flow (consent → authorisation → data
 * sync). The `mock` provider implements it locally; a real aggregator
 * (e.g. Pluggy/Belvo) implements the same interface — see pluggyProvider.ts.
 */
export interface ImportedTx {
  raw: string
  merchant: string
  amount: number // reais; negative = debit
  suggestedCategory: string
}

export interface CreateConsentInput {
  userId: string
  bankId: string
  scopes: string[]
}

export interface ConsentResult {
  consentId: string
  /** Real providers return an authorization URL to redirect the user to. */
  authUrl: string | null
  status: string
}

export interface OpenFinanceProvider {
  readonly name: string
  createConsent(input: CreateConsentInput): Promise<ConsentResult>
  authorizeConsent(input: { userId: string; consentId: string }): Promise<{ status: string }>
  fetchTransactions(input: {
    userId: string
    bankId: string
    consentId: string
  }): Promise<ImportedTx[]>
}

export const DEFAULT_SCOPES = ['accounts', 'transactions', 'balances']
