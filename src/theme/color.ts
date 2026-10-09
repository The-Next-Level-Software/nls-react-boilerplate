export function isHexColor(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Mixes `a` toward `b` by `amount` (0–1) in sRGB. */
export function mix(a: string, b: string, amount: number) {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const out = ca.map((v, i) => Math.round(v + (cb[i] - v) * amount))
  return `#${out.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Picks white or near-black text, whichever reads better on `background`. */
export function readableForeground(background: string) {
  if (!isHexColor(background)) return '#ffffff'
  return luminance(background) > 0.4 ? '#0a0a0a' : '#ffffff'
}

export function isDark(hex: string) {
  return isHexColor(hex) && luminance(hex) < 0.4
}
