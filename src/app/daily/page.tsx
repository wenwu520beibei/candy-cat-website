import { Metadata } from 'next'
import { fetchReport, formatDate, getDatesRange } from '@/lib/daily/fetcher'
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

  let report: { date: string; content: string; fetchedAt: string } | null = null
  let isFallback = false

  // Try today's date first
  const { content: todayContent, found: todayFound } = await fetchReport(targetDate)

  if (todayFound && todayContent) {
    report = { date: targetDate, content: todayContent, fetchedAt: new Date().toISOString() }
  } else {
    // Today not found — try yesterday, then day before, up to 6 days back
    const dates = getDatesRange(7).filter(d => d !== targetDate)
    for (const d of dates) {
      const { content: c, found: f } = await fetchReport(d)
      if (f && c) {
        report = { date: d, content: c, fetchedAt: new Date().toISOString() }
        isFallback = d !== today
        break
      }
    }
  }

  // Generate available dates for tabs (today + last 6 days)
  const tabDates = getDatesRange(7)

  if (!report) {
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
            <p className="page-subtitle" style={{ color: 'var(--amber)', fontSize: '0.85rem', paddingLeft: 0 }}>
              ⚠️ 今天的报告尚未发布，显示的是 {report.date} 的最新报告
            </p>
          )}
        </div>

        <DateTabs availableDates={tabDates} currentDate={report.date} />

        <div className="daily-report-wrapper">
          <BuilderPulseRenderer content={report.content} />
        </div>

        <div className="daily-footer">
          <span>📡 数据来源：BuilderPulse</span>
          <span>·</span>
          <span>🕐 获取时间：{new Date(report.fetchedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</span>
          <span>·</span>
          <span>📍 实时抓取</span>
        </div>
      </div>
    </main>
  )
}
