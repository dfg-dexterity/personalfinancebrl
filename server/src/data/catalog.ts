/** Category catalog (global) — mirrors the frontend's CATS dictionary. */
export const CATEGORIES = [
  { key: 'food', name: 'Alimentação', icon: '🍽', color: '#3f7a55', bg: '#e3eee6', sort: 1 },
  { key: 'home', name: 'Moradia', icon: '🏠', color: '#274d36', bg: '#dde9e0', sort: 2 },
  { key: 'transport', name: 'Transporte', icon: '🚗', color: '#6aa57f', bg: '#e6f0ea', sort: 3 },
  { key: 'leisure', name: 'Lazer', icon: '🎬', color: '#b08968', bg: '#f0e8e0', sort: 4 },
  { key: 'health', name: 'Saúde', icon: '🩺', color: '#5a8a9a', bg: '#e3edf0', sort: 5 },
  { key: 'shop', name: 'Compras', icon: '🛍', color: '#a0703f', bg: '#f0e7dc', sort: 6 },
  { key: 'subs', name: 'Assinaturas', icon: '📺', color: '#7a6f9b', bg: '#ebe8f0', sort: 7 },
  { key: 'income', name: 'Entrada', icon: '↘', color: '#3f7a55', bg: '#e3eee6', sort: 8 },
  { key: 'other', name: 'Outros', icon: '•', color: '#8a8678', bg: '#eceae2', sort: 9 },
] as const

/** Banks available to connect via Open Finance. */
export const BANKS = [
  { bankId: 'nu', name: 'Nubank', letter: 'N', color: '#7a3fb8' },
  { bankId: 'it', name: 'Itaú', letter: 'I', color: '#e35728' },
  { bankId: 'in', name: 'Banco Inter', letter: 'B', color: '#f5a623' },
  { bankId: 'c6', name: 'C6 Bank', letter: 'C', color: '#2a2a2a' },
  { bankId: 'bb', name: 'Banco do Brasil', letter: 'B', color: '#0a3d91' },
] as const

export type CategoryKey = (typeof CATEGORIES)[number]['key']
