import { Link } from 'react-router'
import { Check, ExternalLink, Monitor, Moon, Sun } from 'lucide-react'
import { ColorInput } from '@/components/ui/ColorInput'
import { ImageInput } from '@/components/ui/ImageInput'
import { Input, Textarea } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/cn'
import { formatCurrency, formatDate, formatNumber } from '@/lib/format'
import { useConfig, useConfigStore } from '@/store/config.store'
import { darkSidebarColor, neutralSwatches, neutralTokens } from '@/theme/palettes'
import type { AppConfig, NeutralPalette } from '@/theme/types'
import { FontPicker } from './FontPicker'
import { ChoiceGrid, NullableColor, OptionCard, OptionRow, SwitchRow } from './OptionCard'
import { applyPreset, presets, primarySwatches } from './presets'

const useUpdate = () => useConfigStore((s) => s.update)

/* ── Presets ──────────────────────────────────────────────────────────────── */

export function PresetsSection() {
  const config = useConfig()
  const replace = useConfigStore((s) => s.replace)

  return (
    <OptionCard
      title="Theme presets"
      description="Start from a preset, then fine-tune any option. Brand, login and feature settings are kept."
    >
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
        {presets.map((preset) => {
          const active =
            config.colors.primary === preset.colors.primary &&
            config.typography.fontFamily === preset.typography.fontFamily &&
            config.layout.sidebarStyle === preset.layout.sidebarStyle &&
            config.layout.radius === preset.layout.radius
          const sidebar =
            preset.layout.sidebarStyle === 'dark'
              ? darkSidebarColor(preset.colors.neutral)
              : preset.layout.sidebarStyle === 'brand'
                ? preset.colors.primary
                : '#ffffff'
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={active}
              onClick={() => replace(applyPreset(config, preset))}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                active ? 'border-primary bg-primary-soft' : 'border-border hover:bg-muted',
              )}
            >
              <span className="flex h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border">
                <span className="w-4" style={{ background: sidebar }} />
                <span className="flex flex-1 flex-col justify-center gap-1 bg-white px-1.5">
                  <span className="h-1.5 w-full rounded-full" style={{ background: preset.colors.primary }} />
                  <span className="h-1.5 w-2/3 rounded-full" style={{ background: neutralSwatches[preset.colors.neutral], opacity: 0.4 }} />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{preset.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{preset.description}</span>
              </span>
              {active && <Check className="ml-auto size-4 shrink-0 text-primary" />}
            </button>
          )
        })}
      </div>
    </OptionCard>
  )
}

/* ── Brand ────────────────────────────────────────────────────────────────── */

export function BrandSection() {
  const { brand, supportEmail, copyright } = useConfig()
  const update = useUpdate()
  const setBrand = (patch: Partial<AppConfig['brand']>) => update('brand', patch)

  return (
    <>
      <OptionCard title="Identity" description="Name and text shown across the app.">
        <OptionRow label="App name" htmlFor="brand-name">
          <Input id="brand-name" value={brand.name} onChange={(e) => setBrand({ name: e.target.value })} className="md:max-w-xs" />
        </OptionRow>
        <OptionRow label="Tagline" description="Shown under the name in previews and the split login." htmlFor="brand-tagline">
          <Input id="brand-tagline" value={brand.tagline} onChange={(e) => setBrand({ tagline: e.target.value })} className="md:max-w-xs" />
        </OptionRow>
        <OptionRow label="Browser tab title" description="{page} and {app} are replaced." htmlFor="brand-title">
          <Input
            id="brand-title"
            value={brand.titleTemplate}
            onChange={(e) => setBrand({ titleTemplate: e.target.value })}
            className="font-mono md:max-w-xs"
          />
        </OptionRow>
        <OptionRow label="Copyright" description="{year} is replaced with the current year." htmlFor="brand-copyright">
          <Input id="brand-copyright" value={copyright} onChange={(e) => update('copyright', e.target.value)} className="md:max-w-xs" />
        </OptionRow>
        <OptionRow label="Support email" description="Used by the Help & support link." htmlFor="brand-support">
          <Input
            id="brand-support"
            type="email"
            value={supportEmail}
            onChange={(e) => update('supportEmail', e.target.value)}
            className="md:max-w-xs"
          />
        </OptionRow>
      </OptionCard>

      <OptionCard title="Logo & favicon" description="Uploads are saved to public/brand/ when you save.">
        <OptionRow label="Logo" description="Square mark or wide wordmark. Empty = generated letter mark.">
          <ImageInput value={brand.logo} onChange={(logo) => setBrand({ logo })} aspect="wide" />
        </OptionRow>
        <OptionRow label="Logo on dark" description="Used in dark mode and on dark sidebars.">
          <ImageInput
            value={brand.logoDark}
            onChange={(logoDark) => setBrand({ logoDark })}
            aspect="wide"
            previewClassName="border-zinc-700 bg-zinc-900"
          />
        </OptionRow>
        <OptionRow label="Icon" description="Square icon for the collapsed sidebar.">
          <ImageInput value={brand.logoIcon} onChange={(logoIcon) => setBrand({ logoIcon })} maxKb={256} />
        </OptionRow>
        <OptionRow label="Logo size">
          <SegmentedControl
            aria-label="Logo size"
            value={brand.logoSize}
            onChange={(logoSize) => setBrand({ logoSize })}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
        </OptionRow>
        <SwitchRow
          label="Show name next to logo"
          description="Turn off if your logo already contains the name."
          checked={brand.showName}
          onChange={(showName) => setBrand({ showName })}
        />
        <OptionRow label="Favicon" description="Empty = generated from the first letter and primary color.">
          <ImageInput value={brand.favicon} onChange={(favicon) => setBrand({ favicon })} maxKb={128} />
        </OptionRow>
      </OptionCard>
    </>
  )
}

/* ── Colors ───────────────────────────────────────────────────────────────── */

export function ColorsSection() {
  const { colors } = useConfig()
  const update = useUpdate()
  const set = (patch: Partial<AppConfig['colors']>) => update('colors', patch)
  const light = neutralTokens(colors.neutral, 'light')
  const dark = neutralTokens(colors.neutral, 'dark')

  return (
    <>
      <OptionCard title="Brand colors">
        <OptionRow label="Primary" description="Buttons, links, active navigation and focus rings. Auto-adjusted for dark mode.">
          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex max-w-xs flex-wrap gap-2 md:justify-end">
              {primarySwatches.map((p) => {
                const active = p.value === colors.primary.toLowerCase()
                return (
                  <button
                    key={p.value}
                    type="button"
                    title={p.name}
                    aria-label={p.name}
                    aria-pressed={active}
                    onClick={() => set({ primary: p.value })}
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full text-white ring-offset-2 ring-offset-surface',
                      active && 'ring-2 ring-foreground/40',
                    )}
                    style={{ background: p.value }}
                  >
                    {active && <Check className="size-3.5" />}
                  </button>
                )
              })}
            </div>
            <ColorInput aria-label="Primary color" value={colors.primary} onChange={(primary) => set({ primary })} />
          </div>
        </OptionRow>
        <OptionRow label="Chart color" description="Default = same as primary.">
          <NullableColor label="Chart color" value={colors.chart} fallback={colors.primary} onChange={(chart) => set({ chart })} />
        </OptionRow>
        <OptionRow label="Neutral palette" description="Tint of the grays used for text, borders and surfaces.">
          <div className="flex max-w-sm flex-wrap gap-2 md:justify-end">
            {(Object.keys(neutralSwatches) as NeutralPalette[]).map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={colors.neutral === n}
                onClick={() => set({ neutral: n })}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm capitalize transition-colors',
                  colors.neutral === n ? 'border-primary bg-primary-soft' : 'border-border hover:bg-muted',
                )}
              >
                <span className="size-3.5 rounded-full" style={{ background: neutralSwatches[n] }} />
                {n}
              </button>
            ))}
          </div>
        </OptionRow>
      </OptionCard>

      <OptionCard title="Surfaces" description="Override the page and card colors per mode.">
        <OptionRow label="Page background (light)">
          <NullableColor
            label="Light background"
            value={colors.backgroundLight}
            fallback={light.background}
            onChange={(v) => set({ backgroundLight: v })}
          />
        </OptionRow>
        <OptionRow label="Card surface (light)">
          <NullableColor
            label="Light surface"
            value={colors.surfaceLight}
            fallback={light.surface}
            onChange={(v) => set({ surfaceLight: v })}
          />
        </OptionRow>
        <OptionRow label="Page background (dark)">
          <NullableColor
            label="Dark background"
            value={colors.backgroundDark}
            fallback={dark.background}
            onChange={(v) => set({ backgroundDark: v })}
          />
        </OptionRow>
        <OptionRow label="Card surface (dark)">
          <NullableColor
            label="Dark surface"
            value={colors.surfaceDark}
            fallback={dark.surface}
            onChange={(v) => set({ surfaceDark: v })}
          />
        </OptionRow>
      </OptionCard>

      <OptionCard title="Status colors" description="Badges, alerts, toasts and trend indicators. Auto-adjusted for dark mode.">
        {(
          [
            ['success', 'Success'],
            ['warning', 'Warning'],
            ['danger', 'Danger'],
            ['info', 'Info'],
          ] as const
        ).map(([key, label]) => (
          <OptionRow key={key} label={label}>
            <ColorInput aria-label={`${label} color`} value={colors[key]} onChange={(v) => set({ [key]: v })} />
          </OptionRow>
        ))}
      </OptionCard>
    </>
  )
}

/* ── Typography ───────────────────────────────────────────────────────────── */

export function TypographySection() {
  const { typography } = useConfig()
  const update = useUpdate()
  const set = (patch: Partial<AppConfig['typography']>) => update('typography', patch)

  return (
    <OptionCard title="Typography" description="Fonts load from Google Fonts on demand. Pick one below or type any Google Font name.">
      <OptionRow label="Body font" htmlFor="font-body">
        <FontPicker id="font-body" value={typography.fontFamily} onChange={(fontFamily) => set({ fontFamily })} />
      </OptionRow>
      <OptionRow label="Heading font" htmlFor="font-heading">
        <FontPicker id="font-heading" value={typography.headingFontFamily} onChange={(headingFontFamily) => set({ headingFontFamily })} />
      </OptionRow>
      <OptionRow label="Base font size" description="Scales text and spacing across the whole interface.">
        <SegmentedControl
          aria-label="Base font size"
          value={typography.baseFontSize}
          onChange={(baseFontSize) => set({ baseFontSize })}
          options={([14, 15, 16, 17] as const).map((n) => ({ value: n, label: `${n}px` }))}
        />
      </OptionRow>
      <OptionRow label="Heading weight">
        <SegmentedControl
          aria-label="Heading weight"
          value={typography.headingWeight}
          onChange={(headingWeight) => set({ headingWeight })}
          options={[
            { value: 500, label: 'Medium' },
            { value: 600, label: 'Semibold' },
            { value: 700, label: 'Bold' },
          ]}
        />
      </OptionRow>
      <OptionRow label="Heading letter spacing">
        <SegmentedControl
          aria-label="Heading letter spacing"
          value={typography.headingTracking}
          onChange={(headingTracking) => set({ headingTracking })}
          options={[
            { value: 'tight', label: 'Tight' },
            { value: 'normal', label: 'Normal' },
          ]}
        />
      </OptionRow>
    </OptionCard>
  )
}

/* ── Layout ───────────────────────────────────────────────────────────────── */

const thumb = 'flex h-10 w-full overflow-hidden rounded border border-border bg-background'

export function LayoutSection() {
  const { layout, colors, defaultMode } = useConfig()
  const update = useUpdate()
  const set = (patch: Partial<AppConfig['layout']>) => update('layout', patch)

  return (
    <>
      <OptionCard title="General">
        <OptionRow label="Corner radius">
          <SegmentedControl
            aria-label="Corner radius"
            value={layout.radius}
            onChange={(radius) => set({ radius })}
            options={[
              { value: 'none', label: 'None' },
              { value: 'sm', label: 'S' },
              { value: 'md', label: 'M' },
              { value: 'lg', label: 'L' },
              { value: 'xl', label: 'XL' },
            ]}
          />
        </OptionRow>
        <OptionRow label="Card style">
          <ChoiceGrid
            aria-label="Card style"
            value={layout.cardStyle}
            onChange={(cardStyle) => set({ cardStyle })}
            options={[
              { value: 'border', label: 'Border', preview: <span className="h-8 w-full rounded border border-input bg-surface" /> },
              { value: 'shadow', label: 'Shadow', preview: <span className="h-8 w-full rounded bg-surface shadow-md" /> },
              { value: 'both', label: 'Both', preview: <span className="h-8 w-full rounded border border-input bg-surface shadow-md" /> },
              { value: 'flat', label: 'Flat', preview: <span className="h-8 w-full rounded bg-muted" /> },
            ]}
          />
        </OptionRow>
        <OptionRow label="Content width" description="Boxed caps page content at 1280px.">
          <SegmentedControl
            aria-label="Content width"
            value={layout.contentWidth}
            onChange={(contentWidth) => set({ contentWidth })}
            options={[
              { value: 'full', label: 'Full' },
              { value: 'boxed', label: 'Boxed' },
            ]}
          />
        </OptionRow>
        <OptionRow label="Default color mode" description="Used until a user picks their own.">
          <SegmentedControl
            aria-label="Default color mode"
            value={defaultMode}
            onChange={(mode) => update('defaultMode', mode)}
            options={[
              {
                value: 'light',
                label: (
                  <>
                    <Sun /> Light
                  </>
                ),
              },
              {
                value: 'dark',
                label: (
                  <>
                    <Moon /> Dark
                  </>
                ),
              },
              {
                value: 'system',
                label: (
                  <>
                    <Monitor /> System
                  </>
                ),
              },
            ]}
          />
        </OptionRow>
      </OptionCard>

      <OptionCard title="Sidebar">
        <OptionRow label="Style">
          <div className="flex w-full flex-col gap-3 md:items-end">
            <ChoiceGrid
              aria-label="Sidebar style"
              value={layout.sidebarStyle}
              onChange={(sidebarStyle) => set({ sidebarStyle })}
              options={[
                {
                  value: 'default',
                  label: 'Default',
                  preview: (
                    <span className={thumb}>
                      <span className="w-4 border-r border-border bg-surface" />
                    </span>
                  ),
                },
                {
                  value: 'dark',
                  label: 'Dark',
                  preview: (
                    <span className={thumb}>
                      <span className="w-4" style={{ background: darkSidebarColor(colors.neutral) }} />
                    </span>
                  ),
                },
                {
                  value: 'brand',
                  label: 'Brand',
                  preview: (
                    <span className={thumb}>
                      <span className="w-4 bg-primary" />
                    </span>
                  ),
                },
                {
                  value: 'custom',
                  label: 'Custom',
                  preview: (
                    <span className={thumb}>
                      <span className="w-4" style={{ background: colors.sidebar }} />
                    </span>
                  ),
                },
              ]}
            />
            {layout.sidebarStyle === 'custom' && (
              <ColorInput aria-label="Sidebar color" value={colors.sidebar} onChange={(sidebar) => update('colors', { sidebar })} />
            )}
          </div>
        </OptionRow>
        <OptionRow label="Active item">
          <ChoiceGrid
            aria-label="Active navigation item style"
            columns={3}
            value={layout.navStyle}
            onChange={(navStyle) => set({ navStyle })}
            options={[
              { value: 'soft', label: 'Soft', preview: <span className="h-6 w-full rounded bg-primary-soft" /> },
              { value: 'bar', label: 'Bar', preview: <span className="h-6 w-full rounded border-l-[3px] border-primary bg-muted" /> },
              { value: 'solid', label: 'Solid', preview: <span className="h-6 w-full rounded bg-primary" /> },
            ]}
          />
        </OptionRow>
        <OptionRow label="Width">
          <SegmentedControl
            aria-label="Sidebar width"
            value={layout.sidebarWidth}
            onChange={(sidebarWidth) => set({ sidebarWidth })}
            options={[
              { value: 'narrow', label: 'Narrow' },
              { value: 'default', label: 'Default' },
              { value: 'wide', label: 'Wide' },
            ]}
          />
        </OptionRow>
        <SwitchRow
          label="Section titles"
          description="Headings like “Overview” and “Management”."
          checked={layout.sidebarSectionTitles}
          onChange={(sidebarSectionTitles) => set({ sidebarSectionTitles })}
        />
        <SwitchRow
          label="Collapsed by default"
          description="Start with the icon-only sidebar for new visitors."
          checked={layout.sidebarCollapsed}
          onChange={(sidebarCollapsed) => set({ sidebarCollapsed })}
        />
      </OptionCard>

      <OptionCard title="Top bar">
        <OptionRow label="Style">
          <ChoiceGrid
            aria-label="Top bar style"
            columns={3}
            value={layout.headerStyle}
            onChange={(headerStyle) => set({ headerStyle })}
            options={[
              {
                value: 'blur',
                label: 'Translucent',
                preview: <span className="h-6 w-full rounded border-b border-border bg-surface/60 backdrop-blur" />,
              },
              { value: 'solid', label: 'Solid', preview: <span className="h-6 w-full rounded border-b border-border bg-surface" /> },
              { value: 'plain', label: 'Plain', preview: <span className="h-6 w-full rounded bg-background" /> },
            ]}
          />
        </OptionRow>
      </OptionCard>
    </>
  )
}

/* ── Login ────────────────────────────────────────────────────────────────── */

export function LoginSection() {
  const { login, features } = useConfig()
  const update = useUpdate()
  const set = (patch: Partial<AppConfig['login']>) => update('login', patch)

  return (
    <OptionCard title="Login page" description="Sign-in and password reset screens.">
      <OptionRow label="Preview">
        <Link
          to="/login-preview"
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Open login preview <ExternalLink className="size-3.5" />
        </Link>
      </OptionRow>
      <OptionRow label="Layout">
        <ChoiceGrid
          aria-label="Login layout"
          columns={2}
          value={login.layout}
          onChange={(layout) => set({ layout })}
          options={[
            {
              value: 'centered',
              label: 'Centered',
              preview: (
                <span className={cn(thumb, 'items-center justify-center')}>
                  <span className="h-6 w-8 rounded-sm border border-border bg-surface" />
                </span>
              ),
            },
            {
              value: 'split',
              label: 'Split',
              preview: (
                <span className={thumb}>
                  <span className="flex flex-1 items-center justify-center">
                    <span className="h-5 w-6 rounded-sm bg-muted" />
                  </span>
                  <span className="flex-1 bg-primary" />
                </span>
              ),
            },
          ]}
        />
      </OptionRow>
      {login.layout === 'centered' ? (
        <OptionRow label="Background pattern">
          <SegmentedControl
            aria-label="Background pattern"
            value={login.pattern}
            onChange={(pattern) => set({ pattern })}
            options={[
              { value: 'none', label: 'None' },
              { value: 'dots', label: 'Dots' },
              { value: 'grid', label: 'Grid' },
            ]}
          />
        </OptionRow>
      ) : (
        <>
          <OptionRow label="Brand panel side">
            <SegmentedControl
              aria-label="Brand panel side"
              value={login.panelPosition}
              onChange={(panelPosition) => set({ panelPosition })}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
            />
          </OptionRow>
          <OptionRow label="Panel headline" htmlFor="login-headline">
            <Input id="login-headline" value={login.headline} onChange={(e) => set({ headline: e.target.value })} className="md:max-w-sm" />
          </OptionRow>
          <OptionRow label="Panel text" htmlFor="login-sub">
            <Textarea
              id="login-sub"
              rows={2}
              value={login.subheadline}
              onChange={(e) => set({ subheadline: e.target.value })}
              className="md:max-w-sm"
            />
          </OptionRow>
          <OptionRow label="Panel image" description="Replaces the brand-colored panel.">
            <ImageInput value={login.backgroundImage} onChange={(backgroundImage) => set({ backgroundImage })} aspect="wide" maxKb={2048} />
          </OptionRow>
        </>
      )}
      <OptionRow label="Form title" htmlFor="login-title">
        <Input id="login-title" value={login.title} onChange={(e) => set({ title: e.target.value })} className="md:max-w-sm" />
      </OptionRow>
      <OptionRow label="Form subtitle" htmlFor="login-subtitle">
        <Input id="login-subtitle" value={login.subtitle} onChange={(e) => set({ subtitle: e.target.value })} className="md:max-w-sm" />
      </OptionRow>
      <SwitchRow label="“Keep me signed in”" checked={login.showRememberMe} onChange={(showRememberMe) => set({ showRememberMe })} />
      <SwitchRow
        label="“Forgot password?” link"
        checked={login.showForgotPassword}
        onChange={(showForgotPassword) => set({ showForgotPassword })}
      />
      <SwitchRow
        label="Demo credentials hint"
        description="Only shown while running on mock data."
        checked={features.showDemoCredentials}
        onChange={(showDemoCredentials) => update('features', { showDemoCredentials })}
      />
    </OptionCard>
  )
}

/* ── Features & locale ────────────────────────────────────────────────────── */

const languages = [
  { value: '', label: 'Browser default' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'es-ES', label: 'Español' },
  { value: 'it-IT', label: 'Italiano' },
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'nl-NL', label: 'Nederlands' },
  { value: 'tr-TR', label: 'Türkçe' },
  { value: 'ar-AE', label: 'العربية (UAE)' },
  { value: 'ur-PK', label: 'اردو (Pakistan)' },
  { value: 'hi-IN', label: 'हिन्दी (India)' },
  { value: 'ja-JP', label: '日本語' },
  { value: 'zh-CN', label: '中文 (简体)' },
]
const currencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'PKR', 'INR', 'CAD', 'AUD', 'JPY', 'CNY', 'TRY', 'BRL', 'CHF'].map((c) => ({
  value: c,
  label: c,
}))

export function FeaturesSection() {
  const { features, locale } = useConfig()
  const update = useUpdate()
  const set = (patch: Partial<AppConfig['features']>) => update('features', patch)

  return (
    <>
      <OptionCard title="Features" description="Turn parts of the interface on or off.">
        <SwitchRow
          label="Light / dark switch"
          description="When off, everyone gets the default color mode."
          checked={features.modeToggle}
          onChange={(modeToggle) => set({ modeToggle })}
        />
        <SwitchRow label="Search in top bar" checked={features.search} onChange={(search) => set({ search })} />
        <SwitchRow label="Notifications bell" checked={features.notifications} onChange={(notifications) => set({ notifications })} />
        <SwitchRow label="Help & support link" checked={features.helpLink} onChange={(helpLink) => set({ helpLink })} />
        <OptionRow label="Customization page" description="Where this page is available after you save.">
          <SegmentedControl
            aria-label="Customization page availability"
            value={features.customizer}
            onChange={(customizer) => set({ customizer })}
            options={[
              { value: 'dev', label: 'Dev only' },
              { value: 'always', label: 'Always' },
              { value: 'off', label: 'Off' },
            ]}
          />
        </OptionRow>
      </OptionCard>

      <OptionCard title="Locale" description="Formatting for dates, numbers and money.">
        <OptionRow label="Language / region" htmlFor="locale-language">
          <Select
            id="locale-language"
            value={locale.language}
            onChange={(e) => update('locale', { language: e.target.value })}
            options={
              languages.some((l) => l.value === locale.language)
                ? languages
                : [...languages, { value: locale.language, label: locale.language }]
            }
            className="md:w-56"
          />
        </OptionRow>
        <OptionRow label="Currency" htmlFor="locale-currency">
          <Select
            id="locale-currency"
            value={locale.currency}
            onChange={(e) => update('locale', { currency: e.target.value })}
            options={
              currencies.some((c) => c.value === locale.currency)
                ? currencies
                : [...currencies, { value: locale.currency, label: locale.currency }]
            }
            className="md:w-56"
          />
        </OptionRow>
        <OptionRow label="Example">
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatDate(new Date(), locale)} · {formatNumber(1234567.89, locale)} · {formatCurrency(48290, locale)}
          </p>
        </OptionRow>
      </OptionCard>
    </>
  )
}
