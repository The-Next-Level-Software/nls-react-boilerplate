import { useMockApi } from '@/config/app.config'
import { mockActivity, mockChannels, mockRevenue } from '@/mocks/dashboard'
import { mockUsers } from '@/mocks/users'
import type { User } from '@/types'
import { delay, http } from './http'

export interface Stat {
  key: string
  label: string
  value: number
  format: 'currency' | 'number' | 'percent'
  /** Percent change vs the previous period. */
  change: number
  /** Whether an increase is good (green) or bad (red, e.g. churn). */
  upIsGood: boolean
}

export interface DashboardOverview {
  stats: Stat[]
  revenue: { month: string; year: number; revenue: number }[]
  channels: { name: string; value: number }[]
  recentUsers: User[]
  activity: { id: number; actor: string; action: string; target: string; at: string }[]
}

export const dashboardService = {
  async overview(): Promise<DashboardOverview> {
    if (!useMockApi) return http.get<DashboardOverview>('/dashboard/overview')

    await delay(500)
    const revenue = mockRevenue()
    const [prev, last] = revenue.slice(-2)
    return {
      stats: [
        {
          key: 'revenue',
          label: 'Revenue this month',
          value: last.revenue,
          format: 'currency',
          change: ((last.revenue - prev.revenue) / prev.revenue) * 100,
          upIsGood: true,
        },
        { key: 'users', label: 'Total users', value: mockUsers.length, format: 'number', change: 8.2, upIsGood: true },
        {
          key: 'active',
          label: 'Active users',
          value: mockUsers.filter((u) => u.status === 'active').length,
          format: 'number',
          change: 3.1,
          upIsGood: true,
        },
        { key: 'churn', label: 'Churn rate', value: 2.4, format: 'percent', change: -0.6, upIsGood: false },
      ],
      revenue,
      channels: mockChannels,
      recentUsers: [...mockUsers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
      activity: mockActivity(),
    }
  },
}
