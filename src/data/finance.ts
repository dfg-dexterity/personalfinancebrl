import type {
  Account,
  BankMeta,
  CardTxRaw,
  Category,
  CategoryKey,
  Density,
  ImportItem,
  Investment,
  Loan,
  NavItem,
  ReportCat,
  Scenario,
  ScenarioData,
  ScreenKey,
  Transaction,
} from '../types'

/** Category dictionary — icon + colors used everywhere. */
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

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, name: 'iFood', cat: 'food', amount: -64.9, account: 'Conta digital', date: 'Hoje' },
  { id: 9, name: 'Padaria Aurora', cat: null, amount: -32.5, account: 'Conta digital', date: 'Hoje' },
  { id: 2, name: 'Uber', cat: 'transport', amount: -23.4, account: 'Conta corrente', date: 'Hoje' },
  { id: 3, name: 'Salário', cat: 'income', amount: 8200, account: 'Conta corrente', date: 'Ontem' },
  { id: 4, name: 'Aluguel', cat: 'home', amount: -2100, account: 'Conta corrente', date: '05 jun' },
  { id: 5, name: 'Netflix', cat: 'subs', amount: -55.9, account: 'Conta digital', date: '04 jun' },
  { id: 6, name: 'Drogaria São Paulo', cat: 'health', amount: -89.7, account: 'Conta digital', date: '03 jun' },
  { id: 7, name: 'Posto Shell', cat: 'transport', amount: -180, account: 'Conta corrente', date: '02 jun' },
  { id: 8, name: 'Amazon', cat: 'shop', amount: -149.9, account: 'Conta digital', date: '01 jun' },
]

export const INITIAL_IMPORTS: ImportItem[] = [
  { id: 'i1', raw: 'MERCADOLIVRE*ML12', merchant: 'Mercado Livre', amount: -129.9, cat: 'shop', status: 'pending' },
  { id: 'i2', raw: 'PG *SPOTIFY BR', merchant: 'Spotify', amount: -21.9, cat: 'subs', status: 'pending' },
  { id: 'i3', raw: 'DROGASIL 0456', merchant: 'Drogasil', amount: -47.3, cat: 'health', status: 'pending' },
  { id: 'i4', raw: 'POSTO IPIRANGA SP', merchant: 'Posto Ipiranga', amount: -200, cat: 'transport', status: 'pending' },
  { id: 'i5', raw: 'PIX REC JOAO M', merchant: 'Pix recebido', amount: -50, cat: 'other', status: 'pending' },
]

/** Three "personalities" of the month that drive every number on screen. */
export const SCENARIOS: Record<Scenario, ScenarioData> = {
  'Mês tranquilo': {
    patrimonio: 64847.9,
    delta: '↑ 4,2% no mês',
    deltaColor: '#9ee6b5',
    entradas: 8200,
    entradasNote: '↑ salário + extras',
    saidas: 5640,
    saidasNote: '68% do orçamento',
    saidasColor: '#c2603a',
    savings: '31%',
    savingsNote: 'R$ 2.560 guardados',
    savingsColor: '#3f7a55',
    bdata: [
      { cat: 'food', spent: 1840, total: 2000 },
      { cat: 'home', spent: 2100, total: 2200 },
      { cat: 'transport', spent: 920, total: 1000 },
      { cat: 'leisure', spent: 640, total: 800 },
      { cat: 'shop', spent: 300, total: 500 },
    ],
    in: [78, 82, 80, 88, 84, 92],
    out: [64, 70, 58, 72, 66, 60],
    bSpent: 5640,
    bTotal: 8300,
    proj: 7980,
    projColor: '#3f7a55',
    projNote: 'dentro do limite ✓',
    insight:
      'Você gastou 14% menos em transporte que em maio. Alimentação subiu R$ 320 — ainda dá para guardar mais.',
  },
  'Mês apertado': {
    patrimonio: 61120.4,
    delta: '↑ 0,6% no mês',
    deltaColor: '#cfe0d3',
    entradas: 7400,
    entradasNote: 'sem extras este mês',
    saidas: 7060,
    saidasNote: '91% do orçamento',
    saidasColor: '#c2603a',
    savings: '5%',
    savingsNote: 'R$ 340 guardados',
    savingsColor: '#b07b2e',
    bdata: [
      { cat: 'food', spent: 1980, total: 2000 },
      { cat: 'home', spent: 2180, total: 2200 },
      { cat: 'transport', spent: 980, total: 1000 },
      { cat: 'leisure', spent: 760, total: 800 },
      { cat: 'shop', spent: 480, total: 500 },
    ],
    in: [70, 74, 72, 76, 73, 72],
    out: [66, 70, 64, 74, 71, 84],
    bSpent: 7060,
    bTotal: 7760,
    proj: 8420,
    projColor: '#c2603a',
    projNote: 'pode estourar o limite',
    insight:
      'Mês apertado: você já usou 91% do orçamento e faltam 11 dias. Alimentação e transporte estão no limite.',
  },
  'Mês cheio': {
    patrimonio: 58940.0,
    delta: '↓ 1,8% no mês',
    deltaColor: '#f0b59b',
    entradas: 8200,
    entradasNote: '↑ salário',
    saidas: 8760,
    saidasNote: '106% do orçamento',
    saidasColor: '#c2603a',
    savings: '−7%',
    savingsNote: 'R$ 560 no vermelho',
    savingsColor: '#c2603a',
    bdata: [
      { cat: 'food', spent: 2180, total: 2000 },
      { cat: 'home', spent: 2260, total: 2200 },
      { cat: 'transport', spent: 1080, total: 1000 },
      { cat: 'leisure', spent: 880, total: 800 },
      { cat: 'shop', spent: 540, total: 500 },
    ],
    in: [72, 76, 70, 74, 72, 80],
    out: [70, 78, 72, 82, 80, 96],
    bSpent: 8760,
    bTotal: 8300,
    proj: 9100,
    projColor: '#c2603a',
    projNote: 'orçamento estourado',
    insight:
      'Alerta: os gastos superaram as entradas em R$ 560. Três orçamentos estouraram — Alimentação, Moradia e Transporte.',
  },
}

export const DENSITY: Record<Density, { pad: string; gap: string }> = {
  Compacto: { pad: '20px 28px 40px', gap: '12px' },
  Confortável: { pad: '30px 36px 50px', gap: '18px' },
  Espaçoso: { pad: '46px 54px 64px', gap: '26px' },
}

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
  dash: ['Visão geral', 'Bem-vinda de volta, Marina'],
  tx: ['Transações', 'Centralizado automaticamente via Open Finance'],
  budget: ['Orçamentos', 'Junho 2026'],
  card: ['Cartões', 'Fatura e limites'],
  invest: ['Aplicações', 'Sua carteira de investimentos'],
  loan: ['Empréstimos', 'Saldo devedor e parcelas'],
  report: ['Relatórios', 'Análise dos últimos 6 meses'],
  import: ['Revisar importação', 'Confirme as categorias sugeridas'],
  connect: ['Conexões', 'Open Finance · Banco Central'],
}

export const ACCOUNTS: Account[] = [
  { id: 'nu', name: 'Conta digital', kind: 'Crédito · débito', balance: 'R$ 9.120', letter: 'N', color: '#7a3fb8' },
  { id: 'it', name: 'Conta corrente', kind: 'Salário', balance: 'R$ 12.430', letter: 'I', color: '#e35728' },
  { id: 'in', name: 'Banco Inter', kind: 'Aplicações', balance: 'R$ 3.297', letter: 'B', color: '#f5a623' },
]

export const BANK_META: BankMeta[] = [
  { id: 'nu', name: 'Nubank', letter: 'N', color: '#7a3fb8' },
  { id: 'it', name: 'Itaú', letter: 'I', color: '#e35728' },
  { id: 'in', name: 'Banco Inter', letter: 'B', color: '#f5a623' },
  { id: 'c6', name: 'C6 Bank', letter: 'C', color: '#2a2a2a' },
  { id: 'bb', name: 'Banco do Brasil', letter: 'B', color: '#0a3d91' },
]

export const INVESTMENTS: Investment[] = [
  { name: 'CDB Liquidez Diária', sub: 'Banco Inter · 102% CDI', value: 'R$ 12.430', change: '+0,9%', changeColor: '#3f7a55', tag: 'CDB', bg: '#e3eee6', fg: '#3f7a55' },
  { name: 'Tesouro Selic 2029', sub: 'Renda fixa', value: 'R$ 8.900', change: '+0,8%', changeColor: '#3f7a55', tag: 'TD', bg: '#e6f0ea', fg: '#3f7a55' },
  { name: 'Ações & ETFs', sub: 'Carteira variável', value: 'R$ 5.320', change: '+2,1%', changeColor: '#3f7a55', tag: 'AÇ', bg: '#ebe8f0', fg: '#7a6f9b' },
  { name: 'Fundos Imobiliários', sub: '4 ativos', value: 'R$ 4.440', change: '−0,4%', changeColor: '#c2603a', tag: 'FII', bg: '#f0e8e0', fg: '#b08968' },
]

export const LOANS: Loan[] = [
  { name: 'Empréstimo pessoal', bank: 'Itaú', rate: '2,1% a.m.', remaining: 'R$ 13.260', paid: '14/36', monthly: 'R$ 612', pct: '39%' },
  { name: 'Financiamento moto', bank: 'Banco Inter', rate: '1,8% a.m.', remaining: 'R$ 5.140', paid: '18/24', monthly: 'R$ 410', pct: '75%' },
]

export const CARD_TX: CardTxRaw[] = [
  { cat: 'shop', name: 'Amazon', date: '01 jun', installment: '1/3', amount: 'R$ 149,90' },
  { cat: 'food', name: 'iFood', date: '31 mai', installment: 'à vista', amount: 'R$ 64,90' },
  { cat: 'subs', name: 'Netflix', date: '30 mai', installment: 'à vista', amount: 'R$ 55,90' },
  { cat: 'transport', name: 'Posto Shell', date: '29 mai', installment: 'à vista', amount: 'R$ 180,00' },
]

export const REPORT_CATS: ReportCat[] = [
  { name: 'Alimentação', pct: '33%', color: '#3f7a55' },
  { name: 'Moradia', pct: '25%', color: '#274d36' },
  { name: 'Transporte', pct: '22%', color: '#6aa57f' },
  { name: 'Compras', pct: '12%', color: '#b08968' },
  { name: 'Saúde', pct: '8%', color: '#5a8a9a' },
]

export const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun']

/** Donut gradient shared by the dashboard + reports "gastos por categoria". */
export const SPENDING_DONUT =
  'conic-gradient(#3f7a55 0 33%,#274d36 33% 58%,#6aa57f 58% 80%,#b08968 80% 92%,#5a8a9a 92% 100%)'

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
