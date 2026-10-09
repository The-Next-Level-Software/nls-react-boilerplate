import type { FormEventHandler, ReactNode } from 'react'
import { Card, CardFooter, CardHeader } from '@/components/ui/Card'

interface SettingsSectionProps {
  title: string
  description?: string
  footer?: ReactNode
  onSubmit?: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

/** A settings card. Wraps content in a <form> when `onSubmit` is given. */
export function SettingsSection({ title, description, footer, onSubmit, children }: SettingsSectionProps) {
  const body = (
    <>
      <CardHeader title={title} description={description} />
      <div className="space-y-4 p-5">{children}</div>
      {footer && <CardFooter>{footer}</CardFooter>}
    </>
  )
  return (
    <Card className="mb-6">
      {onSubmit ? (
        <form onSubmit={onSubmit} noValidate>
          {body}
        </form>
      ) : (
        body
      )}
    </Card>
  )
}
