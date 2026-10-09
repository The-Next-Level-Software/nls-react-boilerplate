import type { Role, UserStatus } from '@/types'

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

export const roleBadge: Record<Role, { label: string; variant: BadgeVariant }> = {
  admin: { label: 'Admin', variant: 'primary' },
  editor: { label: 'Editor', variant: 'info' },
  viewer: { label: 'Viewer', variant: 'neutral' },
}

export const statusBadge: Record<UserStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: 'Active', variant: 'success' },
  invited: { label: 'Invited', variant: 'warning' },
  suspended: { label: 'Suspended', variant: 'danger' },
}

export const roleOptions = Object.entries(roleBadge).map(([value, { label }]) => ({ value, label }))
export const statusOptions = Object.entries(statusBadge).map(([value, { label }]) => ({ value, label }))
