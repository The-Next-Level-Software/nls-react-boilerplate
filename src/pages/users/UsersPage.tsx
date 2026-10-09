import { useRef, useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '@/components/ui/DropdownMenu'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input, inputClass } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/Modal'
import { Pagination } from '@/components/ui/Pagination'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Spinner'
import { cn } from '@/lib/cn'
import { formatDate, formatRelative } from '@/lib/format'
import { usersService, type UserSortKey } from '@/services/users.service'
import { toast } from '@/store/toast.store'
import type { User, UserStatus } from '@/types'
import { useUserQuery } from './use-user-query'
import { UserFormModal } from './UserFormModal'
import { roleBadge, roleOptions, statusBadge, statusOptions } from './user-meta'

function downloadCsv(users: User[]) {
  const header = ['Name', 'Email', 'Role', 'Status', 'Joined', 'Last active']
  const rows = users.map((u) => [u.name, u.email, u.role, u.status, u.createdAt, u.lastActiveAt ?? ''])
  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'users.csv' })
  a.click()
  URL.revokeObjectURL(url)
}

export function UsersPage() {
  const queryClient = useQueryClient()
  const { query, update, clearFilters, activeFilterCount } = useUserQuery()
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['users', query],
    queryFn: () => usersService.list(query),
    placeholderData: keepPreviousData,
  })

  // Search box: local state for instant typing, URL updated after a short pause.
  const [searchInput, setSearchInput] = useState(query.search ?? '')
  const [syncedSearch, setSyncedSearch] = useState(query.search ?? '')
  if ((query.search ?? '') !== syncedSearch) {
    setSyncedSearch(query.search ?? '')
    setSearchInput(query.search ?? '')
  }
  const searchTimer = useRef<number>(undefined)
  const onSearchChange = (value: string) => {
    setSearchInput(value)
    window.clearTimeout(searchTimer.current)
    searchTimer.current = window.setTimeout(() => {
      setSelected(new Set())
      update({ search: value.trim() })
    }, 300)
  }

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<User | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<string[] | null>(null)

  /** Changing filters, sort or page clears the selection. */
  const applyChange = (changes: Parameters<typeof update>[0]) => {
    setSelected(new Set())
    update(changes)
  }

  const removeMutation = useMutation({
    mutationFn: usersService.remove,
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setSelected(new Set())
      setDeleting(null)
      toast.success(ids.length > 1 ? `${ids.length} users deleted` : 'User deleted')
    },
    onError: (err) => toast.error('Delete failed', err.message),
  })

  const statusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: UserStatus }) =>
      Promise.all(ids.map((id) => usersService.update(id, { status }))),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setSelected(new Set())
      toast.success(`${ids.length > 1 ? `${ids.length} users` : 'User'} ${status === 'active' ? 'activated' : 'suspended'}`)
    },
    onError: (err) => toast.error('Update failed', err.message),
  })

  const rows = data?.data ?? []
  const allSelected = rows.length > 0 && rows.every((u) => selected.has(u.id))
  const someSelected = rows.some((u) => selected.has(u.id))

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((u) => u.id)))
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const sortBy = (key: UserSortKey) => {
    const dir = query.sortBy === key && query.sortDir === 'asc' ? 'desc' : 'asc'
    applyChange({ sort: key, dir })
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (user: User) => {
    setEditing(user)
    setFormOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage team members, their roles and access."
        actions={
          <>
            <Button variant="outline" onClick={() => downloadCsv(rows)} disabled={!rows.length}>
              <Download />
              Export
            </Button>
            <Button onClick={openCreate}>
              <Plus />
              Add user
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center">
          <div className="xl:max-w-xs xl:flex-1">
            <Input
              type="search"
              icon={<Search />}
              placeholder="Search name or email…"
              aria-label="Search users"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <Select
              aria-label="Filter by role"
              value={query.role}
              onChange={(e) => applyChange({ role: e.target.value })}
              placeholder="All roles"
              options={roleOptions}
              className="sm:w-36"
            />
            <Select
              aria-label="Filter by status"
              value={query.status}
              onChange={(e) => applyChange({ status: e.target.value })}
              placeholder="All statuses"
              options={statusOptions}
              className="sm:w-36"
            />
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="date"
                aria-label="Joined from"
                value={query.joinedFrom}
                max={query.joinedTo || undefined}
                onChange={(e) => applyChange({ from: e.target.value })}
                className={cn(inputClass, 'sm:w-40')}
              />
              <span className="text-sm text-muted-foreground">to</span>
              <input
                type="date"
                aria-label="Joined to"
                value={query.joinedTo}
                min={query.joinedFrom || undefined}
                onChange={(e) => applyChange({ to: e.target.value })}
                className={cn(inputClass, 'sm:w-40')}
              />
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelected(new Set())
                  setSearchInput('')
                  clearFilters()
                }}
                className="col-span-2 justify-self-start"
              >
                <X />
                Clear filters ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-primary-soft px-4 py-2.5 text-sm">
            <span className="mr-auto font-medium">{selected.size} selected</span>
            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ ids: [...selected], status: 'active' })}>
              <UserCheck />
              Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({ ids: [...selected], status: 'suspended' })}>
              <UserX />
              Suspend
            </Button>
            <Button size="sm" variant="danger" onClick={() => setDeleting([...selected])}>
              <Trash2 />
              Delete
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="relative scrollbar-thin overflow-x-auto">
          {isFetching && !isPending && <div className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse bg-primary" />}
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-muted/50 text-left text-xs font-medium text-muted-foreground">
              <tr>
                <th className="w-12 py-3 pl-4">
                  <Checkbox
                    aria-label="Select all on this page"
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <SortHeader label="User" sortKey="name" query={query} onSort={sortBy} />
                <SortHeader label="Role" sortKey="role" query={query} onSort={sortBy} />
                <SortHeader label="Status" sortKey="status" query={query} onSort={sortBy} />
                <SortHeader label="Joined" sortKey="createdAt" query={query} onSort={sortBy} />
                <SortHeader label="Last active" sortKey="lastActiveAt" query={query} onSort={sortBy} />
                <th className="w-14 py-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending &&
                Array.from({ length: query.pageSize > 10 ? 10 : query.pageSize }, (_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3">
                      <Skeleton className="h-9" />
                    </td>
                  </tr>
                ))}
              {rows.map((u) => (
                <tr key={u.id} className={cn('transition-colors hover:bg-muted/40', selected.has(u.id) && 'bg-primary-soft/60')}>
                  <td className="py-3 pl-4">
                    <Checkbox aria-label={`Select ${u.name}`} checked={selected.has(u.id)} onChange={() => toggleOne(u.id)} />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} src={u.avatar} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={roleBadge[u.role].variant}>{roleBadge[u.role].label}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusBadge[u.status].variant} dot>
                      {statusBadge[u.status].label}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                    {u.lastActiveAt ? formatRelative(u.lastActiveAt) : '—'}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <DropdownMenu
                      label={`Actions for ${u.name}`}
                      trigger={<MoreHorizontal className="size-4" />}
                      triggerClassName="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <DropdownItem icon={<Pencil />} onSelect={() => openEdit(u)}>
                        Edit
                      </DropdownItem>
                      {u.status === 'suspended' ? (
                        <DropdownItem icon={<UserCheck />} onSelect={() => statusMutation.mutate({ ids: [u.id], status: 'active' })}>
                          Activate
                        </DropdownItem>
                      ) : (
                        <DropdownItem icon={<UserX />} onSelect={() => statusMutation.mutate({ ids: [u.id], status: 'suspended' })}>
                          Suspend
                        </DropdownItem>
                      )}
                      <DropdownSeparator />
                      <DropdownItem icon={<Trash2 />} destructive onSelect={() => setDeleting([u.id])}>
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isError && (
            <EmptyState
              title="Couldn't load users"
              description="Check your connection and try again."
              action={
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            />
          )}
          {!isPending && !isError && rows.length === 0 && (
            <EmptyState
              icon={<Users />}
              title="No users found"
              description={activeFilterCount ? 'Try adjusting your search or filters.' : 'Add your first user to get started.'}
              action={
                activeFilterCount ? (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : (
                  <Button size="sm" onClick={openCreate}>
                    <Plus />
                    Add user
                  </Button>
                )
              }
            />
          )}
        </div>

        {data && data.total > 0 && (
          <div className="border-t border-border px-4 py-3">
            <Pagination
              page={query.page}
              pageSize={query.pageSize}
              total={data.total}
              onPageChange={(page) => applyChange({ page })}
              onPageSizeChange={(size) => applyChange({ size })}
            />
          </div>
        )}
      </Card>

      <UserFormModal open={formOpen} onClose={() => setFormOpen(false)} user={editing} />

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && removeMutation.mutate(deleting)}
        loading={removeMutation.isPending}
        destructive
        title={deleting && deleting.length > 1 ? `Delete ${deleting.length} users?` : 'Delete user?'}
        description="This action cannot be undone. The user will lose access immediately."
        confirmLabel="Delete"
      />
    </>
  )
}

interface SortHeaderProps {
  label: string
  sortKey: UserSortKey
  query: { sortBy?: UserSortKey; sortDir?: 'asc' | 'desc' }
  onSort: (key: UserSortKey) => void
}

function SortHeader({ label, sortKey, query, onSort }: SortHeaderProps) {
  const active = query.sortBy === sortKey
  const Icon = !active ? ArrowUpDown : query.sortDir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th className="py-3 pr-4" aria-sort={active ? (query.sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn('inline-flex items-center gap-1 rounded hover:text-foreground', active && 'text-foreground')}
      >
        {label}
        <Icon className={cn('size-3.5', !active && 'opacity-50')} />
      </button>
    </th>
  )
}
