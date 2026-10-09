import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/cn'
import { useConfig } from '@/store/config.store'
import { useUiStore } from '@/store/ui.store'
import { Notifications } from './Notifications'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

export function Topbar() {
  const { features, layout } = useConfig()
  const setMobileOpen = useUiStore((s) => s.setMobileNavOpen)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  // Placeholder global search: jumps to the users list. Point it at your own search.
  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/users?search=${encodeURIComponent(query.trim())}`)
    setQuery('')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-16 items-center gap-3 px-4 sm:px-6',
        layout.headerStyle === 'blur' && 'border-b border-border bg-surface/85 backdrop-blur-md',
        layout.headerStyle === 'solid' && 'border-b border-border bg-surface',
        layout.headerStyle === 'plain' && 'bg-background',
      )}
    >
      <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
        <Menu />
      </Button>

      {features.search && (
        <form onSubmit={onSearch} className="hidden max-w-sm flex-1 sm:block" role="search">
          <Input
            type="search"
            icon={<Search />}
            placeholder="Search users…"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-transparent bg-muted shadow-none focus:bg-surface"
          />
        </form>
      )}

      <div className="ml-auto flex items-center gap-1">
        {features.modeToggle && <ThemeToggle />}
        {features.notifications && <Notifications />}
        {(features.modeToggle || features.notifications) && <div className="mx-1.5 h-6 w-px bg-border" />}
        <UserMenu />
      </div>
    </header>
  )
}
