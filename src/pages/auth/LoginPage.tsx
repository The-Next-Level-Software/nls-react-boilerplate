import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { appConfig, useMockApi } from '@/config/app.config'
import { useConfig } from '@/store/config.store'
import { toast } from '@/store/toast.store'
import { usePageTitle } from '@/hooks/use-page-title'
import { authService } from '@/services/auth.service'
import { AuthLayout } from './AuthLayout'

type Errors = Partial<Record<'email' | 'password' | 'form', string>>

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!email) errors.email = 'Email is required'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  return errors
}

/** `preview` renders the page for the Customization screen without signing in. */
export function LoginPage({ preview = false }: { preview?: boolean }) {
  usePageTitle(preview ? 'Login preview' : 'Sign in')
  const { login, features } = useConfig()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validate(email.trim(), password)
    setErrors(found)
    if (Object.keys(found).length) return
    if (preview) {
      toast.info('Preview mode', 'Signing in is disabled in the preview.')
      return
    }

    setSubmitting(true)
    try {
      await authService.login({ email: email.trim(), password, remember })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Something went wrong' })
      setSubmitting(false)
    }
  }

  const fillDemo = () => {
    setEmail(appConfig.demoCredentials.email)
    setPassword(appConfig.demoCredentials.password)
    setErrors({})
  }

  return (
    <AuthLayout>
      {preview && (
        <p className="mb-6 rounded-lg bg-primary-soft px-3 py-2 text-xs font-medium text-primary">
          Preview: reflects your current customization.
        </p>
      )}
      <div className="mb-7">
        <h1 className="text-2xl">{login.title}</h1>
        {login.subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{login.subtitle}</p>}
      </div>

      {errors.form && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/8 px-3 py-2.5 text-sm text-danger"
        >
          <AlertCircle className="size-4 shrink-0" />
          {errors.form}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            icon={<Mail />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            autoFocus
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          error={errors.password}
          action={
            login.showForgotPassword && (
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            )
          }
        >
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            icon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />
        </Field>

        {login.showRememberMe && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
            <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me signed in
          </label>
        )}

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>

      {useMockApi && features.showDemoCredentials && (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/50 px-4 py-3 text-sm">
          <p className="font-medium">Demo account</p>
          <p className="mt-0.5 text-muted-foreground">
            {appConfig.demoCredentials.email} / {appConfig.demoCredentials.password}
          </p>
          <button type="button" onClick={fillDemo} className="mt-1.5 text-xs font-medium text-primary hover:underline">
            Fill in demo credentials
          </button>
        </div>
      )}
    </AuthLayout>
  )
}
