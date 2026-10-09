import { useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { FileDown, FileUp, Info, Layout, LogIn, Palette, Save, Sparkles, ToggleRight, Type, Undo2, Image } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { Tabs } from '@/components/ui/Tabs'
import { configService, JUST_SAVED_KEY } from '@/services/config.service'
import { canSaveToFile, useConfigStore } from '@/store/config.store'
import { toast } from '@/store/toast.store'
import { ExportModal, ImportModal } from './ExportModal'
import { PreviewPanel } from './PreviewPanel'
import { BrandSection, ColorsSection, FeaturesSection, LayoutSection, LoginSection, PresetsSection, TypographySection } from './Sections'

const tabs = [
  { value: 'presets', label: 'Presets', icon: <Sparkles /> },
  { value: 'brand', label: 'Brand', icon: <Image /> },
  { value: 'colors', label: 'Colors', icon: <Palette /> },
  { value: 'typography', label: 'Typography', icon: <Type /> },
  { value: 'layout', label: 'Layout', icon: <Layout /> },
  { value: 'login', label: 'Login page', icon: <LogIn /> },
  { value: 'features', label: 'Features & locale', icon: <ToggleRight /> },
] as const

type Tab = (typeof tabs)[number]['value']

const sections: Record<Tab, () => ReactNode> = {
  presets: PresetsSection,
  brand: BrandSection,
  colors: ColorsSection,
  typography: TypographySection,
  layout: LayoutSection,
  login: LoginSection,
  features: FeaturesSection,
}

export function CustomizationPage() {
  const config = useConfigStore((s) => s.config)
  const saved = useConfigStore((s) => s.saved)
  const discard = useConfigStore((s) => s.discard)
  const dirty = config !== saved && JSON.stringify(config) !== JSON.stringify(saved)

  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab: Tab = tabs.some((t) => t.value === requested) ? (requested as Tab) : 'presets'
  const Section = sections[tab]

  const [exportOpen, setExportOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Confirm a successful save after the dev server reloads the page.
  useEffect(() => {
    if (sessionStorage.getItem(JUST_SAVED_KEY)) {
      sessionStorage.removeItem(JUST_SAVED_KEY)
      toast.success('Saved to app.config.ts', 'Your configuration is now the project default.')
    }
  }, [])

  // Warn before leaving the page with unsaved edits.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const save = async () => {
    setSaving(true)
    try {
      await configService.saveToFile(config)
      // The dev server reloads the page once the file is written.
    } catch (err) {
      toast.error('Could not save', (err as Error).message)
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Customization"
        description={
          canSaveToFile
            ? 'Changes preview live across the app. Save writes them to src/config/app.config.ts.'
            : 'Changes preview live in this browser only. Export the configuration to apply it for everyone.'
        }
        actions={
          <>
            {dirty && (
              <Badge variant="warning" dot className="mr-1">
                Unsaved changes
              </Badge>
            )}
            <Button variant="ghost" onClick={() => setDiscardOpen(true)} disabled={!dirty}>
              <Undo2 />
              Discard
            </Button>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <FileUp />
              Import
            </Button>
            <Button variant={canSaveToFile ? 'outline' : 'primary'} onClick={() => setExportOpen(true)}>
              <FileDown />
              Export
            </Button>
            {canSaveToFile && (
              <Button onClick={save} loading={saving} disabled={!dirty}>
                <Save />
                Save
              </Button>
            )}
          </>
        }
      />

      {!canSaveToFile && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-info/30 bg-info/8 px-4 py-3 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-info" />
          <p>
            Saving to the config file is only available while running <code className="font-mono text-xs">npm run dev</code>. Here you can
            try options and export the result.
          </p>
        </div>
      )}

      <Tabs value={tab} onChange={(value) => setParams({ tab: value }, { replace: true })} tabs={[...tabs]} className="mb-6" />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <Section />
        </div>
        <div className="xl:sticky xl:top-24">
          <PreviewPanel />
        </div>
      </div>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <ConfirmDialog
        open={discardOpen}
        onClose={() => setDiscardOpen(false)}
        onConfirm={() => {
          discard()
          setDiscardOpen(false)
          toast.info('Changes discarded')
        }}
        title="Discard changes?"
        description="Everything goes back to what's in app.config.ts."
        confirmLabel="Discard"
        destructive
      />
    </>
  )
}
