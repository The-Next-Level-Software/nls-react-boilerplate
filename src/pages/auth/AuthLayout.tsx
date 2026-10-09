import type { ReactNode } from 'react'
import { Logo } from '@/components/layout/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { cn } from '@/lib/cn'
import { copyrightText } from '@/lib/format'
import { useConfig } from '@/store/config.store'
import type { LoginPattern } from '@/theme/types'

const patterns: Record<LoginPattern, string> = {
  none: '',
  dots: '[background-image:radial-gradient(var(--input)_1px,transparent_1px)] [background-size:20px_20px]',
  grid: '[background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px]',
}

/** Shell for unauthenticated pages. Everything here follows `appConfig.login`. */
export function AuthLayout({ children }: { children: ReactNode }) {
  const { login, features, copyright } = useConfig()

  if (login.layout === 'centered') {
    return (
      <div className={cn('relative flex min-h-dvh flex-col items-center justify-center px-4 py-10', patterns[login.pattern])}>
        {features.modeToggle && (
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
        )}
        <Logo className="mb-8" />
        <div className="w-full max-w-sm card p-6 sm:p-8">{children}</div>
        <p className="mt-8 text-xs text-muted-foreground">{copyrightText(copyright)}</p>
      </div>
    )
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className={cn('flex flex-col px-6 py-6 sm:px-10', login.panelPosition === 'left' && 'lg:order-2')}>
        <div className="flex items-center justify-between">
          <Logo />
          {features.modeToggle && <ThemeToggle />}
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-xs text-muted-foreground">{copyrightText(copyright)}</p>
      </div>
      <BrandPanel />
    </div>
  )
}

function BrandPanel() {
  const { login } = useConfig()
  return (
    <div className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-end">
      {login.backgroundImage && (
        <>
          <img src={login.backgroundImage} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      )}
      <div className={login.backgroundImage ? 'relative max-w-md text-white' : 'relative max-w-md'}>
        <h2 className="text-3xl">{login.headline}</h2>
        <p className="mt-3 text-base opacity-75">{login.subheadline}</p>
      </div>
    </div>
  )
}
