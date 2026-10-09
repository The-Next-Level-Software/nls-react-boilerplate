import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import { Button } from './Button'
import { Select } from './Select'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

function pageWindow(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const pages = new Set([1, pageCount, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (['gap', p] as const) : [p]))
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50] }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)

  return (
    <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="tabular-nums">
          {formatNumber(from)}–{formatNumber(to)} of {formatNumber(total)}
        </span>
        {onPageSizeChange && (
          <Select
            aria-label="Rows per page"
            value={String(pageSize)}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            options={pageSizeOptions.map((n) => ({ value: String(n), label: `${n} / page` }))}
            className="w-28 [&_select]:h-8"
          />
        )}
      </div>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button variant="ghost" size="icon-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft />
        </Button>
        {pageWindow(page, pageCount).map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'h-8 min-w-8 rounded-lg px-2 text-sm tabular-nums transition-colors',
                p === page ? 'bg-primary-soft font-medium text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {p}
            </button>
          ),
        )}
        <Button variant="ghost" size="icon-sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight />
        </Button>
      </nav>
    </div>
  )
}
