/** Money is stored as integer cents; the API speaks reais (numbers). */
export const toReais = (cents: number): number => Math.round(cents) / 100
export const toCents = (reais: number): number => Math.round(reais * 100)
