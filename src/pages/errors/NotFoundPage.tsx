import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { Button } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/use-page-title'

function ErrorScreen({ code, title, message }: { code: string; title: string; message: string }) {
  usePageTitle(title)
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-primary">{code}</p>
      <h1 className="mt-2 text-3xl">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
      <div className="mt-6 flex gap-2">
        <Button variant="outline" onClick={() => history.back()}>
          Go back
        </Button>
        <Link to="/">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  return <ErrorScreen code="404" title="Page not found" message="The page you're looking for doesn't exist or has been moved." />
}

/** Router-level error boundary. */
export function RouteErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />
  if (import.meta.env.DEV) console.error(error)
  return (
    <ErrorScreen code="Error" title="Something went wrong" message="An unexpected error occurred. Please try again or contact support." />
  )
}
