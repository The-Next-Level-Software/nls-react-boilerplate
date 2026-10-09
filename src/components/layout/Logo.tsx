import { cn } from '@/lib/cn'
import { useConfig } from '@/store/config.store'

const sizes = {
  sm: { box: 'size-7 text-xs', img: 'h-7', icon: 'w-7', name: 'text-sm' },
  md: { box: 'size-8 text-sm', img: 'h-8', icon: 'w-8', name: 'text-[0.95rem]' },
  lg: { box: 'size-10 text-base', img: 'h-10', icon: 'w-10', name: 'text-lg' },
}

interface LogoProps {
  /** Rendered on a dark background — picks `logoDark` when available. */
  onDark?: boolean
  /** Placeholder mark uses the sidebar's colors inverted (for brand-colored sidebars). */
  inverted?: boolean
  /** Show only the icon (collapsed sidebar). */
  iconOnly?: boolean
  showTagline?: boolean
  className?: string
}

export function Logo({ onDark, inverted, iconOnly, showTagline, className }: LogoProps) {
  const { brand } = useConfig()
  const size = sizes[brand.logoSize] ?? sizes.md
  const logo = (onDark && brand.logoDark) || brand.logo
  const src = iconOnly ? brand.logoIcon || logo : logo
  const croppedIcon = iconOnly && !brand.logoIcon
  const showName = brand.showName && !iconOnly

  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      {src ? (
        <img
          src={src}
          alt={showName ? '' : brand.name}
          className={cn(
            'shrink-0',
            size.img,
            iconOnly ? cn(size.icon, croppedIcon ? 'object-cover object-left' : 'object-contain') : 'w-auto max-w-44 object-contain',
          )}
        />
      ) : (
        <span
          aria-hidden={showName}
          className={cn(
            'flex shrink-0 items-center justify-center rounded-lg font-bold',
            size.box,
            inverted ? 'bg-sidebar-foreground text-sidebar' : 'bg-primary text-primary-foreground',
          )}
        >
          {brand.name.trim()[0]?.toUpperCase() ?? 'A'}
        </span>
      )}
      {showName && (
        <div className="min-w-0 leading-tight">
          <p className={cn('truncate font-heading font-semibold', size.name)}>{brand.name}</p>
          {showTagline && brand.tagline && <p className="truncate text-xs opacity-60">{brand.tagline}</p>}
        </div>
      )}
    </div>
  )
}
