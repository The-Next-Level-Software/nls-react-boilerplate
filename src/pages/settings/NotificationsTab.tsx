import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { toast } from '@/store/toast.store'
import { SettingsSection } from './SettingsSection'

const options = [
  { key: 'security', label: 'Security alerts', description: 'Sign-ins from new devices and password changes.' },
  { key: 'signups', label: 'New sign-ups', description: 'When a new user joins your workspace.' },
  { key: 'digest', label: 'Weekly digest', description: 'A summary of activity every Monday.' },
  { key: 'product', label: 'Product updates', description: 'New features and improvements.' },
] as const

type Key = (typeof options)[number]['key']

export function NotificationsTab() {
  const [email, setEmail] = useState<Record<Key, boolean>>({ security: true, signups: true, digest: false, product: false })
  const [push, setPush] = useState<Record<Key, boolean>>({ security: true, signups: false, digest: false, product: false })

  return (
    <SettingsSection
      title="Notifications"
      description="Choose how you'd like to be notified."
      footer={<Button onClick={() => toast.success('Notification preferences saved')}>Save preferences</Button>}
    >
      <div className="-mx-5 -mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-5 py-2.5 font-medium">Event</th>
              <th className="w-20 py-2.5 text-center font-medium">Email</th>
              <th className="w-20 py-2.5 pr-5 text-center font-medium">Push</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {options.map((o) => (
              <tr key={o.key}>
                <td className="px-5 py-3.5">
                  <p className="font-medium">{o.label}</p>
                  <p className="text-muted-foreground">{o.description}</p>
                </td>
                <td className="py-3.5 text-center">
                  <Switch
                    aria-label={`${o.label} by email`}
                    checked={email[o.key]}
                    onChange={(v) => setEmail((s) => ({ ...s, [o.key]: v }))}
                  />
                </td>
                <td className="py-3.5 pr-5 text-center">
                  <Switch aria-label={`${o.label} push`} checked={push[o.key]} onChange={(v) => setPush((s) => ({ ...s, [o.key]: v }))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsSection>
  )
}
