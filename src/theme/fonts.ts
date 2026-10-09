import type { FontChoice } from './types'

export interface FontOption {
  label: string
  /** Google Fonts family name. Omit for system fonts. */
  family?: string
}

const fallback = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'

/** Curated fonts offered in the Customization page. Any other Google Fonts family name also works. */
export const fonts = {
  inter: { label: 'Inter', family: 'Inter' },
  geist: { label: 'Geist', family: 'Geist' },
  'dm-sans': { label: 'DM Sans', family: 'DM Sans' },
  manrope: { label: 'Manrope', family: 'Manrope' },
  'plus-jakarta': { label: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans' },
  figtree: { label: 'Figtree', family: 'Figtree' },
  'ibm-plex': { label: 'IBM Plex Sans', family: 'IBM Plex Sans' },
  roboto: { label: 'Roboto', family: 'Roboto' },
  'open-sans': { label: 'Open Sans', family: 'Open Sans' },
  lato: { label: 'Lato', family: 'Lato' },
  nunito: { label: 'Nunito', family: 'Nunito' },
  montserrat: { label: 'Montserrat', family: 'Montserrat' },
  poppins: { label: 'Poppins', family: 'Poppins' },
  outfit: { label: 'Outfit', family: 'Outfit' },
  sora: { label: 'Sora', family: 'Sora' },
  'space-grotesk': { label: 'Space Grotesk', family: 'Space Grotesk' },
  system: { label: 'System UI' },
} satisfies Record<string, FontOption>

export type FontKey = keyof typeof fonts

export const isCuratedFont = (choice: FontChoice): choice is FontKey => choice in fonts

function familyOf(choice: FontChoice): string | undefined {
  if (isCuratedFont(choice)) return (fonts[choice] as FontOption).family
  return choice.trim() || undefined
}

export function fontStack(choice: FontChoice) {
  const family = familyOf(choice)
  return family ? `"${family}", ${fallback}` : fallback
}

/**
 * Loads a Google font once. Tries weights 400–700, then 400+700, then the default
 * weight, because Google rejects requests for weights a family doesn't have.
 */
export function loadFont(choice: FontChoice) {
  const family = familyOf(choice)
  if (!family) return
  const id = family.toLowerCase().replace(/\s+/g, '-')
  if (document.querySelector(`link[data-font="${id}"]`)) return

  const name = family.replace(/\s+/g, '+')
  const attempts = [`${name}:wght@400;500;600;700`, `${name}:wght@400;700`, name]
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.dataset.font = id
  let attempt = 0
  link.onerror = () => {
    attempt += 1
    if (attempt < attempts.length) link.href = `https://fonts.googleapis.com/css2?family=${attempts[attempt]}&display=swap`
  }
  link.href = `https://fonts.googleapis.com/css2?family=${attempts[0]}&display=swap`
  document.head.appendChild(link)
}
