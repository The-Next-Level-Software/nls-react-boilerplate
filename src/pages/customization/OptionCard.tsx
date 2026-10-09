import type { ReactNode } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { ColorInput } from '@/components/ui/ColorInput'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/cn'

export function OptionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <div className="divide-y divide-border p-5">{children}</div>
    </Card>
  )
}

interface OptionRowProps {
  label: string
  description?: string
  htmlFor?: string
  children: ReactNode
}

/** Label/description on the left, control on the right (stacked on small screens). */
export function OptionRow({ label, description, htmlFor, children }: OptionRowProps) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-start md:justify-between md:gap-8">
      <div className="md:max-w-60">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="min-w-0 md:flex md:flex-1 md:justify-end">{children}</div>
    </div>
  )
}

interface SwitchRowProps extends Omit<OptionRowProps, 'children'> {
  checked: boolean
  onChange: (value: boolean) => void
}

export function SwitchRow({ label, description, checked, onChange }: SwitchRowProps) {
  return (
    <OptionRow label={label} description={description}>
      <Switch aria-label={label} checked={checked} onChange={onChange} />
    </OptionRow>
  )
}

interface ChoiceGridProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string; preview?: ReactNode }[]
  columns?: 2 | 3 | 4
  'aria-label': string
}

/** Visual radio cards with an optional preview thumbnail. */
export function ChoiceGrid<T extends string>({ value, onChange, options, columns = 4, ...props }: ChoiceGridProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={props['aria-label']}
      className={cn('grid w-full gap-2 md:max-w-md', { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }[columns])}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-colors',
            value === o.value ? 'border-primary bg-primary-soft' : 'border-border hover:bg-muted',
          )}
        >
          {o.preview}
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Hex color that can fall back to a default (`null`). */
export function NullableColor({
  value,
  fallback,
  onChange,
  label,
}: {
  value: string | null
  fallback: string
  onChange: (value: string | null) => void
  label: string
}) {
  return (
    <div className="flex items-center gap-2">
      <ColorInput aria-label={label} value={value ?? fallback} onChange={onChange} />
      <button
        type="button"
        onClick={() => onChange(null)}
        disabled={value === null}
        className="w-14 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none"
      >
        {value === null ? 'Default' : 'Reset'}
      </button>
    </div>
  )
}
