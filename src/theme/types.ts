// Type-only module: also imported by the Vite config-writer plugin, so keep it free of runtime code.

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedMode = 'light' | 'dark'
export type NeutralPalette = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
export type RadiusScale = 'none' | 'sm' | 'md' | 'lg' | 'xl'
export type SidebarStyle = 'default' | 'dark' | 'brand' | 'custom'
export type SidebarWidth = 'narrow' | 'default' | 'wide'
export type NavStyle = 'soft' | 'bar' | 'solid'
export type HeaderStyle = 'blur' | 'solid' | 'plain'
export type CardStyle = 'border' | 'shadow' | 'both' | 'flat'
export type ContentWidth = 'full' | 'boxed'
export type LoginLayout = 'centered' | 'split'
export type LoginPattern = 'none' | 'dots' | 'grid'
export type LogoSize = 'sm' | 'md' | 'lg'
export type BaseFontSize = 14 | 15 | 16 | 17
export type HeadingWeight = 500 | 600 | 700
export type CustomizerMode = 'dev' | 'always' | 'off'

/** A key from `src/theme/fonts.ts` (e.g. 'inter'), or any other Google Fonts family name (e.g. 'Lato'). */
export type FontChoice = string

export interface AppConfig {
  brand: {
    name: string
    tagline: string
    /** Path (e.g. '/brand/logo.svg'), URL or data URL. `null` renders a generated letter mark. */
    logo: string | null
    /** Logo used on dark backgrounds. Falls back to `logo`. */
    logoDark: string | null
    /** Square icon used in the collapsed sidebar. Falls back to the left edge of `logo`. */
    logoIcon: string | null
    logoSize: LogoSize
    /** Show the name next to the logo. Turn off if the logo already contains the name. */
    showName: boolean
    /** `null` generates one from the first letter and the primary color. */
    favicon: string | null
    /** Browser tab title. `{page}` and `{app}` are replaced. */
    titleTemplate: string
  }
  colors: {
    primary: string
    /** Chart color. `null` uses the primary color. */
    chart: string | null
    neutral: NeutralPalette
    /** Overrides (hex). `null` uses the neutral palette. */
    backgroundLight: string | null
    backgroundDark: string | null
    surfaceLight: string | null
    surfaceDark: string | null
    /** Used when `layout.sidebarStyle` is 'custom'. */
    sidebar: string
    success: string
    warning: string
    danger: string
    info: string
  }
  typography: {
    fontFamily: FontChoice
    headingFontFamily: FontChoice
    baseFontSize: BaseFontSize
    headingWeight: HeadingWeight
    headingTracking: 'tight' | 'normal'
  }
  layout: {
    radius: RadiusScale
    cardStyle: CardStyle
    contentWidth: ContentWidth
    headerStyle: HeaderStyle
    sidebarStyle: SidebarStyle
    sidebarWidth: SidebarWidth
    navStyle: NavStyle
    sidebarSectionTitles: boolean
    sidebarCollapsed: boolean
  }
  login: {
    layout: LoginLayout
    /** Side of the brand panel in the split layout. */
    panelPosition: 'left' | 'right'
    /** Background pattern for the centered layout. */
    pattern: LoginPattern
    title: string
    subtitle: string
    /** Brand panel text and optional image (split layout). */
    headline: string
    subheadline: string
    backgroundImage: string | null
    showRememberMe: boolean
    showForgotPassword: boolean
  }
  defaultMode: ThemeMode
  features: {
    /** Let users switch light/dark. When off, `defaultMode` is always used. */
    modeToggle: boolean
    search: boolean
    notifications: boolean
    helpLink: boolean
    /** Show the demo-credentials hint on the login page (mock API only). */
    showDemoCredentials: boolean
    /** Customization page: 'dev' = only while running `npm run dev`, 'always' = also in production, 'off'. */
    customizer: CustomizerMode
  }
  locale: {
    /** BCP 47 language tag for dates and numbers, e.g. 'en-US', 'de-DE'. Empty = the browser's. */
    language: string
    /** ISO 4217 currency code, e.g. 'USD', 'EUR', 'PKR'. */
    currency: string
  }
  /** Backend base URL. Read from VITE_API_URL; empty = mock API. */
  apiUrl: string
  storagePrefix: string
  demoCredentials: { email: string; password: string }
  supportEmail: string
  /** `{year}` is replaced with the current year. */
  copyright: string
}
