import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, MailCheck, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { usePageTitle } from '@/hooks/use-page-title'
import { authService } from '@/services/auth.service'
import { AuthLayout } from './AuthLayout'

export function ForgotPasswordPage() {
  usePageTitle('Reset password')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await authService.requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MailCheck className="size-6" />
          </div>
          <h1 className="text-xl">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll receive a reset link shortly.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-7">
            <h1 className="text-2xl">Forgot password?</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
          </div>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <Field label="Email" htmlFor="email" error={error}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                icon={<Mail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                autoFocus
              />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Send reset link
            </Button>
          </form>
        </>
      )}
      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </AuthLayout>
  )
}
