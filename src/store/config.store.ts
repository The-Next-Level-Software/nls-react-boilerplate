import { create } from 'zustand'
import { appConfig } from '@/config/app.config'
import { storageKey } from '@/lib/storage'
import type { AppConfig } from '@/theme/types'

const { customizer } = appConfig.features
/** Whether the Customization page is available in this build. */
export const customizerEnabled = customizer === 'always' || (customizer === 'dev' && import.meta.env.DEV)
/** Saving straight to app.config.ts needs the dev server's config-writer plugin. */
export const canSaveToFile = import.meta.env.DEV

type Patch<K extends keyof AppConfig> = AppConfig[K] extends object ? Partial<AppConfig[K]> : AppConfig[K]

interface ConfigState {
  /** Live config the UI renders with. Equals `saved` unless the Customization page has unsaved edits. */
  config: AppConfig
  /** What's currently in src/config/app.config.ts. */
  saved: AppConfig
  update: <K extends keyof AppConfig>(section: K, patch: Patch<K>) => void
  replace: (config: AppConfig) => void
  discard: () => void
}

// Unsaved edits survive reloads (sessionStorage) until app.config.ts itself changes.
const DRAFT_KEY = storageKey('config-draft')
const baseline = JSON.stringify(appConfig)

function loadDraft(): AppConfig {
  if (!customizerEnabled) return appConfig
  try {
    const stored = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? 'null')
    if (stored?.baseline === baseline) return mergeConfig(appConfig, stored.draft)
  } catch {
    // ignore unreadable drafts
  }
  return appConfig
}

/** Deep-merges known sections so configs from older versions keep new defaults. */
export function mergeConfig(base: AppConfig, incoming: Partial<AppConfig> | undefined): AppConfig {
  const merged = structuredClone(base)
  if (!incoming || typeof incoming !== 'object') return merged
  for (const key of Object.keys(base) as (keyof AppConfig)[]) {
    const value = incoming[key]
    if (value === undefined) continue
    if (typeof base[key] === 'object' && base[key] !== null) Object.assign(merged[key] as object, value)
    else (merged as unknown as Record<string, unknown>)[key] = value
  }
  merged.apiUrl = base.apiUrl
  return merged
}

export const useConfigStore = create<ConfigState>()((set) => ({
  config: loadDraft(),
  saved: appConfig,
  update: (section, patch) =>
    set((state) => {
      const current = state.config[section]
      const next = typeof current === 'object' && current !== null ? { ...current, ...(patch as object) } : patch
      return { config: { ...state.config, [section]: next } }
    }),
  replace: (config) => set((state) => ({ config: mergeConfig(state.saved, config) })),
  discard: () => set((state) => ({ config: state.saved })),
}))

if (customizerEnabled) {
  useConfigStore.subscribe(({ config, saved }) => {
    try {
      if (config === saved) sessionStorage.removeItem(DRAFT_KEY)
      else sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ baseline, draft: config }))
    } catch {
      // storage full or blocked: drafts just won't survive a reload
    }
  })
}

/** The live app config (reactive). */
export const useConfig = () => useConfigStore((s) => s.config)
/** The live app config, for non-React code. */
export const getConfig = () => useConfigStore.getState().config
