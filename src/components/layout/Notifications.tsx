import { Bell } from 'lucide-react'
import { DropdownMenu } from '@/components/ui/DropdownMenu'
import { formatRelative } from '@/lib/format'

// Placeholder data — replace with your notifications source.
const HOUR = 3_600_000
const notifications = [
  { id: 1, title: 'New user signed up', body: 'Olivia Smith created an account.', at: Date.now() - 0.2 * HOUR, unread: true },
  { id: 2, title: 'Weekly report ready', body: 'Your analytics summary is available.', at: Date.now() - 5 * HOUR, unread: true },
  { id: 3, title: 'Role updated', body: 'Liam Garcia is now an editor.', at: Date.now() - 30 * HOUR, unread: false },
]

export function Notifications() {
  const unread = notifications.filter((n) => n.unread).length

  return (
    <DropdownMenu
      label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
      triggerClassName="relative inline-flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
      trigger={
        <>
          <Bell className="size-4" />
          {unread > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-surface" />}
        </>
      }
      className="w-80 p-0"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">Notifications</p>
        {unread > 0 && <span className="text-xs text-muted-foreground">{unread} unread</span>}
      </div>
      <ul className="max-h-80 overflow-y-auto py-1">
        {notifications.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              role="menuitem"
              className="flex w-full gap-3 px-4 py-2.5 text-left outline-none hover:bg-muted focus-visible:bg-muted"
            >
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${n.unread ? 'bg-primary' : 'bg-transparent'}`} />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{n.title}</span>
                <span className="block text-sm text-muted-foreground">{n.body}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{formatRelative(n.at)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </DropdownMenu>
  )
}
