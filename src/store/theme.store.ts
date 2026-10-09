import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appConfig } from '@/config/app.config'
import { storageKey } from '@/lib/storage'
import type { ThemeMode } from '@/theme/types'

interface ThemeState {
  /** The user's light/dark/system choice. Everything else comes from the app config. */
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: appConfig.defaultMode,
      setMode: (mode) => set({ mode }),
    }),
    {
      name: storageKey('theme'),
      partialize: ({ mode }) => ({ mode }),
      merge: (persisted, current) => ({ ...current, mode: (persisted as Partial<ThemeState> | undefined)?.mode ?? current.mode }),
    },
  ),
)
