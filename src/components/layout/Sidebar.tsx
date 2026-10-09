import { NavLink } from 'react-router'
import { ChevronsLeft, ChevronsRight, LifeBuoy, X } from 'lucide-react'
import { navigation } from '@/config/navigation'
import { cn } from '@/lib/cn'
import { customizerEnabled, useConfig } from '@/store/config.store'
import { useUiStore } from '@/store/ui.store'
import { isSidebarDark } from '@/theme/apply-theme'
import type { NavStyle } from '@/theme/types'
import { useResolvedMode } from '@/theme/use-theme'
import { Logo } from './Logo'

const itemBase = 'relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors'
const itemIdle = 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground'
const itemActive: Record<NavStyle, string> = {
  soft: 'bg-sidebar-active text-sidebar-active-foreground',
  bar: 'bg-sidebar-hover text-sidebar-foreground before:absolute before:inset-y-2 before:-left-3 before:w-[3px] before:rounded-r-full before:bg-sidebar-accent',
  solid: 'bg-sidebar-accent text-sidebar-accent-foreground shadow-xs',
}

export function Sidebar() {
  const config = useConfig()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const mobileOpen = useUiStore((s) => s.mobileNavOpen)
  const setMobileOpen = useUiStore((s) => s.setMobileNavOpen)
  const mode = useResolvedMode()

  const closeMobile = () => setMobileOpen(false)
  const hideWhenCollapsed = collapsed && 'lg:hidden'
  const logoProps = { onDark: isSidebarDark(config, mode), inverted: config.layout.sidebarStyle === 'brand' }
  const sections = navigation
    .map((section) => ({ ...section, items: section.items.filter((item) => !item.customizer || customizerEnabled) }))
    .filter((section) => section.items.length > 0)

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden
        onClick={closeMobile}
        className={cn(
          'fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-(--sidebar-width) flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
          'transition-[width,translate] duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed && 'lg:w-[4.25rem]',
        )}
      >
        <div className={cn('flex h-16 shrink-0 items-center justify-between px-4', collapsed && 'lg:justify-center lg:px-0')}>
          <Logo {...logoProps} className={cn(collapsed && 'lg:hidden')} />
          {collapsed && <Logo {...logoProps} iconOnly className="hidden lg:flex" />}
          <button
            type="button"
            onClick={closeMobile}
            className="rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 scrollbar-thin overflow-y-auto px-3 py-2" aria-label="Main">
          {sections.map((section, i) => (
            <div key={section.title ?? i} className={config.layout.sidebarSectionTitles ? 'mb-5' : 'mb-1'}>
              {section.title && config.layout.sidebarSectionTitles && (
                <p className={cn('mb-1.5 px-3 text-[0.7rem] font-medium tracking-wider text-sidebar-muted uppercase', hideWhenCollapsed)}>
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={closeMobile}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          itemBase,
                          collapsed && 'lg:justify-center lg:px-0 lg:before:hidden',
                          isActive ? itemActive[config.layout.navStyle] : itemIdle,
                        )
                      }
                    >
                      <item.icon className="size-[1.1rem] shrink-0" />
                      <span className={cn('truncate', hideWhenCollapsed)}>{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn('ml-auto rounded-full bg-primary px-1.5 text-[0.65rem] text-primary-foreground', hideWhenCollapsed)}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-sidebar-border p-3">
          {config.features.helpLink && (
            <a
              href={`mailto:${config.supportEmail}`}
              title={collapsed ? 'Help & support' : undefined}
              className={cn(itemBase, itemIdle, collapsed && 'lg:justify-center lg:px-0')}
            >
              <LifeBuoy className="size-[1.1rem] shrink-0" />
              <span className={cn(hideWhenCollapsed)}>Help & support</span>
            </a>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(itemBase, itemIdle, 'hidden w-full lg:flex', collapsed && 'lg:justify-center lg:px-0')}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight className="size-[1.1rem]" /> : <ChevronsLeft className="size-[1.1rem]" />}
            <span className={cn(hideWhenCollapsed)}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  )
}
