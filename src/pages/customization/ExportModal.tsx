import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { renderConfigFile } from '@/config/render-config'
import { useConfig, useConfigStore } from '@/store/config.store'
import { toast } from '@/store/toast.store'

export function ExportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const config = useConfig()
  const [format, setFormat] = useState<'ts' | 'json'>('ts')
  const [copied, setCopied] = useState(false)
  const code = format === 'ts' ? renderConfigFile(config) : JSON.stringify(config, null, 2)
  const hasEmbeddedImages = [
    config.brand.logo,
    config.brand.logoDark,
    config.brand.logoIcon,
    config.brand.favicon,
    config.login.backgroundImage,
  ].some((v) => v?.startsWith('data:'))

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain' }))
    Object.assign(document.createElement('a'), { href: url, download: format === 'ts' ? 'app.config.ts' : 'app-config.json' }).click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Export configuration"
      description={
        <>
          Replace <code className="rounded bg-muted px-1 py-0.5 text-xs">src/config/app.config.ts</code> with the TypeScript version, or
          keep the JSON to import into another project.
        </>
      }
      footer={
        <>
          <Button variant="outline" onClick={download}>
            <Download />
            Download
          </Button>
          <Button onClick={copy}>
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </>
      }
    >
      <SegmentedControl
        size="sm"
        aria-label="Format"
        value={format}
        onChange={setFormat}
        options={[
          { value: 'ts', label: 'TypeScript' },
          { value: 'json', label: 'JSON' },
        ]}
        className="mb-3"
      />
      {hasEmbeddedImages && (
        <p className="mb-3 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
          Uploaded images are embedded as data URLs. Use “Save” in dev to store them as files in public/brand/, or replace them with paths.
        </p>
      )}
      <pre className="max-h-[50vh] scrollbar-thin overflow-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
        {code.replace(/data:[^'"]{80,}/g, (m) => `${m.slice(0, 60)}…`)}
      </pre>
    </Modal>
  )
}

export function ImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Import configuration" description="Paste a configuration exported as JSON.">
      <ImportForm onDone={onClose} />
    </Modal>
  )
}

function ImportForm({ onDone }: { onDone: () => void }) {
  const replace = useConfigStore((s) => s.replace)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const apply = () => {
    try {
      const parsed = JSON.parse(text)
      if (typeof parsed !== 'object' || !parsed?.colors || !parsed?.brand) throw new Error('This does not look like an app configuration')
      replace(parsed)
      toast.success('Configuration imported', 'Review it, then save.')
      onDone()
    } catch (err) {
      setError(err instanceof SyntaxError ? 'Invalid JSON' : (err as Error).message)
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="font-mono text-xs"
        placeholder='{ "brand": { … }, "colors": { … } }'
        aria-label="Configuration JSON"
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button onClick={apply} disabled={!text.trim()}>
          Import
        </Button>
      </div>
    </div>
  )
}
