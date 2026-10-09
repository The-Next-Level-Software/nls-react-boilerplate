import { storageKey } from '@/lib/storage'
import type { AppConfig } from '@/theme/types'

// Must match CONFIG_ENDPOINT in vite/config-writer.ts.
const ENDPOINT = '/__app-config'
export const JUST_SAVED_KEY = storageKey('config-saved')

export const configService = {
  /**
   * Dev only: asks the Vite dev server to rewrite src/config/app.config.ts.
   * The page reloads automatically once the file is written.
   */
  async saveToFile(config: AppConfig) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message ?? `Save failed (${res.status})`)
    sessionStorage.setItem(JUST_SAVED_KEY, '1')
  },
}
