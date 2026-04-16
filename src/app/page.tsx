import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Shortcuts from '@/components/Shortcuts'

const OUTPUT_DIR = '/root/daily-news/output'
const SOURCES_JSON = '/root/daily-news/data/all_sources.json'
const METHODS_DIR = '/root/daily-news/methods'

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch { return fallback }
}

function getReportFiles() {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) return []
    return fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.endsWith('.md') && !f.includes('-v2'))
      .map(f => ({
        date: f.replace('.md', ''),
        path: path.join(OUTPUT_DIR, f),
        size: fs.statSync(path.join(OUTPUT_DIR, f)).size,
        content: fs.readFileSync(path.join(OUTPUT_DIR, f), 'utf-8') as string,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  } catch { return [] }
}

export default function DashboardPage() {
  const reports = getReportFiles()
  const latestReport = reports[0]
  const sourcesData = readJson<Record<string, any[]>>(SOURCES_JSON, {})
  const sourceCount = Object.keys(sourcesData).length
  const totalItems = Object.values(sourcesData).reduce((s: number, a: any[]) => s + a.length, 0)

  let yamlSourceCount = 0
  try {
    if (fs.existsSync(METHODS_DIR)) {
      yamlSourceCount = fs.readdirSync(METHODS_DIR).filter(f => f.endsWith('.yaml')).length
    }
  } catch {}

  const latestContent = latestReport?.content?.slice(0, 2500) || ''

  const topSources = Object.entries(sourcesData)
    .map(([name, arr]) => ({ name, count: (arr as any[]).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return (
    <main className="page">
      <div className="container">

        <div className="page-header animate-fade-up">
          <h1 className="page-title">
            <span className="page-title-icon">🏠</span>
            总览
          </h1>
          <p className="page-subtitle">
            <span className="live-dot" style={{ marginRight: 8 }}></span>
            数据更新于 {new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="stats-grid">

          <div className="stat-card pink animate-fade-up animate-delay-1">
            <div className="stat-label">今日日报</div>
            <div className="stat-value">{latestReport?.date || '—'}</div>
            <div className="stat-sub">{latestReport ? `${Math.round(latestReport.size / 1024)} KB` : '今日尚未生成'}</div>
            <div className="stat-icon">📝</div>
          </div>

          <div className="stat-card green animate-fade-up animate-delay-2">
            <div className="stat-label">活跃信源</div>
            <div className="stat-value">{sourceCount}</div>
            <div className="stat-sub">共 {yamlSourceCount} 个配置 · {totalItems.toLocaleString()} 条内容</div>
            <div className="stat-icon">🔌</div>
          </div>

          <div className="stat-card lav animate-fade-up animate-delay-3">
            <div className="stat-label">日报历史</div>
            <div className="stat-value">{reports.length}</div>
            <div className="stat-sub">份已生成日报</div>
            <div className="stat-icon">📚</div>
          </div>

          <div className="stat-card blue animate-fade-up animate-delay-4">
            <div className="stat-label">本周内容</div>
            <div className="stat-value">{totalItems.toLocaleString()}</div>
            <div className="stat-sub">条数据已入库</div>
            <div className="stat-icon">📦</div>
          </div>

        </div>

        <div className="grid-2">

          {/* 信源分布 */}
          <div className="card animate-fade-up animate-delay-2">
            <div className="card-header">
              <div className="card-title">📡 信源内容分布</div>
              <Link href="/sources" className="btn btn-outline" style={{ padding: '5px 14px', fontSize: '0.78rem' }}>
                查看全部 →
              </Link>
            </div>
            <div style={{ padding: '12px 16px' }}>
              {topSources.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">暂无数据，请先运行采集脚本</div>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>信源</th>
                        <th style={{ width: 80, textAlign: 'right' }}>条数</th>
                        <th style={{ width: 100 }}>占比</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSources.map(src => (
                        <tr key={src.name}>
                          <td><span style={{ fontSize: '0.85rem' }}>{src.name}</span></td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>{src.count}</td>
                          <td>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${Math.round((src.count / (totalItems || 1)) * 100)}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 最新日报 */}
          <div className="card animate-fade-up animate-delay-3">
            <div className="card-header">
              <div className="card-title">
                📝 最新日报
                {latestReport && <span className="badge badge-pink" style={{ marginLeft: 6 }}>{latestReport.date}</span>}
              </div>
              <Link href="/reports" className="btn btn-outline" style={{ padding: '5px 14px', fontSize: '0.78rem' }}>
                历史日报 →
              </Link>
            </div>
            <div className="card-body" style={{ maxHeight: 340, overflowY: 'auto' }}>
              {latestContent ? (
                <div
                  className="report-content"
                  dangerouslySetInnerHTML={{
                    __html: latestContent
                      .replace(/^---[\s\S]*?---\n/, '')
                      .replace(/^#\s+(.+)$/gm, '<h2>$&</h2>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n{2,}/g, '</p><p>')
                      .replace(/^/, '<p>')
                      .replace(/$/, '</p>')
                  }}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">今日日报尚未生成</div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 快捷入口 */}
        <div className="card animate-fade-up animate-delay-4" style={{ marginTop: 24 }}>
          <div className="card-header">
            <div className="card-title">⚡ 快捷入口</div>
          </div>
          <div className="card-body" style={{ padding: '20px 24px' }}>
            <Shortcuts />
          </div>
        </div>

      </div>
    </main>
  )
}
