export type Role = 'admin' | 'editor' | 'viewer'
export type UserStatus = 'active' | 'invited' | 'suspended'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
  avatar: string | null
  createdAt: string
  lastActiveAt: string | null
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatar: string | null
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export type SortDirection = 'asc' | 'desc'
