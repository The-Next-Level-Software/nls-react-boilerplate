import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appConfig } from '@/config/app.config'
import { storageKey } from '@/lib/storage'

interface UiState {
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: appConfig.layout.sidebarCollapsed,
      mobileNavOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
    }),
    {
      name: storageKey('ui'),
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    },
  ),
)
