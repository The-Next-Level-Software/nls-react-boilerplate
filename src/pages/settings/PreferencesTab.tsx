import { Link } from 'react-router'
import { Monitor, Moon, Palette, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/cn'
import { customizerEnabled, useConfig } from '@/store/config.store'
import { useThemeStore } from '@/store/theme.store'
import { useUiStore } from '@/store/ui.store'
import type { ThemeMode } from '@/theme/types'
import { SettingsSection } from './SettingsSection'

const modes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function PreferencesTab() {
  const { features } = useConfig()
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  return (
    <SettingsSection title="Appearance" description="Choose how the interface looks to you.">
      {features.modeToggle && (
        <div role="radiogroup" aria-label="Color mode" className="grid grid-cols-3 gap-3">
          {modes.map((m) => (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={mode === m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors',
                mode === m.value ? 'border-primary bg-primary-soft text-primary' : 'border-border hover:bg-muted',
              )}
            >
              <m.icon className="size-5" />
              {m.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div>
          <p className="text-sm font-medium">Compact sidebar</p>
          <p className="text-sm text-muted-foreground">Show only icons in the navigation.</p>
        </div>
        <Switch aria-label="Compact sidebar" checked={collapsed} onChange={toggleSidebar} />
      </div>
      {customizerEnabled && (
        <Link to="/customization" className="flex items-center gap-2 pt-1 text-sm font-medium text-primary hover:underline">
          <Palette className="size-4" />
          Customize branding, colors, fonts and layout
        </Link>
      )}
    </SettingsSection>
  )
}
