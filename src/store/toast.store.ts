import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (toast) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => get().dismiss(id), 4000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Fire-and-forget helpers usable anywhere, including outside React. */
export const toast = {
  success: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: 'success' }),
  error: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: 'error' }),
  info: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: 'info' }),
}
