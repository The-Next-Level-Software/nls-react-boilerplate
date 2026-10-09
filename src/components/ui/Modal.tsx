import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  footer?: ReactNode
  size?: keyof typeof sizes
  children?: ReactNode
}

/**
 * Accessible modal built on the native <dialog> element (focus trap, Esc to close,
 * top-layer rendering). Children are unmounted while closed so forms reset on reopen.
 */
export function Modal({ open, onClose, title, description, footer, size = 'md', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-visible bg-transparent p-0 text-foreground',
        'backdrop:bg-black/40 backdrop:backdrop-blur-[2px]',
        sizes[size],
      )}
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-2rem)] flex-col rounded-xl border border-border bg-surface shadow-xl">
          <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
            <div>
              <h2 className="text-base">{title}</h2>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close" className="-mt-1 -mr-2">
              <X />
            </Button>
          </div>
          <div className="scrollbar-thin overflow-y-auto px-5 pb-5">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>}
        </div>
      )}
    </dialog>
  )
}

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: ReactNode
  description?: ReactNode
  confirmLabel?: string
  destructive?: boolean
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  destructive,
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}
