import { createBrowserRouter, type RouteObject } from 'react-router'
import { GuestOnly, RequireAuth } from '@/components/auth/RouteGuards'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageLoader } from '@/components/ui/Spinner'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { NotFoundPage, RouteErrorPage } from '@/pages/errors/NotFoundPage'
import { customizerEnabled } from '@/store/config.store'

// Authenticated pages are code-split with route-level `lazy`; each loads on first visit.

/** Only registered when `features.customizer` allows it in this build. */
const customizerRoutes: RouteObject[] = customizerEnabled
  ? [
      {
        path: 'customization',
        lazy: () => import('@/pages/customization/CustomizationPage').then((m) => ({ Component: m.CustomizationPage })),
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          ...(customizerEnabled ? [{ path: '/login-preview', element: <LoginPage preview /> }] : []),
          {
            element: <AppLayout />,
            children: [
              { index: true, lazy: () => import('@/pages/dashboard/DashboardPage').then((m) => ({ Component: m.DashboardPage })) },
              { path: 'users', lazy: () => import('@/pages/users/UsersPage').then((m) => ({ Component: m.UsersPage })) },
              { path: 'settings', lazy: () => import('@/pages/settings/SettingsPage').then((m) => ({ Component: m.SettingsPage })) },
              ...customizerRoutes,
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
])
