import { useSearchParams } from 'react-router'
import { Bell, Shield, SlidersHorizontal, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { NotificationsTab } from './NotificationsTab'
import { PreferencesTab } from './PreferencesTab'
import { ProfileTab } from './ProfileTab'
import { SecurityTab } from './SecurityTab'

const tabs = [
  { value: 'profile', label: 'Profile', icon: <UserRound /> },
  { value: 'security', label: 'Security', icon: <Shield /> },
  { value: 'notifications', label: 'Notifications', icon: <Bell /> },
  { value: 'preferences', label: 'Preferences', icon: <SlidersHorizontal /> },
] as const

type Tab = (typeof tabs)[number]['value']

export function SettingsPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab: Tab = tabs.some((t) => t.value === requested) ? (requested as Tab) : 'profile'

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and preferences." />
      <Tabs value={tab} onChange={(value) => setParams({ tab: value }, { replace: true })} tabs={[...tabs]} className="mb-6" />
      <div className="max-w-3xl">
        {tab === 'profile' && <ProfileTab />}
        {tab === 'security' && <SecurityTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'preferences' && <PreferencesTab />}
      </div>
    </>
  )
}
