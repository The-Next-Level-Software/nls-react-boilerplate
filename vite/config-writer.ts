import { createHash } from 'node:crypto'
import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises'
import type { IncomingMessage } from 'node:http'
import path from 'node:path'
import type { Plugin } from 'vite'
import { renderConfigFile } from '../src/config/render-config.ts'
import type { AppConfig } from '../src/theme/types.ts'

export const CONFIG_ENDPOINT = '/__app-config'

const imageFields = [
  ['brand', 'logo'],
  ['brand', 'logoDark'],
  ['brand', 'logoIcon'],
  ['brand', 'favicon'],
  ['login', 'backgroundImage'],
] as const

/** Files this plugin generates look like `logo-dark-1a2b3c4d.png`; anything else in public/brand is left alone. */
const generatedFile = /^[a-z-]+-[0-9a-f]{8}\.[a-z0-9]+$/

function readBody(req: IncomingMessage, limit = 25 * 1024 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > limit) reject(new Error('Request too large'))
      else chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function validate(config: AppConfig) {
  const sections = ['brand', 'colors', 'typography', 'layout', 'login', 'features', 'locale', 'demoCredentials'] as const
  for (const key of sections) {
    if (!config || typeof config[key] !== 'object' || config[key] === null) throw new Error(`Missing "${key}" section`)
  }
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(config.colors.primary)) throw new Error('colors.primary must be a hex color')
  if (!config.brand.name?.trim()) throw new Error('brand.name is required')
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/**
 * Dev-only endpoint used by the Customization page's "Save" button. Rewrites
 * src/config/app.config.ts and stores uploaded images in public/brand/.
 */
export function configWriter(): Plugin {
  let root = process.cwd()

  return {
    name: 'app-config-writer',
    apply: 'serve',
    configResolved(resolved) {
      root = resolved.root
    },
    configureServer(server) {
      server.middlewares.use(CONFIG_ENDPOINT, async (req, res) => {
        const reply = (status: number, body: unknown) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return reply(405, { message: 'Method not allowed' })

        try {
          const config = JSON.parse(await readBody(req)) as AppConfig
          validate(config)

          const brandDir = path.join(root, 'public', 'brand')
          const referenced = new Set<string>()
          for (const [section, key] of imageFields) {
            const target = config[section] as unknown as Record<string, string | null>
            const value = target[key]
            if (typeof value === 'string' && value.startsWith('data:')) {
              const match = /^data:image\/([a-z0-9.+-]+);base64,(.+)$/i.exec(value)
              if (!match) throw new Error(`${section}.${key}: unsupported image data`)
              const ext =
                { 'svg+xml': 'svg', jpeg: 'jpg', 'x-icon': 'ico', 'vnd.microsoft.icon': 'ico' }[match[1].toLowerCase()] ??
                match[1].toLowerCase()
              const data = Buffer.from(match[2], 'base64')
              const file = `${kebab(key)}-${createHash('sha1').update(data).digest('hex').slice(0, 8)}.${ext.replace(/[^a-z0-9]/g, '')}`
              await mkdir(brandDir, { recursive: true })
              await writeFile(path.join(brandDir, file), data)
              target[key] = `/brand/${file}`
            }
            const final = target[key]
            if (typeof final === 'string' && final.startsWith('/brand/')) referenced.add(final.slice('/brand/'.length))
          }

          // Clean up images from earlier saves that are no longer referenced.
          const existing = await readdir(brandDir).catch(() => [] as string[])
          await Promise.all(existing.filter((f) => generatedFile.test(f) && !referenced.has(f)).map((f) => unlink(path.join(brandDir, f))))

          await writeFile(path.join(root, 'src', 'config', 'app.config.ts'), renderConfigFile(config))
          reply(200, { ok: true })
          server.ws.send({ type: 'full-reload', path: '*' })
        } catch (err) {
          reply(400, { message: err instanceof Error ? err.message : 'Could not save config' })
        }
      })
    },
  }
}
