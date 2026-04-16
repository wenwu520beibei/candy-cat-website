'use client'

import { useState } from 'react'
import type { SourceInfo } from './lib'

const CATEGORY_COLORS: Record<string, string> = {
  '社区': 'lav',
  '学术': 'blue',
  '科技媒体': 'pink',
  '开发者': 'amber',
  '产品发现': 'green',
  '创业投资': 'pink',
  '中文科技': 'lav',
  'AI前沿': 'lav',
  '趋势': 'amber',
  '综合': 'pink',
  '其他': 'pink',
}

export default function SourcesClient({ initialSources }: { initialSources: SourceInfo[] }) {
  const [filter, setFilter] = useState<string>('all')

  const categories = [...new Set(initialSources.map(s => s.category))]
  const online = initialSources.filter(s => s.status === 'online').length
  const offline = initialSources.filter(s => s.status === 'offline').length
  const warn = initialSources.filter(s => s.status === 'warn').length

  const filtered = filter === 'all'
    ? initialSources
    : initialSources.filter(s => s.category === filter)

  return (
    <>
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card green animate-fade-up animate-delay-1">
          <div className="stat-label">在线</div>
          <div className="stat-value">{online}</div>
          <div className="stat-sub">正常采集数据</div>
        </div>
        <div className="stat-card pink animate-fade-up animate-delay-2">
          <div className="stat-label">警告</div>
          <div className="stat-value">{warn}</div>
          <div className="stat-sub">返回0条数据</div>
        </div>
        <div className="stat-card animate-fade-up animate-delay-3">
          <div className="stat-label">离线</div>
          <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{offline}</div>
          <div className="stat-sub">无法访问</div>
        </div>
        <div className="stat-card blue animate-fade-up animate-delay-4">
          <div className="stat-label">总条数</div>
          <div className="stat-value">
            {initialSources.reduce((sum, s) => sum + s.itemCount, 0).toLocaleString()}
          </div>
          <div className="stat-sub">本周已采集</div>
        </div>
      </div>

      <div className="filter-tabs animate-fade-up animate-delay-2">
        <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          全部 {initialSources.length}
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-tab ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat} {initialSources.filter(s => s.category === cat).length}
          </button>
        ))}
      </div>

      <div className="card animate-fade-up animate-delay-3">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>状态</th>
                <th>信源名称</th>
                <th>分类</th>
                <th>类型</th>
                <th style={{ textAlign: 'right' }}>条数</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(source => (
                <tr key={source.name}>
                  <td>
                    <span className={`badge badge-${source.status === 'online' ? 'online' : source.status === 'warn' ? 'warn' : 'offline'}`}>
                      {source.status === 'online' ? '●' : source.status === 'warn' ? '⚠' : '✕'}{' '}
                      {source.status === 'online' ? '在线' : source.status === 'warn' ? '警告' : '离线'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{source.name}</td>
                  <td>
                    <span className={`badge badge-${CATEGORY_COLORS[source.category] || 'pink'}`}>{source.category}</span>
                  </td>
                  <td style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{source.type}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: source.itemCount > 0 ? 'var(--green)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {source.itemCount > 0 ? source.itemCount : '—'}
                  </td>
                  <td>
                    <a
                      href={source.url.startsWith('http') ? source.url : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.72rem', color: 'var(--pink-400)',
                        maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block',
                      }}
                    >
                      {source.url.length > 45 ? source.url.slice(0, 45) + '…' : source.url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
