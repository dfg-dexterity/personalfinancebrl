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

export type Density = 'Compacto' | 'Confortável' | 'Espaçoso'

export interface NavItem {
  key: ScreenKey
  label: string
  icon: string
}
