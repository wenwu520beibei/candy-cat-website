const BUILDERPULSE_RAW = 'https://raw.githubusercontent.com/BuilderPulse/BuilderPulse/main/zh/2026'

// In-memory cache for serverless (persists within a warm container)
const memoryCache = new Map<string, { content: string; fetchedAt: string }>()

export function getReportUrl(date: string): string {
  return `${BUILDERPULSE_RAW}/${date}.md`
}

export async function fetchReport(date: string): Promise<{ content: string; found: boolean }> {
  // Check memory cache first
  const cached = memoryCache.get(date)
  if (cached) {
    return { content: cached.content, found: true }
  }

  const url = getReportUrl(date)
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'text/markdown' },
      next: { revalidate: 3600 }, // cache for 1 hour in Next.js
    })
    if (res.status === 404) {
      return { content: '', found: false }
    }
    if (!res.ok) {
      return { content: '', found: false }
    }
    const content = await res.text()
    // Store in memory cache
    memoryCache.set(date, { content, fetchedAt: new Date().toISOString() })
    return { content, found: true }
  } catch {
    return { content: '', found: false }
  }
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDatesRange(days = 7): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(formatDate(d))
  }
  return dates
}
