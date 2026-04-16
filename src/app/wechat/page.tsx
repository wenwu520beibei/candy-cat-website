'use client'

import { useState } from 'react'

interface Article {
  id: string
  title: string
  date: string
  platform: string
  status: 'sent' | 'pending' | 'failed'
  views?: number
  chars: number
}

const MOCK_ARTICLES: Article[] = [
  { id: '1', title: '【AI日报】独立开发者如何用AI赚到第一个100万', date: '2026-04-16', platform: '公众号', status: 'sent', views: 2847, chars: 3200 },
  { id: '2', title: '【深度】2026年AI创业的5个蓝海机会', date: '2026-04-15', platform: '公众号', status: 'sent', views: 4213, chars: 4100 },
  { id: '3', title: '【工具推荐】这10个AI工具让独立开发者效率翻倍', date: '2026-04-14', platform: '公众号', status: 'sent', views: 3182, chars: 2800 },
  { id: '4', title: '【周报】AI圈本周大事记（4月第2周）', date: '2026-04-13', platform: '公众号', status: 'sent', views: 1920, chars: 3600 },
  { id: '5', title: '【案例】他从0到月入5万，用了3个月', date: '2026-04-11', platform: '公众号', status: 'sent', views: 5104, chars: 2900 },
  { id: '6', title: '【AI日报】本周最值得关注的5个AI开源项目', date: '2026-04-10', platform: '公众号', status: 'sent', views: 2603, chars: 3100 },
]

const PLATFORM_COLORS: Record<string, string> = {
  '公众号': 'pink',
  '小红书': 'lav',
  '微博': 'amber',
}

export default function WechatPage() {
  const [filter, setFilter] = useState<'all' | 'sent' | 'pending' | 'failed'>('all')

  const articles = MOCK_ARTICLES.filter(a => filter === 'all' || a.status === filter)
  const totalViews = MOCK_ARTICLES.reduce((sum, a) => sum + (a.views || 0), 0)
  const avgViews = Math.round(totalViews / MOCK_ARTICLES.length)

  return (
    <main className="page">
      <div className="container">

        <div className="page-header animate-fade-up">
          <h1 className="page-title">
            <span className="page-title-icon">📮</span>
            公众号推送记录
          </h1>
          <p className="page-subtitle">
            已推送 {MOCK_ARTICLES.filter(a => a.status === 'sent').length} 篇文章 · 共 {totalViews.toLocaleString()} 阅读
          </p>
        </div>

        {/* 统计 */}
        <div className="stats-grid" style={{ marginBottom: 28 }}>
          <div className="stat-card pink animate-fade-up animate-delay-1">
            <div className="stat-label">已推送</div>
            <div className="stat-value">{MOCK_ARTICLES.filter(a => a.status === 'sent').length}</div>
            <div className="stat-sub">篇文章</div>
          </div>
          <div className="stat-card green animate-fade-up animate-delay-2">
            <div className="stat-label">总阅读</div>
            <div className="stat-value">{totalViews.toLocaleString()}</div>
            <div className="stat-sub">累计阅读量</div>
          </div>
          <div className="stat-card lav animate-fade-up animate-delay-3">
            <div className="stat-label">平均阅读</div>
            <div className="stat-value">{avgViews.toLocaleString()}</div>
            <div className="stat-sub">篇均阅读</div>
          </div>
          <div className="stat-card blue animate-fade-up animate-delay-4">
            <div className="stat-label">最高阅读</div>
            <div className="stat-value">{Math.max(...MOCK_ARTICLES.map(a => a.views || 0)).toLocaleString()}</div>
            <div className="stat-sub">单篇最高</div>
          </div>
        </div>

        {/* 筛选 */}
        <div className="filter-tabs animate-fade-up animate-delay-2">
          {(['all', 'sent', 'pending', 'failed'] as const).map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '全部' : f === 'sent' ? '已推送' : f === 'pending' ? '待推送' : '推送失败'}
              {' '}{f === 'all' ? MOCK_ARTICLES.length : MOCK_ARTICLES.filter(a => a.status === f).length}
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        <div className="card animate-fade-up animate-delay-3">
          {articles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">暂无文章</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>状态</th>
                  <th>标题</th>
                  <th>平台</th>
                  <th>日期</th>
                  <th style={{ textAlign: 'right' }}>字数</th>
                  <th style={{ textAlign: 'right' }}>阅读</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id}>
                    <td>
                      <span className={`badge badge-${article.status === 'sent' ? 'online' : article.status === 'pending' ? 'warn' : 'offline'}`}>
                        {article.status === 'sent' ? '✓ 已推送' : article.status === 'pending' ? '◷ 待推送' : '✕ 失败'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {article.title}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${PLATFORM_COLORS[article.platform] || 'pink'}`}>
                        {article.platform}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{article.date}</td>
                    <td style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                      {article.chars.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--green)', fontSize: '0.88rem' }}>
                      {article.views ? article.views.toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </main>
  )
}
