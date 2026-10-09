import { Link } from 'react-router'
import { ExternalLink, Search } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { formatCurrency } from '@/lib/format'
import { useConfig } from '@/store/config.store'

/** Live sample of common components rendered with the current configuration. */
export function PreviewPanel() {
  const { locale } = useConfig()
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="text-sm font-semibold">Live preview</p>
        <Link
          to="/login-preview"
          target="_blank"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Login page <ExternalLink className="size-3" />
        </Link>
      </div>
      <div className="space-y-5 bg-background p-5">
        <Logo showTagline />
        <div>
          <h3 className="text-lg">Heading text</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Body copy uses your selected font. <span className="font-medium text-primary">Links</span> use the primary color.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="danger">
            Delete
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success" dot>
            Active
          </Badge>
          <Badge variant="warning" dot>
            Pending
          </Badge>
          <Badge variant="danger" dot>
            Failed
          </Badge>
          <Badge variant="info" dot>
            Info
          </Badge>
        </div>
        <Input icon={<Search />} placeholder="Search…" aria-label="Preview input" />
        <div className="flex items-center justify-between card p-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox defaultChecked />
            Checkbox
          </label>
          <Switch checked aria-label="Preview switch" onChange={() => {}} />
        </div>
        <div className="card p-4">
          <p className="text-xs text-muted-foreground">Monthly revenue</p>
          <p className="mt-1 text-xl font-semibold">{formatCurrency(48290, locale)}</p>
          <div className="mt-3 flex h-12 items-end gap-1">
            {[40, 55, 48, 62, 58, 75, 70, 88].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-[4px] bg-chart" style={{ height: `${h}%`, opacity: i === 7 ? 1 : 0.35 }} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
