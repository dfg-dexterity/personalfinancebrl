import { env } from '../env'
import { mockProvider } from './mockProvider'
import { pluggyProvider } from './pluggyProvider'
import type { OpenFinanceProvider } from './types'

export * from './types'

/** Selects the Open Finance provider from OPENFINANCE_PROVIDER (default: mock). */
export function getOpenFinanceProvider(): OpenFinanceProvider {
  switch (env.openFinanceProvider) {
    case 'mock':
      return mockProvider
    case 'pluggy':
      return pluggyProvider
    default:
      throw new Error(`OPENFINANCE_PROVIDER desconhecido: ${env.openFinanceProvider}`)
  }
}
