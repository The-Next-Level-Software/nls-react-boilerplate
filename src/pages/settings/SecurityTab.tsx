import { useState, type FormEvent } from 'react'
import { Laptop, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { authService } from '@/services/auth.service'
import { toast } from '@/store/toast.store'
import { SettingsSection } from './SettingsSection'

type Errors = Partial<Record<'current' | 'next' | 'confirm', string>>

// Placeholder data — replace with your sessions endpoint.
const sessions = [
  { id: 1, device: 'Chrome on macOS', location: 'Berlin, DE', current: true, icon: Laptop, lastSeen: 'Active now' },
  { id: 2, device: 'Safari on iPhone', location: 'Berlin, DE', current: false, icon: Smartphone, lastSeen: '2 days ago' },
]

export function SecurityTab() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const found: Errors = {}
    if (!current) found.current = 'Enter your current password'
    if (next.length < 8) found.next = 'Use at least 8 characters'
    if (next !== confirm) found.confirm = 'Passwords do not match'
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    try {
      await authService.changePassword({ currentPassword: current, newPassword: next })
      setCurrent('')
      setNext('')
      setConfirm('')
      toast.success('Password updated')
    } catch (err) {
      setErrors({ current: (err as Error).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SettingsSection
        title="Change password"
        description="Use a long, unique password you don't use elsewhere."
        onSubmit={onSubmit}
        footer={
          <Button type="submit" loading={saving}>
            Update password
          </Button>
        }
      >
        <Field label="Current password" htmlFor="pw-current" error={errors.current}>
          <Input
            id="pw-current"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            aria-invalid={Boolean(errors.current)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New password" htmlFor="pw-new" error={errors.next}>
            <Input
              id="pw-new"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              aria-invalid={Boolean(errors.next)}
            />
          </Field>
          <Field label="Confirm new password" htmlFor="pw-confirm" error={errors.confirm}>
            <Input
              id="pw-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={Boolean(errors.confirm)}
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection title="Two-factor authentication" description="Add an extra layer of security to your account.">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium" id="tfa-label">
              Authenticator app
            </p>
            <p className="text-sm text-muted-foreground">Require a one-time code when signing in.</p>
          </div>
          <Switch
            checked={twoFactor}
            aria-label="Authenticator app"
            onChange={(v) => {
              setTwoFactor(v)
              toast.info(v ? 'Two-factor enabled' : 'Two-factor disabled')
            }}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Active sessions" description="Devices currently signed in to your account.">
        <ul className="-my-1 divide-y divide-border">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                <s.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {s.device}{' '}
                  {s.current && (
                    <Badge variant="success" className="ml-1">
                      This device
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {s.location} · {s.lastSeen}
                </p>
              </div>
              {!s.current && (
                <Button variant="outline" size="sm" onClick={() => toast.success('Session revoked')}>
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SettingsSection>
    </>
  )
}
