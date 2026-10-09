import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useToastStore, type ToastVariant } from '@/store/toast.store'

const icons: Record<ToastVariant, typeof Info> = { success: CheckCircle2, error: XCircle, info: Info }
const colors: Record<ToastVariant, string> = { success: 'text-success', error: 'text-danger', info: 'text-info' }

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.variant]
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-lg"
          >
            <Icon className={cn('mt-0.5 size-4 shrink-0', colors[t.variant])} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
