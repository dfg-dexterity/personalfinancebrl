import type { OpenFinanceProvider } from './types'

/**
 * Stub for a REAL Open Finance connection via Pluggy (https://pluggy.ai), an
 * authorized aggregator/TPP for Open Finance Brasil.
 *
 * To make this live:
 *   1. Create a Pluggy account and get CLIENT_ID / CLIENT_SECRET.
 *   2. Put PLUGGY_CLIENT_ID / PLUGGY_CLIENT_SECRET in server/.env and set
 *      OPENFINANCE_PROVIDER="pluggy".
 *   3. Implement the three methods below against Pluggy's API (Connect token →
 *      Item/consent → /transactions). The rest of the app already speaks this
 *      interface, so no other code changes are needed.
 */
const notConfigured = (): never => {
  throw new Error(
    'Provider "pluggy" não está implementado/configurado. Defina PLUGGY_CLIENT_ID e ' +
      'PLUGGY_CLIENT_SECRET em server/.env e implemente as chamadas em pluggyProvider.ts ' +
      '(docs: https://docs.pluggy.ai). Enquanto isso, use OPENFINANCE_PROVIDER="mock".',
  )
}

export const pluggyProvider: OpenFinanceProvider = {
  name: 'pluggy',
  async createConsent() {
    return notConfigured()
  },
  async authorizeConsent() {
    return notConfigured()
  },
  async fetchTransactions() {
    return notConfigured()
  },
}
