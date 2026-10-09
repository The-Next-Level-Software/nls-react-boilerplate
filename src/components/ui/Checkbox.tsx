import { useEffect, useRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean
}

export function Checkbox({ className, indeterminate = false, ...props }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('size-4 cursor-pointer rounded border-input accent-primary disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}
