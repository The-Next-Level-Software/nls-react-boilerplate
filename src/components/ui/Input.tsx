import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export const inputClass =
  'h-9 w-full min-w-0 rounded-lg border border-input bg-surface px-3 text-sm text-foreground shadow-xs transition-colors ' +
  'placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-ring focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger aria-invalid:focus:ring-danger/25'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  trailing?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export function Input({ className, icon, trailing, ...props }: InputProps) {
  if (!icon && !trailing) return <input className={cn(inputClass, className)} {...props} />
  return (
    <div className="relative w-full">
      {icon && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground [&_svg]:size-4">{icon}</span>
      )}
      <input className={cn(inputClass, icon && 'pl-9', trailing && 'pr-10', className)} {...props} />
      {trailing && <span className="absolute inset-y-0 right-1 flex items-center">{trailing}</span>}
    </div>
  )
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, 'h-auto min-h-20 py-2', className)} {...props} />
}
