import { useSearchParams } from 'react-router'
import type { UserQuery, UserSortKey } from '@/services/users.service'
import type { Role, SortDirection, UserStatus } from '@/types'

const DEFAULT_PAGE_SIZE = 10

/**
 * Users list query stored in the URL (?search=&role=&status=&from=&to=&sort=&dir=&page=&size=),
 * so filtered views survive reloads and can be shared as links.
 */
export function useUserQuery() {
  const [params, setParams] = useSearchParams()

  const query: UserQuery = {
    search: params.get('search') ?? '',
    role: (params.get('role') as Role | null) ?? '',
    status: (params.get('status') as UserStatus | null) ?? '',
    joinedFrom: params.get('from') ?? '',
    joinedTo: params.get('to') ?? '',
    sortBy: (params.get('sort') as UserSortKey | null) ?? 'createdAt',
    sortDir: (params.get('dir') as SortDirection | null) ?? 'desc',
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: Number(params.get('size')) || DEFAULT_PAGE_SIZE,
  }

  /** Merge changes into the URL. Any change other than `page` resets to page 1. */
  const update = (changes: Record<string, string | number | null>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(changes)) {
          if (value === null || value === '') next.delete(key)
          else next.set(key, String(value))
        }
        if (!('page' in changes)) next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  const clearFilters = () => update({ search: null, role: null, status: null, from: null, to: null })

  const activeFilterCount = [query.search, query.role, query.status, query.joinedFrom || query.joinedTo].filter(Boolean).length

  return { query, update, clearFilters, activeFilterCount }
}
