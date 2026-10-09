import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'

const sizes = { sm: 'size-7 text-[0.65rem]', md: 'size-9 text-xs', lg: 'size-16 text-lg' }

interface AvatarProps {
  name: string
  src?: string | null
  size?: keyof typeof sizes
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const classes = cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full', sizes[size], className)
  if (src) return <img src={src} alt={name} className={cn(classes, 'object-cover')} />
  return (
    <span className={cn(classes, 'bg-primary-soft font-semibold text-primary')} aria-hidden>
      {initials(name)}
    </span>
  )
}
