import { LayoutDashboard, Palette, Settings, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Only match the exact path (useful for "/"). */
  end?: boolean
  badge?: string
  /** Shown only when the Customization page is enabled (see `features.customizer`). */
  customizer?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

/** Sidebar navigation. Add an entry here and a matching route in `src/router.tsx`. */
export const navigation: NavSection[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Management',
    items: [{ label: 'Users', to: '/users', icon: Users }],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', to: '/settings', icon: Settings },
      { label: 'Customization', to: '/customization', icon: Palette, customizer: true },
    ],
  },
]
