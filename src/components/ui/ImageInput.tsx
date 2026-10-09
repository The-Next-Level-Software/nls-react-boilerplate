import { useRef, useState } from 'react'
import { ImageIcon, Link2, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/cn'
import { readImageFile } from '@/lib/file'
import { Button } from './Button'
import { Input } from './Input'

interface ImageInputProps {
  value: string | null
  onChange: (value: string | null) => void
  /** Preview box shape. */
  aspect?: 'square' | 'wide'
  /** Classes for the preview box, e.g. a dark background to preview a dark-mode logo. */
  previewClassName?: string
  maxKb?: number
}

/** Pick an image by upload (kept as a data URL until saved) or by path/URL such as `/logo.svg`. */
export function ImageInput({ value, onChange, aspect = 'square', previewClassName, maxKb = 512 }: ImageInputProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [url, setUrl] = useState('')

  const onFile = async (file?: File) => {
    if (!file) return
    try {
      onChange(await readImageFile(file, maxKb))
      setError('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const applyUrl = () => {
    if (url.trim()) onChange(url.trim())
    setShowUrl(false)
    setUrl('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/50',
            aspect === 'square' ? 'size-14' : 'h-14 w-36',
            previewClassName,
          )}
        >
          {value ? (
            <img src={value} alt="" className="max-h-full max-w-full object-contain p-1.5" />
          ) : (
            <ImageIcon className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload />
            Upload
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowUrl((s) => !s)}>
            <Link2 />
            URL
          </Button>
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)} aria-label="Remove image">
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
      {showUrl && (
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
            placeholder="/brand/logo.svg or https://…"
            aria-label="Image path or URL"
            autoFocus
          />
          <Button variant="outline" onClick={applyUrl}>
            Apply
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
