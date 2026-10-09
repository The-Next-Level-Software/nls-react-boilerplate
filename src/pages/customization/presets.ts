import type { AppConfig } from '@/theme/types'

export interface Preset {
  id: string
  name: string
  description: string
  colors: Pick<AppConfig['colors'], 'primary' | 'neutral'> & Partial<AppConfig['colors']>
  typography: Pick<AppConfig['typography'], 'fontFamily' | 'headingFontFamily'> & Partial<AppConfig['typography']>
  layout: Pick<AppConfig['layout'], 'radius' | 'cardStyle' | 'sidebarStyle' | 'navStyle' | 'headerStyle'>
}

/** One-click starting points. Each sets colors, fonts and key layout options; everything else is kept. */
export const presets: Preset[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Monochrome, quiet and neutral',
    colors: { primary: '#18181b', neutral: 'zinc' },
    typography: { fontFamily: 'inter', headingFontFamily: 'inter' },
    layout: { radius: 'md', cardStyle: 'border', sidebarStyle: 'default', navStyle: 'soft', headerStyle: 'blur' },
  },
  {
    id: 'indigo',
    name: 'Indigo',
    description: 'Classic SaaS look',
    colors: { primary: '#4f46e5', neutral: 'slate' },
    typography: { fontFamily: 'inter', headingFontFamily: 'inter' },
    layout: { radius: 'md', cardStyle: 'border', sidebarStyle: 'default', navStyle: 'soft', headerStyle: 'blur' },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Dark sidebar, crisp and formal',
    colors: { primary: '#1d4ed8', neutral: 'gray' },
    typography: { fontFamily: 'ibm-plex', headingFontFamily: 'ibm-plex' },
    layout: { radius: 'sm', cardStyle: 'border', sidebarStyle: 'dark', navStyle: 'bar', headerStyle: 'solid' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm blues, soft shadows',
    colors: { primary: '#0284c7', neutral: 'slate' },
    typography: { fontFamily: 'plus-jakarta', headingFontFamily: 'plus-jakarta' },
    layout: { radius: 'lg', cardStyle: 'shadow', sidebarStyle: 'default', navStyle: 'solid', headerStyle: 'plain' },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural greens on warm grays',
    colors: { primary: '#059669', neutral: 'stone' },
    typography: { fontFamily: 'dm-sans', headingFontFamily: 'dm-sans' },
    layout: { radius: 'lg', cardStyle: 'both', sidebarStyle: 'default', navStyle: 'soft', headerStyle: 'blur' },
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Bold brand-colored sidebar',
    colors: { primary: '#7c3aed', neutral: 'slate' },
    typography: { fontFamily: 'geist', headingFontFamily: 'geist' },
    layout: { radius: 'md', cardStyle: 'border', sidebarStyle: 'brand', navStyle: 'solid', headerStyle: 'solid' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm, friendly and rounded',
    colors: { primary: '#ea580c', neutral: 'stone' },
    typography: { fontFamily: 'manrope', headingFontFamily: 'manrope' },
    layout: { radius: 'xl', cardStyle: 'shadow', sidebarStyle: 'default', navStyle: 'solid', headerStyle: 'plain' },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Elegant and modern',
    colors: { primary: '#e11d48', neutral: 'zinc' },
    typography: { fontFamily: 'figtree', headingFontFamily: 'figtree' },
    layout: { radius: 'lg', cardStyle: 'border', sidebarStyle: 'default', navStyle: 'soft', headerStyle: 'blur' },
  },
  {
    id: 'teal',
    name: 'Soft teal',
    description: 'Gentle, airy, very rounded',
    colors: { primary: '#0d9488', neutral: 'neutral' },
    typography: { fontFamily: 'nunito', headingFontFamily: 'nunito' },
    layout: { radius: 'xl', cardStyle: 'shadow', sidebarStyle: 'default', navStyle: 'soft', headerStyle: 'plain' },
  },
  {
    id: 'sharp',
    name: 'Sharp',
    description: 'Square corners, technical feel',
    colors: { primary: '#18181b', neutral: 'neutral' },
    typography: { fontFamily: 'space-grotesk', headingFontFamily: 'space-grotesk' },
    layout: { radius: 'none', cardStyle: 'border', sidebarStyle: 'default', navStyle: 'bar', headerStyle: 'solid' },
  },
]

export function applyPreset(config: AppConfig, preset: Preset): AppConfig {
  return {
    ...config,
    colors: {
      ...config.colors,
      chart: null,
      backgroundLight: null,
      backgroundDark: null,
      surfaceLight: null,
      surfaceDark: null,
      ...preset.colors,
    },
    typography: { ...config.typography, ...preset.typography },
    layout: { ...config.layout, ...preset.layout },
  }
}

/** Swatch colors for brand primaries offered in the color section. */
export const primarySwatches = [
  { name: 'Graphite', value: '#18181b' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Sky', value: '#0284c7' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Lime', value: '#65a30d' },
  { name: 'Amber', value: '#d97706' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Purple', value: '#9333ea' },
]
