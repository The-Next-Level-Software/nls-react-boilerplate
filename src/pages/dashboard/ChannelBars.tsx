import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { formatNumber } from '@/lib/format'

interface ChannelBarsProps {
  data: { name: string; value: number }[]
}

/** Single-series horizontal bars, every value labeled — no chart library needed. */
export function ChannelBars({ data }: ChannelBarsProps) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <CardHeader title="Signups by channel" description="Last 30 days" />
      <CardContent>
        <ul className="space-y-4">
          {data.map((d) => (
            <li key={d.name}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                <span>{d.name}</span>
                <span className="text-muted-foreground tabular-nums">
                  <span className="font-medium text-foreground">{formatNumber(d.value)}</span> · {Math.round((d.value / total) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-r-[4px] bg-muted">
                <div className="h-full rounded-r-[4px] bg-chart" style={{ width: `${(d.value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
