import { appConfig } from '@/config/app.config'

/** Namespaced localStorage key, e.g. `admin-theme`. */
export const storageKey = (name: string) => `${appConfig.storagePrefix}-${name}`
