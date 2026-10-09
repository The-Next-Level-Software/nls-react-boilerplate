import { Outlet, useNavigation } from 'react-router'
import { cn } from '@/lib/cn'
import { useConfig } from '@/store/config.store'
import { useUiStore } from '@/store/ui.store'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  const { layout } = useConfig()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const navigating = useNavigation().state === 'loading'

  return (
    <div className="min-h-dvh">
      {navigating && (
        <div className="fixed inset-x-0 top-0 z-50 h-0.5 animate-pulse bg-primary" role="progressbar" aria-label="Loading page" />
      )}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <div
        className={cn(
          'flex min-h-dvh flex-col transition-[padding] duration-200',
          collapsed ? 'lg:pl-[4.25rem]' : 'lg:pl-(--sidebar-width)',
        )}
      >
        <Topbar />
        <main id="main" className={cn('w-full flex-1 px-4 py-6 sm:px-6 lg:py-8', layout.contentWidth === 'boxed' && 'mx-auto max-w-7xl')}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
