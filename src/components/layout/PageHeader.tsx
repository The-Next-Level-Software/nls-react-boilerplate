import type { ReactNode } from 'react'
import { usePageTitle } from '@/hooks/use-page-title'

interface PageHeaderProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
}

/** Page heading + optional actions. Also sets the document title. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  usePageTitle(title)
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
