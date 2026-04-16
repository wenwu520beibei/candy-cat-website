import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const METHODS_DIR = '/root/daily-news/methods'
const SOURCES_JSON = '/root/daily-news/data/all_sources.json'

export type SourceStatus = 'online' | 'offline' | 'warn'

export interface SourceInfo {
  name: string
  type: string
  url: string
  status: SourceStatus
  itemCount: number
  category: string
}

function guessCategory(filename: string): string {
  const n = filename.toLowerCase()
  if (n.includes('hacker') || n.includes('hn') || n.includes('ycombinator')) return '社区'
  if (n.includes('arxiv')) return '学术'
  if (n.includes('techcrunch') || n.includes('verge') || n.includes('wired') || n.includes('ars')) return '科技媒体'
  if (n.includes('github') || n.includes('devto') || n.includes('stackoverflow')) return '开发者'
  if (n.includes('product') || n.includes('PH')) return '产品发现'
  if (n.includes('vc') || n.includes('startup') || n.includes('techstars')) return '创业投资'
  if (n.includes('36kr') || n.includes('ithome') || n.includes('leiphone') || n.includes('sspai')) return '中文科技'
  if (n.includes('openai') || n.includes('deepmind') || n.includes('ai-news')) return 'AI前沿'
  if (n.includes('google') || n.includes('trends')) return '趋势'
  if (n.includes('engadget') || n.includes('slashdot') || n.includes('cnet')) return '综合'
  return '其他'
}

export function getSources(): SourceInfo[] {
  const sources: SourceInfo[] = []

  let activeNames = new Set<string>()
  try {
    const raw = JSON.parse(fs.readFileSync(SOURCES_JSON, 'utf-8'))
    Object.keys(raw).forEach(k => activeNames.add(k))
  } catch {}

  let files: string[] = []
  try {
    files = fs.readdirSync(METHODS_DIR).filter(f => f.endsWith('.yaml'))
  } catch {}

  for (const file of files) {
    const name = file.replace('.yaml', '')
    const isActive = activeNames.has(name) || activeNames.has(name.replace(/-/g, '_'))
    const category = guessCategory(name)
    let url = '—'
    let srcType = 'rss'

    try {
      const cfg = yaml.load(fs.readFileSync(path.join(METHODS_DIR, file), 'utf-8')) as Record<string, unknown>
      url = String((cfg?.source_url as string) || (cfg?.url as string) || '—')
      srcType = String((cfg?.type as string) || 'rss')
    } catch {}

    let status: SourceStatus = 'offline'
    let itemCount = 0
    if (isActive) {
      try {
        const raw = JSON.parse(fs.readFileSync(SOURCES_JSON, 'utf-8'))
        const key = Object.keys(raw).find(k =>
          k.replace(/_/g, '-') === name || k === name.replace(/-/g, '_')
        )
        if (key) itemCount = (raw[key] as unknown[]).length
        status = itemCount > 0 ? 'online' : 'warn'
      } catch {}
    }

    sources.push({ name, type: srcType, url, status, itemCount, category })
  }

  return sources.sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1
    if (b.status === 'online' && a.status !== 'online') return 1
    return b.itemCount - a.itemCount
  })
}
