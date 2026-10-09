import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@/store/auth.store'

/** Renders child routes only for signed-in users; otherwise redirects to /login. */
export function RequireAuth() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}

/** Keeps signed-in users away from the login / forgot-password pages. */
export function GuestOnly() {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/" replace />
  return <Outlet />
}
