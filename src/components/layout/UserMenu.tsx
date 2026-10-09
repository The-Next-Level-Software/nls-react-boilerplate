import { useNavigate } from 'react-router'
import { ChevronDown, LogOut, Palette, Settings, UserRound } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { DropdownItem, DropdownLabel, DropdownMenu, DropdownSeparator } from '@/components/ui/DropdownMenu'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { customizerEnabled } from '@/store/config.store'

export function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  if (!user) return null

  const signOut = async () => {
    await authService.logout()
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu
      label="Account menu"
      triggerClassName="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-muted"
      trigger={
        <>
          <Avatar name={user.name} src={user.avatar} size="sm" />
          <span className="hidden text-sm font-medium md:block">{user.name}</span>
          <ChevronDown className="hidden size-4 text-muted-foreground md:block" />
        </>
      }
      className="w-56"
    >
      <DropdownLabel>
        <span className="block truncate font-medium text-foreground">{user.name}</span>
        <span className="block truncate">{user.email}</span>
      </DropdownLabel>
      <DropdownSeparator />
      <DropdownItem icon={<UserRound />} onSelect={() => navigate('/settings')}>
        Profile
      </DropdownItem>
      <DropdownItem icon={<Settings />} onSelect={() => navigate('/settings?tab=preferences')}>
        Settings
      </DropdownItem>
      {customizerEnabled && (
        <DropdownItem icon={<Palette />} onSelect={() => navigate('/customization')}>
          Customization
        </DropdownItem>
      )}
      <DropdownSeparator />
      <DropdownItem icon={<LogOut />} onSelect={signOut} destructive>
        Sign out
      </DropdownItem>
    </DropdownMenu>
  )
}
