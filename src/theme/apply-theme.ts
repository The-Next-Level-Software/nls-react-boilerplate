import { isDark, isHexColor, luminance, mix, readableForeground } from './color'
import { fontStack, loadFont } from './fonts'
import { darkSidebarColor, neutralTokens } from './palettes'
import type { AppConfig, CardStyle, RadiusScale, ResolvedMode, SidebarWidth } from './types'

const radius: Record<RadiusScale, string> = { none: '0px', sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem' }
const sidebarWidth: Record<SidebarWidth, string> = { narrow: '15rem', default: '16rem', wide: '18rem' }

/** Lightens dark colors in dark mode so they stay legible on dark surfaces. */
function forMode(color: string, mode: ResolvedMode, fallback: string) {
  const hex = isHexColor(color) ? color : fallback
  if (mode === 'light') return hex
  if (luminance(hex) < 0.02) return mix(hex, '#ffffff', 0.92)
  let amount = 0
  let result = hex
  while (luminance(result) < 0.17 && amount < 0.6) {
    amount += 0.05
    result = mix(hex, '#ffffff', amount)
  }
  return result
}

/** Primary color as rendered in the given mode (near-black brands become near-white in dark mode). */
export const resolvePrimary = (config: AppConfig, mode: ResolvedMode) => forMode(config.colors.primary, mode, '#18181b')

/** Solid sidebar background, or `null` when the sidebar follows the surface color. */
export function resolveSidebarColor(config: AppConfig, mode: ResolvedMode): string | null {
  switch (config.layout.sidebarStyle) {
    case 'dark':
      return darkSidebarColor(config.colors.neutral)
    case 'brand':
      return resolvePrimary(config, mode)
    case 'custom':
      return isHexColor(config.colors.sidebar) ? config.colors.sidebar : null
    default:
      return null
  }
}

/** Whether the sidebar background is dark, used to pick the right logo variant. */
export function isSidebarDark(config: AppConfig, mode: ResolvedMode) {
  const color = resolveSidebarColor(config, mode)
  return color ? isDark(color) : mode === 'dark'
}

function sidebarVars(config: AppConfig, mode: ResolvedMode): Record<string, string> {
  const color = resolveSidebarColor(config, mode)
  if (!color) {
    return {
      '--sidebar': 'var(--surface)',
      '--sidebar-foreground': 'var(--foreground)',
      '--sidebar-muted': 'var(--muted-foreground)',
      '--sidebar-hover': 'var(--muted)',
      '--sidebar-active': 'var(--primary-soft)',
      '--sidebar-active-foreground': 'var(--primary)',
      '--sidebar-border': 'var(--border)',
      '--sidebar-accent': 'var(--primary)',
      '--sidebar-accent-foreground': 'var(--primary-foreground)',
    }
  }
  const fg = readableForeground(color)
  return {
    '--sidebar': color,
    '--sidebar-foreground': fg,
    '--sidebar-muted': `color-mix(in oklab, ${fg} 62%, ${color})`,
    '--sidebar-hover': `color-mix(in oklab, ${fg} 8%, transparent)`,
    '--sidebar-active': `color-mix(in oklab, ${fg} 14%, transparent)`,
    '--sidebar-active-foreground': fg,
    '--sidebar-border': `color-mix(in oklab, ${fg} 10%, transparent)`,
    '--sidebar-accent': fg,
    '--sidebar-accent-foreground': color,
  }
}

function cardVars(style: CardStyle, mode: ResolvedMode) {
  const shadow =
    mode === 'light'
      ? '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)'
      : '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)'
  return {
    '--card-border': style === 'border' || style === 'both' ? 'var(--border)' : 'transparent',
    '--card-shadow': style === 'shadow' || style === 'both' ? shadow : '0 0 #0000',
  }
}

export function faviconDataUrl(config: AppConfig) {
  const primary = resolvePrimary(config, 'light')
  const initial = (config.brand.name.trim()[0] ?? 'A').toUpperCase().replace(/[<>&"']/g, '')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<rect width="32" height="32" rx="8" fill="${primary}"/>` +
    `<text x="16" y="22" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="${readableForeground(primary)}">${initial}</text>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function applyFavicon(config: AppConfig) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  const href = config.brand.favicon || faviconDataUrl(config)
  if (link.getAttribute('href') !== href) {
    link.removeAttribute('type')
    link.href = href
  }
}

/** Writes the config to CSS custom properties on <html>. Safe to call repeatedly. */
export function applyTheme(config: AppConfig, mode: ResolvedMode) {
  const { colors, typography, layout } = config
  const root = document.documentElement
  const tokens = neutralTokens(colors.neutral, mode)
  const bg = mode === 'light' ? colors.backgroundLight : colors.backgroundDark
  const surface = mode === 'light' ? colors.surfaceLight : colors.surfaceDark
  if (bg && isHexColor(bg)) tokens.background = bg
  if (surface && isHexColor(surface)) tokens.surface = surface

  const primary = resolvePrimary(config, mode)
  const vars: Record<string, string> = {
    ...Object.fromEntries(Object.entries(tokens).map(([k, v]) => [`--${k}`, v])),
    '--primary': primary,
    '--primary-foreground': readableForeground(primary),
    '--chart': colors.chart ? forMode(colors.chart, mode, primary) : primary,
    '--success': forMode(colors.success, mode, '#16a34a'),
    '--warning': forMode(colors.warning, mode, '#d97706'),
    '--danger': forMode(colors.danger, mode, '#dc2626'),
    '--info': forMode(colors.info, mode, '#0284c7'),
    ...sidebarVars(config, mode),
    ...cardVars(layout.cardStyle, mode),
    '--radius': radius[layout.radius],
    '--sidebar-width': sidebarWidth[layout.sidebarWidth],
    '--font-body': fontStack(typography.fontFamily),
    '--font-display': fontStack(typography.headingFontFamily),
    '--font-size-base': `${typography.baseFontSize}px`,
    '--heading-weight': String(typography.headingWeight),
    '--heading-tracking': typography.headingTracking === 'tight' ? '-0.02em' : '0em',
  }

  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode
  if (config.locale.language) root.lang = config.locale.language
  for (const [key, value] of Object.entries(vars)) root.style.setProperty(key, value)

  loadFont(typography.fontFamily)
  loadFont(typography.headingFontFamily)
  applyFavicon(config)
}
