import { useEffect } from 'react'
import { useConfig } from '@/store/config.store'
import { applyTheme } from '@/theme/apply-theme'
import { useResolvedMode } from '@/theme/use-theme'

/** Keeps the CSS variables on <html> in sync with the config and color mode. Renders nothing. */
export function ThemeSync() {
  const config = useConfig()
  const mode = useResolvedMode()

  useEffect(() => {
    applyTheme(config, mode)
  }, [config, mode])

  return null
}
