import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'
import { formatCurrency, formatNumber } from '@/lib/format'
import type { Stat } from '@/services/dashboard.service'

function formatValue(stat: Stat) {
  if (stat.format === 'currency') return formatCurrency(stat.value)
  if (stat.format === 'percent') return `${stat.value.toFixed(1)}%`
  return formatNumber(stat.value)
}

export function StatCard({ stat }: { stat: Stat }) {
  const up = stat.change >= 0
  const good = up === stat.upIsGood
  const Arrow = up ? ArrowUpRight : ArrowDownRight

  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{stat.label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{formatValue(stat)}</p>
      <p className="mt-2 flex items-center gap-1 text-xs">
        <span className={cn('inline-flex items-center gap-0.5 font-medium', good ? 'text-success' : 'text-danger')}>
          <Arrow className="size-3.5" aria-hidden />
          <span className="sr-only">{up ? 'Up' : 'Down'}</span>
          {Math.abs(stat.change).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </p>
    </Card>
  )
}
