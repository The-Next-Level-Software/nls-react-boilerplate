import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { fonts, fontStack, isCuratedFont } from '@/theme/fonts'
import type { FontChoice } from '@/theme/types'

const CUSTOM = '__custom'
const options = [...Object.entries(fonts).map(([value, f]) => ({ value, label: f.label })), { value: CUSTOM, label: 'Other Google Font…' }]

/** Curated font list plus any Google Fonts family typed by name. */
export function FontPicker({ id, value, onChange }: { id: string; value: FontChoice; onChange: (value: FontChoice) => void }) {
  const curated = isCuratedFont(value)
  const [custom, setCustom] = useState(curated ? '' : value)
  const [editing, setEditing] = useState(!curated)

  const commitCustom = () => {
    if (custom.trim()) onChange(custom.trim())
  }

  return (
    <div className="flex w-full flex-col gap-2 md:max-w-xs">
      <Select
        id={id}
        value={editing ? CUSTOM : value}
        onChange={(e) => {
          if (e.target.value === CUSTOM) setEditing(true)
          else {
            setEditing(false)
            onChange(e.target.value)
          }
        }}
        options={options}
      />
      {editing && (
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onBlur={commitCustom}
          onKeyDown={(e) => e.key === 'Enter' && commitCustom()}
          placeholder="Google Font name, e.g. Rubik"
          aria-label="Google Font family name"
        />
      )}
      <p className="truncate text-sm text-muted-foreground" style={{ fontFamily: fontStack(value) }}>
        The quick brown fox jumps over the lazy dog
      </p>
    </div>
  )
}
