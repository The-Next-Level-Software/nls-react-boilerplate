import type { Role, User, UserStatus } from '@/types'
import { createRandom } from './random'

const firstNames = [
  'Olivia',
  'Liam',
  'Emma',
  'Noah',
  'Ava',
  'Elijah',
  'Sophia',
  'Lucas',
  'Mia',
  'Mateo',
  'Amelia',
  'Ethan',
  'Harper',
  'James',
  'Aisha',
  'Omar',
  'Yuki',
  'Chen',
  'Priya',
  'Arjun',
  'Fatima',
  'Diego',
  'Sara',
  'Ivan',
]
const lastNames = [
  'Smith',
  'Johnson',
  'Garcia',
  'Brown',
  'Khan',
  'Nguyen',
  'Martinez',
  'Lee',
  'Patel',
  'Kim',
  'Rossi',
  'Müller',
  'Silva',
  'Haddad',
  'Ali',
  'Tanaka',
  'Wilson',
  'Clark',
  'Lopez',
  'Wright',
]
const roles: Role[] = ['admin', 'editor', 'editor', 'viewer', 'viewer', 'viewer']
const statuses: UserStatus[] = ['active', 'active', 'active', 'active', 'invited', 'suspended']

const DAY = 86_400_000

function generateUsers(count: number): User[] {
  const random = createRandom(42)
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => {
    const first = random.pick(firstNames)
    const last = random.pick(lastNames)
    const status = random.pick(statuses)
    const createdAt = now - random.int(1, 540) * DAY
    return {
      id: `u_${(i + 1).toString().padStart(4, '0')}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${i}@example.com`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
      role: random.pick(roles),
      status,
      avatar: null,
      createdAt: new Date(createdAt).toISOString(),
      lastActiveAt:
        status === 'invited'
          ? null
          : new Date(Math.max(createdAt, now - random.int(0, 60) * DAY - random.int(0, 23) * 3_600_000)).toISOString(),
    }
  })
}

/** In-memory "database" mutated by the mock users service. Resets on reload. */
export const mockUsers: User[] = generateUsers(128)
