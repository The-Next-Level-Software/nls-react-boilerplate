import { useState } from 'react'
import { cn } from '@/lib/cn'
import { isHexColor } from '@/theme/color'
import { inputClass } from './Input'

interface ColorInputProps {
  value: string
  onChange: (hex: string) => void
  id?: string
  className?: string
  'aria-label'?: string
}

/** Native color picker + editable hex field. Only valid hex values are committed. */
export function ColorInput({ value, onChange, id, className, ...props }: ColorInputProps) {
  const [text, setText] = useState(value)
  const [synced, setSynced] = useState(value)
  if (value !== synced) {
    setSynced(value)
    setText(value)
  }

  const commit = (next: string) => {
    const hex = next.startsWith('#') ? next : `#${next}`
    setText(hex)
    if (isHexColor(hex)) onChange(hex.toLowerCase())
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label
        className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-input shadow-xs"
        style={{ background: value }}
      >
        <input
          type="color"
          value={isHexColor(value) && value.length === 7 ? value : '#000000'}
          onChange={(e) => commit(e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          aria-label={props['aria-label'] ? `${props['aria-label']} picker` : 'Color picker'}
        />
      </label>
      <input
        id={id}
        value={text}
        onChange={(e) => commit(e.target.value)}
        onBlur={() => setText(value)}
        spellCheck={false}
        maxLength={7}
        className={cn(inputClass, 'w-28 font-mono uppercase')}
        aria-label={props['aria-label']}
      />
    </div>
  )
}
