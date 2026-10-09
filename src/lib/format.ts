import { getConfig } from '@/store/config.store'
import type { AppConfig } from '@/theme/types'

// Formatters follow `locale.language` / `locale.currency` from the app config.
// Components that must react to live locale changes (e.g. the Customization preview)
// pass `useConfig().locale` explicitly; elsewhere the current config is used.
type Locale = AppConfig['locale']

const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>()
const current = (): Locale => getConfig().locale

function numberFormat(loc: Locale, key: string, options: Intl.NumberFormatOptions) {
  const id = `n:${loc.language}:${loc.currency}:${key}`
  if (!cache.has(id)) cache.set(id, new Intl.NumberFormat(loc.language || undefined, options))
  return cache.get(id) as Intl.NumberFormat
}

function dateFormat(loc: Locale, key: string, options: Intl.DateTimeFormatOptions) {
  const id = `d:${loc.language}:${key}`
  if (!cache.has(id)) cache.set(id, new Intl.DateTimeFormat(loc.language || undefined, options))
  return cache.get(id) as Intl.DateTimeFormat
}

const currencyOf = (loc: Locale) => loc.currency || 'USD'

export const formatDate = (value: string | Date, loc = current()) =>
  dateFormat(loc, 'date', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))
export const formatMonth = (value: Date, loc = current()) => dateFormat(loc, 'month', { month: 'short' }).format(value)
export const formatNumber = (value: number, loc = current()) => numberFormat(loc, 'number', {}).format(value)
export const formatCompact = (value: number, loc = current()) =>
  numberFormat(loc, 'compact', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
export const formatCurrency = (value: number, loc = current()) =>
  numberFormat(loc, 'currency', { style: 'currency', currency: currencyOf(loc), maximumFractionDigits: 0 }).format(value)
export const formatCompactCurrency = (value: number, loc = current()) =>
  numberFormat(loc, 'compact-currency', { style: 'currency', currency: currencyOf(loc), notation: 'compact' }).format(value)
export const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`

export function formatRelative(value: string | number | Date, loc = current()) {
  const diff = (new Date(value).getTime() - Date.now()) / 1000
  const rtf = new Intl.RelativeTimeFormat(loc.language || undefined, { numeric: 'auto' })
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit)
  }
  return rtf.format(0, 'second')
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

/** Replaces `{year}` in the configured copyright text. */
export const copyrightText = (text: string) => text.replace('{year}', String(new Date().getFullYear()))
