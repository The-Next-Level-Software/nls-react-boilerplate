import { useState } from 'react'
import { BarChart3, Table2 } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { formatCompactCurrency, formatCurrency } from '@/lib/format'
import type { DashboardOverview } from '@/services/dashboard.service'

type Range = 3 | 6 | 12
type Point = DashboardOverview['revenue'][number]

const ranges: { value: Range; label: string }[] = [
  { value: 3, label: '3M' },
  { value: 6, label: '6M' },
  { value: 12, label: '12M' },
]

function ChartTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload as Point
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">
        {point.month} {point.year}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">{formatCurrency(point.revenue)}</p>
    </div>
  )
}

export function RevenueChart({ data }: { data: Point[] }) {
  const [range, setRange] = useState<Range>(12)
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const points = data.slice(-range)
  const total = points.reduce((sum, p) => sum + p.revenue, 0)

  return (
    <Card>
      <CardHeader
        title="Revenue"
        description={`${formatCurrency(total)} over the last ${range} months`}
        actions={
          <>
            <SegmentedControl size="sm" aria-label="Time range" value={range} onChange={setRange} options={ranges} />
            <SegmentedControl
              size="sm"
              aria-label="View"
              value={view}
              onChange={setView}
              options={[
                { value: 'chart', label: <BarChart3 />, title: 'Chart view' },
                { value: 'table', label: <Table2 />, title: 'Table view' },
              ]}
            />
          </>
        }
      />
      <CardContent className="pt-4">
        {view === 'chart' ? (
          <div className="h-72 text-xs" role="img" aria-label={`Monthly revenue, last ${range} months`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeWidth={1} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: 'var(--muted-foreground)' }} />
                <YAxis
                  width={76}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  tickFormatter={(v: number) => formatCompactCurrency(v)}
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <Tooltip content={ChartTooltip} cursor={{ stroke: 'var(--input)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--chart)"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="var(--chart)"
                  fillOpacity={0.1}
                  activeDot={{ r: 5, fill: 'var(--chart)', stroke: 'var(--surface)', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 scrollbar-thin overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface text-left text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium">Month</th>
                  <th className="py-2 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...points].reverse().map((p) => (
                  <tr key={`${p.year}-${p.month}`}>
                    <td className="py-2">
                      {p.month} {p.year}
                    </td>
                    <td className="py-2 text-right tabular-nums">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
