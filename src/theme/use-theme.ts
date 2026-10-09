import { useSyncExternalStore } from 'react'
import { getConfig, useConfig } from '@/store/config.store'
import { useThemeStore } from '@/store/theme.store'
import type { AppConfig, ResolvedMode, ThemeMode } from './types'

const darkQuery = '(prefers-color-scheme: dark)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(darkQuery)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

export const systemPrefersDark = () => window.matchMedia(darkQuery).matches

/** The user's choice, or the configured default when the mode toggle is disabled. */
export function effectiveMode(config: AppConfig, userMode: ThemeMode): ThemeMode {
  return config.features.modeToggle ? userMode : config.defaultMode
}

export function resolveMode(mode: ThemeMode, prefersDark: boolean): ResolvedMode {
  return mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode
}

/** Resolved mode for non-React code (initial paint). */
export function currentResolvedMode(): ResolvedMode {
  return resolveMode(effectiveMode(getConfig(), useThemeStore.getState().mode), systemPrefersDark())
}

/** The light/dark mode actually in effect, following the OS when set to `system`. */
export function useResolvedMode(): ResolvedMode {
  const config = useConfig()
  const mode = useThemeStore((s) => s.mode)
  const prefersDark = useSyncExternalStore(subscribe, systemPrefersDark)
  return resolveMode(effectiveMode(config, mode), prefersDark)
}
