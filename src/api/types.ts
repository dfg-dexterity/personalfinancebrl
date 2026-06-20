// Shapes returned by the backend API (money values are in reais, numbers).

export interface ApiUser {
  id: string
  name: string
  email: string
  plan: string
  initials: string
}

export interface ApiCategory {
  key: string
  name: string
  icon: string
  color: string
  bg: string
}

export interface ApiAccount {
  id: string
  name: string
  kind: string
  balance: number
  letter: string
  color: string
}

export interface ApiTransaction {
  id: string
  name: string
  cat: string | null
  amount: number
  account: string
  date: string // ISO
}

export interface ApiBudget {
  cat: string
  spent: number
  total: number
}

export interface ApiCashflow {
  label: string
  in: number
  out: number
}

export interface ApiReportCat {
  name: string
  color: string
  pct: string
}

export interface ApiSummary {
  patrimonio: number
  delta: string
  deltaColor: string
  entradas: number
  entradasNote: string
  saidas: number
  saidasNote: string
  saidasColor: string
  savings: string
  savingsNote: string
  savingsColor: string
  cashflow: ApiCashflow[]
  reportCats: ApiReportCat[]
  donutGradient: string
  reportTotal: string
  insight: string
}

export interface ApiConnection {
  bankId: string
  name: string
  letter: string
  color: string
  status: string // off | on
}

export interface ApiImport {
  id: string
  raw: string
  merchant: string
  amount: number
  cat: string
  status: string // pending | added | skipped
}

export interface ApiInvestment {
  name: string
  sub: string
  value: number
  change: string
  changePct: number
  changeColor: string
  tag: string
  bg: string
  fg: string
}

export interface ApiLoan {
  name: string
  bank: string
  rate: string
  remaining: number
  monthly: number
  paid: string
  pct: string
}

export interface ApiCardItem {
  name: string
  cat: string
  date: string
  installment: string
  amount: number
}

export interface ApiCard {
  name: string
  invoice: number
  limit: number
  used: number
  dueDate: string
  closeDate: string
  bestDay: string
  items: ApiCardItem[]
}

export interface Bootstrap {
  user: ApiUser
  month: string
  categories: ApiCategory[]
  accounts: ApiAccount[]
  transactions: ApiTransaction[]
  budgets: ApiBudget[]
  summary: ApiSummary
  connections: ApiConnection[]
  imports: ApiImport[]
  investments: ApiInvestment[]
  loans: ApiLoan[]
  card: ApiCard | null
}

export interface AuthResponse {
  token: string
  user: ApiUser
}
