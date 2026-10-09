import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/store/theme.store'
import { useResolvedMode } from '@/theme/use-theme'

export function ThemeToggle() {
  const setMode = useThemeStore((s) => s.setMode)
  const resolved = useResolvedMode()
  const next = resolved === 'dark' ? 'light' : 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMode(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {resolved === 'dark' ? <Sun /> : <Moon />}
    </Button>
  )
}
