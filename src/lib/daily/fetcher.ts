const BUILDERPULSE_RAW = 'https://raw.githubusercontent.com/BuilderPulse/BuilderPulse/main/zh/2026'

export function getReportUrl(date: string): string {
  return `${BUILDERPULSE_RAW}/${date}.md`
}

export async function fetchReport(date: string): Promise<{ content: string; found: boolean }> {
  const url = getReportUrl(date)
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'text/markdown' },
      next: { revalidate: 0 },
    })
    if (res.status === 404) {
      return { content: '', found: false }
    }
    if (!res.ok) {
      return { content: '', found: false }
    }
    const content = await res.text()
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

export function getAdjacentDates(targetDate: string, allDates: string[]): {
  prev: string | null
  next: string | null
} {
  const idx = allDates.indexOf(targetDate)
  return {
    prev: idx < allDates.length - 1 ? allDates[idx + 1] : null,
    next: idx > 0 ? allDates[idx - 1] : null,
  }
}
