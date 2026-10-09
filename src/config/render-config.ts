// Renders `src/config/app.config.ts` from a config object, comments included.
// Used by the Customization page (export) and the dev-server plugin (save), so the
// file always keeps the same documented layout. Keep this module dependency-free.
import type { AppConfig } from '../theme/types.ts'

const str = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
const val = (value: unknown): string =>
  value === null || value === undefined ? 'null' : typeof value === 'string' ? str(value) : String(value)

export function renderConfigFile(c: AppConfig): string {
  return `import type { AppConfig } from '@/theme/types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  App configuration: the one file to edit when starting a new project.
 *  Branding, colors, fonts, layout and features all live here; the whole admin
 *  panel (sidebar, login page, charts, favicon, …) follows these values.
 *
 *  Tip: run \`npm run dev\` and open /customization to edit this visually.
 *  "Save" rewrites this file (uploaded images go to public/brand/).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const appConfig: AppConfig = {
  /* ── Brand ─────────────────────────────────────────────────────────────── */
  brand: {
    /** Shown in the sidebar, browser tab and login page. VITE_APP_NAME overrides it. */
    name: import.meta.env.VITE_APP_NAME || ${val(c.brand.name)},
    tagline: ${val(c.brand.tagline)},
    /** Logo: a file in public/ (e.g. '/brand/logo.svg') or a URL. null = generated letter mark. */
    logo: ${val(c.brand.logo)},
    /** Logo for dark backgrounds (dark mode, dark sidebar). Falls back to \`logo\`. */
    logoDark: ${val(c.brand.logoDark)},
    /** Square icon for the collapsed sidebar. Falls back to the left edge of \`logo\`. */
    logoIcon: ${val(c.brand.logoIcon)},
    /** 'sm' | 'md' | 'lg' */
    logoSize: ${val(c.brand.logoSize)},
    /** Show the name next to the logo. false if the logo already contains the name. */
    showName: ${val(c.brand.showName)},
    /** null = generated from the first letter and the primary color. */
    favicon: ${val(c.brand.favicon)},
    /** Browser tab title. {page} and {app} are replaced. */
    titleTemplate: ${val(c.brand.titleTemplate)},
  },

  /* ── Colors (hex) ──────────────────────────────────────────────────────── */
  colors: {
    /** Buttons, links, active nav, focus rings. Dark colors are lightened automatically in dark mode. */
    primary: ${val(c.colors.primary)},
    /** Chart color. null = primary. */
    chart: ${val(c.colors.chart)},
    /** Gray tint for text, borders and surfaces: 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' */
    neutral: ${val(c.colors.neutral)},
    /** Page background and card (surface) overrides per mode. null = from the neutral palette. */
    backgroundLight: ${val(c.colors.backgroundLight)},
    backgroundDark: ${val(c.colors.backgroundDark)},
    surfaceLight: ${val(c.colors.surfaceLight)},
    surfaceDark: ${val(c.colors.surfaceDark)},
    /** Sidebar color, used when layout.sidebarStyle is 'custom'. */
    sidebar: ${val(c.colors.sidebar)},
    /** Status colors (badges, alerts, toasts, trends). Lightened automatically in dark mode. */
    success: ${val(c.colors.success)},
    warning: ${val(c.colors.warning)},
    danger: ${val(c.colors.danger)},
    info: ${val(c.colors.info)},
  },

  /* ── Typography ────────────────────────────────────────────────────────── */
  typography: {
    /**
     * A key from src/theme/fonts.ts ('inter', 'geist', 'dm-sans', 'manrope', 'plus-jakarta', 'figtree',
     * 'ibm-plex', 'roboto', 'open-sans', 'lato', 'nunito', 'montserrat', 'poppins', 'outfit', 'sora',
     * 'space-grotesk', 'system') or any Google Fonts family name, e.g. 'Rubik'.
     */
    fontFamily: ${val(c.typography.fontFamily)},
    headingFontFamily: ${val(c.typography.headingFontFamily)},
    /** Root size in px: 14 | 15 | 16 | 17. Scales text and spacing across the UI. */
    baseFontSize: ${val(c.typography.baseFontSize)},
    /** 500 | 600 | 700 */
    headingWeight: ${val(c.typography.headingWeight)},
    /** 'tight' | 'normal' */
    headingTracking: ${val(c.typography.headingTracking)},
  },

  /* ── Layout ────────────────────────────────────────────────────────────── */
  layout: {
    /** Corner roundness: 'none' | 'sm' | 'md' | 'lg' | 'xl' */
    radius: ${val(c.layout.radius)},
    /** Cards: 'border' | 'shadow' | 'both' | 'flat' */
    cardStyle: ${val(c.layout.cardStyle)},
    /** 'full' | 'boxed' (max 1280px) */
    contentWidth: ${val(c.layout.contentWidth)},
    /** Top bar: 'blur' (translucent) | 'solid' | 'plain' (blends into the page) */
    headerStyle: ${val(c.layout.headerStyle)},
    /** 'default' (matches cards) | 'dark' | 'brand' (primary color) | 'custom' (colors.sidebar) */
    sidebarStyle: ${val(c.layout.sidebarStyle)},
    /** 'narrow' | 'default' | 'wide' */
    sidebarWidth: ${val(c.layout.sidebarWidth)},
    /** Active nav item: 'soft' (tinted) | 'bar' (side indicator) | 'solid' (filled) */
    navStyle: ${val(c.layout.navStyle)},
    sidebarSectionTitles: ${val(c.layout.sidebarSectionTitles)},
    /** Start with the icon-only sidebar on desktop. */
    sidebarCollapsed: ${val(c.layout.sidebarCollapsed)},
  },

  /* ── Login page ────────────────────────────────────────────────────────── */
  login: {
    /** 'centered' (card) | 'split' (form + brand panel) */
    layout: ${val(c.login.layout)},
    /** Brand panel side for 'split': 'left' | 'right' */
    panelPosition: ${val(c.login.panelPosition)},
    /** Background for 'centered': 'none' | 'dots' | 'grid' */
    pattern: ${val(c.login.pattern)},
    title: ${val(c.login.title)},
    subtitle: ${val(c.login.subtitle)},
    /** Brand panel text and optional image ('split' layout). */
    headline: ${val(c.login.headline)},
    subheadline: ${val(c.login.subheadline)},
    backgroundImage: ${val(c.login.backgroundImage)},
    showRememberMe: ${val(c.login.showRememberMe)},
    showForgotPassword: ${val(c.login.showForgotPassword)},
  },

  /** Color mode until the user picks one: 'light' | 'dark' | 'system' */
  defaultMode: ${val(c.defaultMode)},

  /* ── Features ──────────────────────────────────────────────────────────── */
  features: {
    /** Light/dark switch for users. false = always use defaultMode. */
    modeToggle: ${val(c.features.modeToggle)},
    /** Search box in the top bar. */
    search: ${val(c.features.search)},
    /** Notifications bell in the top bar. */
    notifications: ${val(c.features.notifications)},
    /** "Help & support" link in the sidebar (mailto: supportEmail). */
    helpLink: ${val(c.features.helpLink)},
    /** Demo credentials hint on the login page (mock API only). */
    showDemoCredentials: ${val(c.features.showDemoCredentials)},
    /** Customization page: 'dev' (npm run dev only) | 'always' (also in production) | 'off' */
    customizer: ${val(c.features.customizer)},
  },

  /* ── Locale ────────────────────────────────────────────────────────────── */
  locale: {
    /** Dates and numbers, e.g. 'en-US', 'en-GB', 'de-DE', 'ar-AE'. '' = the browser's language. */
    language: ${val(c.locale.language)},
    /** ISO 4217 code, e.g. 'USD', 'EUR', 'GBP', 'PKR', 'AED'. */
    currency: ${val(c.locale.currency)},
  },

  /* ── App & API ─────────────────────────────────────────────────────────── */
  /** Backend base URL from .env. While empty, services use the mock data in src/mocks. */
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  /** Prefix for localStorage keys so multiple apps on one domain don't collide. */
  storagePrefix: ${val(c.storagePrefix)},
  /** Accepted by the mock API. */
  demoCredentials: {
    email: ${val(c.demoCredentials.email)},
    password: ${val(c.demoCredentials.password)},
  },
  supportEmail: ${val(c.supportEmail)},
  /** {year} is replaced with the current year. */
  copyright: ${val(c.copyright)},
}

export const useMockApi = !appConfig.apiUrl
`
}
