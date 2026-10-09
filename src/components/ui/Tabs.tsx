import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TabsProps<T extends string> {
  value: T
  onChange: (value: T) => void
  tabs: { value: T; label: ReactNode; icon?: ReactNode }[]
  className?: string
}

/** Underlined tab bar. Render the active panel yourself based on `value`. */
export function Tabs<T extends string>({ value, onChange, tabs, className }: TabsProps<T>) {
  return (
    <div role="tablist" className={cn('flex scrollbar-thin gap-1 overflow-x-auto border-b border-border', className)}>
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              '-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors [&_svg]:size-4',
              active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
