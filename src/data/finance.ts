import type { Category, CategoryKey, Density, NavItem, ScreenKey } from '../types'

/** Category dictionary — icon + colors (mirrors the backend catalog). */
export const CATS: Record<CategoryKey, Category> = {
  food: { name: 'Alimentação', icon: '🍽', color: '#3f7a55', bg: '#e3eee6' },
  home: { name: 'Moradia', icon: '🏠', color: '#274d36', bg: '#dde9e0' },
  transport: { name: 'Transporte', icon: '🚗', color: '#6aa57f', bg: '#e6f0ea' },
  leisure: { name: 'Lazer', icon: '🎬', color: '#b08968', bg: '#f0e8e0' },
  health: { name: 'Saúde', icon: '🩺', color: '#5a8a9a', bg: '#e3edf0' },
  shop: { name: 'Compras', icon: '🛍', color: '#a0703f', bg: '#f0e7dc' },
  subs: { name: 'Assinaturas', icon: '📺', color: '#7a6f9b', bg: '#ebe8f0' },
  income: { name: 'Entrada', icon: '↘', color: '#3f7a55', bg: '#e3eee6' },
  other: { name: 'Outros', icon: '•', color: '#8a8678', bg: '#eceae2' },
}

/** Categories offered in the categorize modal (order matters). */
export const PICKER_CATEGORIES: CategoryKey[] = [
  'food',
  'home',
  'transport',
  'leisure',
  'health',
  'shop',
  'subs',
  'other',
]

export const NAV_DEF: NavItem[] = [
  { key: 'dash', label: 'Visão geral', icon: '◈' },
  { key: 'tx', label: 'Transações', icon: '≡' },
  { key: 'budget', label: 'Orçamentos', icon: '◎' },
  { key: 'card', label: 'Cartões', icon: '▭' },
  { key: 'invest', label: 'Aplicações', icon: '▲' },
  { key: 'loan', label: 'Empréstimos', icon: '◳' },
  { key: 'report', label: 'Relatórios', icon: '▤' },
  { key: 'import', label: 'Revisar importação', icon: '↻' },
  { key: 'connect', label: 'Conexões', icon: '🔗' },
]

export const TITLES: Record<ScreenKey, [string, string]> = {
  dash: ['Visão geral', 'Bem-vinda de volta'],
  tx: ['Transações', 'Centralizado automaticamente via Open Finance'],
  budget: ['Orçamentos', 'Acompanhe seus limites do mês'],
  card: ['Cartões', 'Fatura e limites'],
  invest: ['Aplicações', 'Sua carteira de investimentos'],
  loan: ['Empréstimos', 'Saldo devedor e parcelas'],
  report: ['Relatórios', 'Análise dos últimos 6 meses'],
  import: ['Revisar importação', 'Confirme as categorias sugeridas'],
  connect: ['Conexões', 'Open Finance · Banco Central'],
}

export const DENSITY: Record<Density, { pad: string; gap: string }> = {
  Compacto: { pad: '20px 28px 40px', gap: '12px' },
  Confortável: { pad: '30px 36px 50px', gap: '18px' },
  Espaçoso: { pad: '46px 54px 64px', gap: '26px' },
}
