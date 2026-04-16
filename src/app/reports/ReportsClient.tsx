'use client'

import { useState } from 'react'

interface Report {
  date: string
  size: number
  content: string
}

export default function ReportsClient({ initialReports }: { initialReports: Report[] }) {

  const [reports] = useState(initialReports)
  const [selected, setSelected] = useState(initialReports[0]?.date || '')
  const [expanded, setExpanded] = useState(false)

  const current = reports.find((r: Report) => r.date === selected)

  function formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  function renderMarkdown(text: string): string {
    return text
      .replace(/^---[\s\S]*?---\n/, '')
      .replace(/^# (.+)$/gm, '<h2 style="font-size:1.05rem;font-weight:700;color:var(--pink-500);margin:20px 0 8px;">$1</h2>')
      .replace(/^## (.+)$/gm, '<h3 style="font-size:0.95rem;font-weight:700;color:var(--lav-400);margin:16px 0 6px;">$1</h3>')
      .replace(/^### (.+)$/gm, '<h4 style="font-size:0.9rem;font-weight:700;color:var(--text-primary);margin:12px 0 4px;">$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code style="background:var(--pink-100);padding:1px 5px;border-radius:4px;font-size:0.82em;">$1</code>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--pink-500);">🔗 $1</a>')
      .replace(/^-\s+(.+)$/gm, '<li style="margin:4px 0 4px 16px;">• $1</li>')
      .replace(/\n{2,}/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
  }

  if (reports.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title"><span className="page-title-icon">📝</span> AI 日报</h1>
            <p className="page-subtitle">BuilderPulse 30问框架日报</p>
          </div>
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">暂无日报，请先运行采集脚本生成</div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="container">

        <div className="page-header animate-fade-up">
          <h1 className="page-title">
            <span className="page-title-icon">📝</span>
            AI 日报
          </h1>
          <p className="page-subtitle">
            BuilderPulse 30问框架 · 共 {reports.length} 份历史日报
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

          {/* 左侧：日报列表 */}
          <div className="card animate-fade-up animate-delay-1" style={{ position: 'sticky', top: 80 }}>
            <div className="card-header">
              <div className="card-title">📅 日报列表</div>
            </div>
            <div>
              {reports.map((report: Report) => (
                <button
                  key={report.date}
                  onClick={() => { setSelected(report.date); setExpanded(false) }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    background: selected === report.date ? 'var(--pink-50)' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    if (selected !== report.date) (e.currentTarget as HTMLElement).style.background = 'var(--pink-50)'
                  }}
                  onMouseLeave={e => {
                    if (selected !== report.date) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {report.date}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {formatDate(report.date)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span className={selected === report.date ? 'badge badge-pink' : 'badge badge-info'} style={{ fontSize: '0.68rem' }}>
                      {Math.round(report.size / 1024)} KB
                    </span>
                    {selected === report.date && (
                      <span style={{ color: 'var(--pink-400)', fontSize: '0.75rem' }}>←</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：日报内容 */}
          <div className="card animate-fade-up animate-delay-2">
            <div className="card-header">
              <div className="card-title">
                <span>📄</span>
                {current ? formatDate(current.date) : '—'}
              </div>
              {current && (
                <span className="badge badge-pink">
                  {Math.round(current.content.length / 1024)} KB
                </span>
              )}
            </div>
            <div className="card-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              {current ? (
                <div
                  className="report-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(current.content) }}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-text">内容加载失败</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
