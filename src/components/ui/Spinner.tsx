import { cn } from '@/lib/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block size-5 animate-spin rounded-full border-2 border-border border-t-primary', className)}
    />
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

export function PageLoader() {
  return (
    <div className="flex min-h-64 flex-1 items-center justify-center">
      <Spinner />
    </div>
  )
}
