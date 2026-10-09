import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Download } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Spinner'
import { formatRelative } from '@/lib/format'
import { dashboardService } from '@/services/dashboard.service'
import { useAuthStore } from '@/store/auth.store'
import { statusBadge } from '@/pages/users/user-meta'
import { ChannelBars } from './ChannelBars'
import { RevenueChart } from './RevenueChart'
import { StatCard } from './StatCard'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data, isPending, isError, refetch } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardService.overview })

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back${user ? `, ${user.name.split(' ')[0]}` : ''}. Here's what's happening.`}
        actions={
          <Button variant="outline">
            <Download />
            Export
          </Button>
        }
      />

      {isError ? (
        <Card className="p-8 text-center text-sm">
          <p className="font-medium">Couldn't load the dashboard.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Try again
          </Button>
        </Card>
      ) : isPending ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.stats.map((stat) => (
              <StatCard key={stat.key} stat={stat} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RevenueChart data={data.revenue} />
            </div>
            <ChannelBars data={data.channels} />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader
                title="Newest users"
                description="Latest sign-ups across all channels"
                actions={
                  <Link to="/users" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    View all <ArrowRight className="size-4" />
                  </Link>
                }
              />
              <CardContent className="px-0 pb-2">
                <ul className="divide-y divide-border">
                  {data.recentUsers.map((u) => (
                    <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                      <Avatar name={u.name} src={u.avatar} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{u.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge variant={statusBadge[u.status].variant} dot className="hidden sm:inline-flex">
                        {statusBadge[u.status].label}
                      </Badge>
                      <span className="hidden w-24 text-right text-xs text-muted-foreground md:block">{formatRelative(u.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Recent activity" />
              <CardContent>
                <ol className="relative space-y-5 border-l border-border pl-5">
                  {data.activity.map((a) => (
                    <li key={a.id} className="relative">
                      <span className="absolute top-1.5 -left-[1.53rem] size-2 rounded-full bg-primary ring-4 ring-surface" />
                      <p className="text-sm">
                        <span className="font-medium">{a.actor}</span> <span className="text-muted-foreground">{a.action}</span> {a.target}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(a.at)}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[7.5rem] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-96 rounded-xl xl:col-span-2" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  )
}
