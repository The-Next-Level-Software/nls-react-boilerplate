import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { storageKey } from '@/lib/storage'
import type { AuthUser } from '@/types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  /** Persist the session across browser restarts (localStorage) vs. this tab only (sessionStorage). */
  remember: boolean
  setSession: (session: { user: AuthUser; token: string }, remember: boolean) => void
  updateUser: (patch: Partial<AuthUser>) => void
  clear: () => void
}

const sessionAwareStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const remember = Boolean(JSON.parse(value)?.state?.remember)
    ;(remember ? sessionStorage : localStorage).removeItem(name)
    ;(remember ? localStorage : sessionStorage).setItem(name, value)
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      remember: true,
      setSession: ({ user, token }, remember) => set({ user, token, remember }),
      updateUser: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      clear: () => set({ user: null, token: null }),
    }),
    {
      name: storageKey('auth'),
      storage: createJSONStorage(() => sessionAwareStorage),
      partialize: ({ user, token, remember }) => ({ user, token, remember }),
    },
  ),
)
