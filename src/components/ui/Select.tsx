import type { Ref, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { inputClass } from './Input'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[]
  placeholder?: string
  ref?: Ref<HTMLSelectElement>
}

export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className={cn('relative', className)}>
      <select className={cn(inputClass, 'appearance-none pr-9')} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
