'use client'

import Link from 'next/link'

const shortcuts = [
  { href: '/sources', emoji: '🔌', label: '信源管理', desc: '查看45+信源状态' },
  { href: '/reports', emoji: '📝', label: 'AI日报', desc: 'BuilderPulse日报历史' },
  { href: '/wechat', emoji: '📮', label: '公众号', desc: '推送记录管理' },
  { href: '/settings', emoji: '⚙️', label: '系统配置', desc: 'Cron任务、Skills' },
]

export default function Shortcuts() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {shortcuts.map(item => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--pink-50)',
            border: '1.5px solid var(--border)',
            flex: '1 1 180px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>{item.emoji}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
