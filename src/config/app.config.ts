import type { AppConfig } from '@/theme/types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  App configuration: the one file to edit when starting a new project.
 *  Branding, colors, fonts, layout and features all live here; the whole admin
 *  panel (sidebar, login page, charts, favicon, …) follows these values.
 *
 *  Tip: run `npm run dev` and open /customization to edit this visually.
 *  "Save" rewrites this file (uploaded images go to public/brand/).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const appConfig: AppConfig = {
  /* ── Brand ─────────────────────────────────────────────────────────────── */
  brand: {
    /** Shown in the sidebar, browser tab and login page. VITE_APP_NAME overrides it. */
    name: import.meta.env.VITE_APP_NAME || 'Acme Admin',
    tagline: 'Admin Console',
    /** Logo: a file in public/ (e.g. '/brand/logo.svg') or a URL. null = generated letter mark. */
    logo: null,
    /** Logo for dark backgrounds (dark mode, dark sidebar). Falls back to `logo`. */
    logoDark: null,
    /** Square icon for the collapsed sidebar. Falls back to the left edge of `logo`. */
    logoIcon: null,
    /** 'sm' | 'md' | 'lg' */
    logoSize: 'md',
    /** Show the name next to the logo. false if the logo already contains the name. */
    showName: true,
    /** null = generated from the first letter and the primary color. */
    favicon: null,
    /** Browser tab title. {page} and {app} are replaced. */
    titleTemplate: '{page} · {app}',
  },

  /* ── Colors (hex) ──────────────────────────────────────────────────────── */
  colors: {
    /** Buttons, links, active nav, focus rings. Dark colors are lightened automatically in dark mode. */
    primary: '#18181b',
    /** Chart color. null = primary. */
    chart: null,
    /** Gray tint for text, borders and surfaces: 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' */
    neutral: 'zinc',
    /** Page background and card (surface) overrides per mode. null = from the neutral palette. */
    backgroundLight: null,
    backgroundDark: null,
    surfaceLight: null,
    surfaceDark: null,
    /** Sidebar color, used when layout.sidebarStyle is 'custom'. */
    sidebar: '#18181b',
    /** Status colors (badges, alerts, toasts, trends). Lightened automatically in dark mode. */
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0284c7',
  },

  /* ── Typography ────────────────────────────────────────────────────────── */
  typography: {
    /**
     * A key from src/theme/fonts.ts ('inter', 'geist', 'dm-sans', 'manrope', 'plus-jakarta', 'figtree',
     * 'ibm-plex', 'roboto', 'open-sans', 'lato', 'nunito', 'montserrat', 'poppins', 'outfit', 'sora',
     * 'space-grotesk', 'system') or any Google Fonts family name, e.g. 'Rubik'.
     */
    fontFamily: 'inter',
    headingFontFamily: 'inter',
    /** Root size in px: 14 | 15 | 16 | 17. Scales text and spacing across the UI. */
    baseFontSize: 16,
    /** 500 | 600 | 700 */
    headingWeight: 600,
    /** 'tight' | 'normal' */
    headingTracking: 'tight',
  },

  /* ── Layout ────────────────────────────────────────────────────────────── */
  layout: {
    /** Corner roundness: 'none' | 'sm' | 'md' | 'lg' | 'xl' */
    radius: 'md',
    /** Cards: 'border' | 'shadow' | 'both' | 'flat' */
    cardStyle: 'border',
    /** 'full' | 'boxed' (max 1280px) */
    contentWidth: 'full',
    /** Top bar: 'blur' (translucent) | 'solid' | 'plain' (blends into the page) */
    headerStyle: 'blur',
    /** 'default' (matches cards) | 'dark' | 'brand' (primary color) | 'custom' (colors.sidebar) */
    sidebarStyle: 'default',
    /** 'narrow' | 'default' | 'wide' */
    sidebarWidth: 'default',
    /** Active nav item: 'soft' (tinted) | 'bar' (side indicator) | 'solid' (filled) */
    navStyle: 'soft',
    sidebarSectionTitles: true,
    /** Start with the icon-only sidebar on desktop. */
    sidebarCollapsed: false,
  },

  /* ── Login page ────────────────────────────────────────────────────────── */
  login: {
    /** 'centered' (card) | 'split' (form + brand panel) */
    layout: 'split',
    /** Brand panel side for 'split': 'left' | 'right' */
    panelPosition: 'right',
    /** Background for 'centered': 'none' | 'dots' | 'grid' */
    pattern: 'none',
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue.',
    /** Brand panel text and optional image ('split' layout). */
    headline: 'Manage everything in one place',
    subheadline: 'A clean, fast admin console for your team.',
    backgroundImage: null,
    showRememberMe: true,
    showForgotPassword: true,
  },

  /** Color mode until the user picks one: 'light' | 'dark' | 'system' */
  defaultMode: 'system',

  /* ── Features ──────────────────────────────────────────────────────────── */
  features: {
    /** Light/dark switch for users. false = always use defaultMode. */
    modeToggle: true,
    /** Search box in the top bar. */
    search: true,
    /** Notifications bell in the top bar. */
    notifications: true,
    /** "Help & support" link in the sidebar (mailto: supportEmail). */
    helpLink: true,
    /** Demo credentials hint on the login page (mock API only). */
    showDemoCredentials: true,
    /** Customization page: 'dev' (npm run dev only) | 'always' (also in production) | 'off' */
    customizer: 'dev',
  },

  /* ── Locale ────────────────────────────────────────────────────────────── */
  locale: {
    /** Dates and numbers, e.g. 'en-US', 'en-GB', 'de-DE', 'ar-AE'. '' = the browser's language. */
    language: '',
    /** ISO 4217 code, e.g. 'USD', 'EUR', 'GBP', 'PKR', 'AED'. */
    currency: 'USD',
  },

  /* ── App & API ─────────────────────────────────────────────────────────── */
  /** Backend base URL from .env. While empty, services use the mock data in src/mocks. */
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  /** Prefix for localStorage keys so multiple apps on one domain don't collide. */
  storagePrefix: 'admin',
  /** Accepted by the mock API. */
  demoCredentials: {
    email: 'admin@example.com',
    password: 'password',
  },
  supportEmail: 'support@example.com',
  /** {year} is replaced with the current year. */
  copyright: '© {year} Acme Inc.',
}

export const useMockApi = !appConfig.apiUrl
