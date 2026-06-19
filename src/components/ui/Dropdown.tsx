import { useState, type ReactNode } from 'react'

interface DropdownOption<T extends string> {
  value: T
  label: ReactNode
  hint?: string
}

interface DropdownProps<T extends string> {
  trigger: ReactNode
  triggerClassName?: string
  title?: string
  heading?: string
  options: DropdownOption<T>[]
  value: T
  onChange: (v: T) => void
  align?: 'left' | 'right'
  width?: number
}

/** Lightweight popover select with a click-away backdrop. */
export function Dropdown<T extends string>({
  trigger,
  triggerClassName,
  title,
  heading,
  options,
  value,
  onChange,
  align = 'right',
  width = 220,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        title={title}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute z-50 mt-2 animate-fadeUp overflow-hidden rounded-2xl border border-line bg-paper p-1.5 shadow-[0_20px_50px_-18px_rgba(28,31,26,0.4)]"
            style={{ width, ...(align === 'right' ? { right: 0 } : { left: 0 }) }}
          >
            {heading && (
              <div className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
                {heading}
              </div>
            )}
            {options.map((o) => {
              const active = o.value === value
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[13px] transition-colors ${
                    active
                      ? 'bg-forest-800/[0.06] font-semibold text-ink'
                      : 'text-ink-3 hover:bg-line-soft'
                  }`}
                >
                  <span className="flex-1">
                    {o.label}
                    {o.hint && (
                      <span className="ml-1 text-[11px] text-faint">{o.hint}</span>
                    )}
                  </span>
                  {active && <span className="text-forest-600">✓</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
