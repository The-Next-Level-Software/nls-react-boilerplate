import { useMockApi } from '@/config/app.config'
import { mockUsers } from '@/mocks/users'
import type { Paginated, Role, SortDirection, User, UserStatus } from '@/types'
import { ApiError, delay, http } from './http'

export type UserSortKey = 'name' | 'role' | 'status' | 'createdAt' | 'lastActiveAt'

export interface UserQuery {
  search?: string
  role?: Role | ''
  status?: UserStatus | ''
  joinedFrom?: string
  joinedTo?: string
  sortBy?: UserSortKey
  sortDir?: SortDirection
  page: number
  pageSize: number
}

export type UserInput = Pick<User, 'name' | 'email' | 'role' | 'status'>

function queryMockUsers(q: UserQuery): Paginated<User> {
  const search = q.search?.trim().toLowerCase()
  const from = q.joinedFrom ? new Date(q.joinedFrom).getTime() : null
  const to = q.joinedTo ? new Date(q.joinedTo).getTime() + 86_399_999 : null

  const filtered = mockUsers.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search) && !u.email.includes(search)) return false
    if (q.role && u.role !== q.role) return false
    if (q.status && u.status !== q.status) return false
    const created = new Date(u.createdAt).getTime()
    if (from !== null && created < from) return false
    if (to !== null && created > to) return false
    return true
  })

  const { sortBy = 'createdAt', sortDir = 'desc' } = q
  const dir = sortDir === 'asc' ? 1 : -1
  filtered.sort((a, b) => {
    const av = a[sortBy] ?? ''
    const bv = b[sortBy] ?? ''
    return av < bv ? -dir : av > bv ? dir : 0
  })

  const start = (q.page - 1) * q.pageSize
  return { data: filtered.slice(start, start + q.pageSize), total: filtered.length, page: q.page, pageSize: q.pageSize }
}

function assertUniqueEmail(email: string, ignoreId?: string) {
  if (mockUsers.some((u) => u.email === email.toLowerCase() && u.id !== ignoreId)) {
    throw new ApiError(422, 'A user with this email already exists')
  }
}

export const usersService = {
  async list(query: UserQuery): Promise<Paginated<User>> {
    if (useMockApi) {
      await delay(300)
      return queryMockUsers(query)
    }
    return http.get<Paginated<User>>('/users', { ...query })
  },

  async create(input: UserInput): Promise<User> {
    if (useMockApi) {
      await delay()
      assertUniqueEmail(input.email)
      const user: User = {
        ...input,
        email: input.email.toLowerCase(),
        id: `u_${Date.now()}`,
        avatar: null,
        createdAt: new Date().toISOString(),
        lastActiveAt: null,
      }
      mockUsers.unshift(user)
      return user
    }
    return http.post<User>('/users', input)
  },

  async update(id: string, input: Partial<UserInput>): Promise<User> {
    if (useMockApi) {
      await delay()
      const user = mockUsers.find((u) => u.id === id)
      if (!user) throw new ApiError(404, 'User not found')
      if (input.email) assertUniqueEmail(input.email, id)
      Object.assign(user, input)
      return { ...user }
    }
    return http.patch<User>(`/users/${id}`, input)
  },

  async remove(ids: string[]): Promise<void> {
    if (useMockApi) {
      await delay()
      for (const id of ids) {
        const index = mockUsers.findIndex((u) => u.id === id)
        if (index >= 0) mockUsers.splice(index, 1)
      }
      return
    }
    await Promise.all(ids.map((id) => http.delete(`/users/${id}`)))
  },
}
