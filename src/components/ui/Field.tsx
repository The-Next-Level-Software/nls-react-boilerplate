import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

interface FieldProps {
  label?: ReactNode
  htmlFor?: string
  hint?: ReactNode
  error?: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

/** Label + control + hint/error, stacked. */
export function Field({ label, htmlFor, hint, error, action, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || action) && (
        <div className="flex items-center justify-between gap-2">
          {label && <Label htmlFor={htmlFor}>{label}</Label>}
          {action}
        </div>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
