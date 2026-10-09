import { createContext, use, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

const MenuContext = createContext<() => void>(() => {})

interface DropdownMenuProps {
  trigger: ReactNode
  /** Accessible name for icon-only triggers. */
  label?: string
  triggerClassName?: string
  align?: 'start' | 'end'
  className?: string
  children: ReactNode
}

/**
 * Menu portaled to <body> with `position: fixed`, so it is never clipped by scrolling
 * containers (tables) or offset by ancestors that create a containing block
 * (e.g. the blurred top bar). Closes on outside click, Esc, scroll and resize.
 */
export function DropdownMenu({ trigger, label, triggerClassName, align = 'end', className, children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useLayoutEffect(() => {
    const t = triggerRef.current
    const m = menuRef.current
    if (!open || !t || !m) return
    const tr = t.getBoundingClientRect()
    const mr = m.getBoundingClientRect()
    let top = tr.bottom + 6
    if (top + mr.height > window.innerHeight - 8) top = Math.max(8, tr.top - mr.height - 6)
    let left = align === 'end' ? tr.right - mr.width : tr.left
    left = Math.min(Math.max(8, left), window.innerWidth - mr.width - 8)
    m.style.top = `${top}px`
    m.style.left = `${left}px`
    m.style.visibility = 'visible'
    m.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [open, align])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close()
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const index = items.indexOf(document.activeElement as HTMLElement)
    const next = e.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            onKeyDown={onMenuKeyDown}
            style={{ visibility: 'hidden' }}
            className={cn(
              'fixed z-50 min-w-44 rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg',
              className,
            )}
          >
            <MenuContext value={() => setOpen(false)}>{children}</MenuContext>
          </div>,
          document.body,
        )}
    </>
  )
}

interface DropdownItemProps {
  onSelect?: () => void
  icon?: ReactNode
  destructive?: boolean
  disabled?: boolean
  children: ReactNode
}

export function DropdownItem({ onSelect, icon, destructive, disabled, children }: DropdownItemProps) {
  const close = use(MenuContext)
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={() => {
        close()
        onSelect?.()
      }}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left outline-none',
        'hover:bg-muted focus-visible:bg-muted disabled:opacity-50 [&_svg]:size-4 [&_svg]:text-muted-foreground',
        destructive && 'text-danger [&_svg]:text-danger',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return <div className="px-2.5 py-1.5 text-xs text-muted-foreground">{children}</div>
}

export function DropdownSeparator() {
  return <div role="separator" className="-mx-1 my-1 h-px bg-border" />
}
