import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchReport, formatDate, getDatesRange } from '@/lib/daily/fetcher'
import { getReport, saveReport, getAvailableDates } from '@/lib/daily/db'
import BuilderPulseRenderer from '@/lib/daily/renderer'
import DateTabs from '@/components/DateTabs'

export const metadata: Metadata = {
  title: '每日情报 - BuilderPulse',
  description: '每日AI和创业生态情报日报',
}

interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DailyPage({ searchParams }: PageProps) {
  const params = await searchParams
  const today = formatDate(new Date())

  // Determine which date to show
  let targetDate = params.date || today

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    targetDate = today
  }

  // Try DB first
  let report = getReport(targetDate)
  let source = 'db' as 'db' | 'github'
  let fetchedDate = targetDate
  let isFallback = false

  if (!report) {
    // Fetch from GitHub
    const { content, found } = await fetchReport(targetDate)

    if (found && content) {
      saveReport(targetDate, content)
      report = { date: targetDate, content, fetched_at: new Date().toISOString() }
      source = 'github'
    } else if (targetDate === today) {
      // Today not found — try yesterday, then day before, up to 6 days back
      const dates = getDatesRange(7).filter(d => d !== today)
      for (const d of dates) {
        const { content: c, found: f } = await fetchReport(d)
        if (f && c) {
          saveReport(d, c)
          report = { date: d, content: c, fetched_at: new Date().toISOString() }
          fetchedDate = d
          source = 'github'
          isFallback = true
          break
        }
      }
    }
  }

  // Get available dates for tabs
  const availableDates = getAvailableDates(7)

  if (!report) {
    // No reports at all
    return (
      <main className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">
              <span className="page-title-icon">📰</span>
              每日情报
            </h1>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              暂无报告数据
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              BuilderPulse 每日报告通常在午夜后更新，请稍后再来
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="page-title-icon">📰</span>
            每日情报
          </h1>
          {isFallback && (
            <p className="page-subtitle" style={{ color: 'var(--amber)' }}>
              ⚠️ 今天的报告尚未发布，显示的是 {fetchedDate} 的最新报告
            </p>
          )}
        </div>

        <DateTabs availableDates={availableDates} currentDate={fetchedDate} />

        <div className="daily-report-wrapper">
          {isFallback && fetchedDate !== targetDate && (
            <div className="badge badge-warn" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              ⚠️ 自动降级显示
            </div>
          )}
          <BuilderPulseRenderer content={report.content} />
        </div>

        <div className="daily-footer">
          <span>📡 数据来源：BuilderPulse</span>
          <span>·</span>
          <span>🕐 获取时间：{new Date(report.fetched_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</span>
          <span>·</span>
          <span>📍 {source === 'github' ? '实时抓取' : '数据库'}</span>
        </div>
      </div>
    </main>
  )
}
