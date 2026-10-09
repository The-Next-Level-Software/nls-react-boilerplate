import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SegmentedControlProps<T extends string | number> {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: ReactNode; title?: string }[]
  size?: 'sm' | 'md'
  className?: string
  'aria-label'?: string
}

export function SegmentedControl<T extends string | number>({
  value,
  onChange,
  options,
  size = 'md',
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" className={cn('inline-flex rounded-lg bg-muted p-0.5', className)} {...props}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors [&_svg]:size-4',
              size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-sm',
              active ? 'bg-surface text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
