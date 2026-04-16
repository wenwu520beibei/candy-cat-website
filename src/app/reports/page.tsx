// reports/page.tsx — Server Component
import fs from 'fs'
import path from 'path'
import ReportsClient from './ReportsClient'

const OUTPUT_DIR = '/root/daily-news/output'

function getReports() {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) return []
    return fs.readdirSync(OUTPUT_DIR)
      .filter((f: string) => f.endsWith('.md') && !f.includes('-v2'))
      .map((f: string) => ({
        date: f.replace('.md', ''),
        size: fs.statSync(path.join(OUTPUT_DIR, f)).size,
        content: fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf-8') as string,
      }))
      .sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date))
  } catch {
    return []
  }
}

export default function ReportsPage() {
  const reports = getReports()
  return <ReportsClient initialReports={reports} />
}
