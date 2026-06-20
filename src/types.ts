export type ScreenKey =
  | 'dash'
  | 'tx'
  | 'budget'
  | 'card'
  | 'invest'
  | 'loan'
  | 'report'
  | 'import'
  | 'connect'

export type CategoryKey =
  | 'food'
  | 'home'
  | 'transport'
  | 'leisure'
  | 'health'
  | 'shop'
  | 'subs'
  | 'income'
  | 'other'

export interface Category {
  name: string
  icon: string
  color: string
  bg: string
}

export interface Transaction {
  id: number
  name: string
  cat: CategoryKey | null
  amount: number
  account: string
  date: string
}

export type ImportStatus = 'pending' | 'added' | 'skipped'

export interface ImportItem {
  id: string
  raw: string
  merchant: string
  amount: number
  cat: CategoryKey
  status: ImportStatus
}

export type Scenario = 'Mês tranquilo' | 'Mês apertado' | 'Mês cheio'
export type Density = 'Compacto' | 'Confortável' | 'Espaçoso'

export type BankId = 'nu' | 'it' | 'in' | 'c6' | 'bb'
export type BankStatusValue = 'on' | 'off'
export type BankStatusMap = Record<BankId, BankStatusValue>

export interface BudgetDatum {
  cat: CategoryKey
  spent: number
  total: number
}

export interface ScenarioData {
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
  bdata: BudgetDatum[]
  in: number[]
  out: number[]
  bSpent: number
  bTotal: number
  proj: number
  projColor: string
  projNote: string
  insight: string
}

export interface Account {
  id: string
  name: string
  kind: string
  balance: string
  letter: string
  color: string
}

export interface BankMeta {
  id: BankId
  name: string
  letter: string
  color: string
}

export interface Investment {
  name: string
  sub: string
  value: string
  change: string
  changeColor: string
  tag: string
  bg: string
  fg: string
}

export interface Loan {
  name: string
  bank: string
  rate: string
  remaining: string
  paid: string
  monthly: string
  pct: string
}

export interface CardTxRaw {
  cat: CategoryKey
  name: string
  date: string
  installment: string
  amount: string
}

export interface ReportCat {
  name: string
  pct: string
  color: string
}

export interface NavItem {
  key: ScreenKey
  label: string
  icon: string
}
