import { formatMonth } from '@/lib/format'
import { createRandom } from './random'
import { mockUsers } from './users'

const random = createRandom(7)

export function mockRevenue() {
  const now = new Date()
  let value = 21000
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    value = Math.round(value * (1 + (random.next() * 0.16 - 0.04)))
    return { month: formatMonth(date), year: date.getFullYear(), revenue: value }
  })
}

export const mockChannels = [
  { name: 'Organic search', value: 1284 },
  { name: 'Referral', value: 862 },
  { name: 'Social', value: 574 },
  { name: 'Email', value: 391 },
  { name: 'Paid ads', value: 218 },
]

export function mockActivity() {
  const HOUR = 3_600_000
  const now = Date.now()
  const actions = [
    { action: 'invited', target: 'a new editor' },
    { action: 'updated', target: 'billing settings' },
    { action: 'suspended', target: 'an account' },
    { action: 'exported', target: 'the users report' },
    { action: 'changed', target: 'a user role to admin' },
  ]
  return actions.map((a, i) => ({
    id: i,
    actor: mockUsers[i * 7].name,
    ...a,
    at: new Date(now - (i * 3 + 0.5) * HOUR).toISOString(),
  }))
}
