import Link from 'next/link'
import { Activity, TrendingUp, CheckCircle, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="page">
      <div className="container">

        {/* Hero Section */}
        <section style={{ padding: '48px 0 56px', textAlign: 'center' }}>
          <div className="animate-fade-up">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 9999,
              background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.18)',
              fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed',
              marginBottom: 24
            }}>
              <Activity size={14} style={{ color: '#8b5cf6' }} />
              智能情报 · 每日更新
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800,
              color: '#0f172a', lineHeight: 1.2, marginBottom: 16,
              letterSpacing: '-0.02em'
            }}>
              智能情报与内容管理中枢
            </h1>

            <p style={{
              fontSize: '1.1rem', color: '#475569', maxWidth: 520,
              margin: '0 auto 36px', lineHeight: 1.7
            }}>
              聚合多源情报，自动生成AI日报<br />
              掌控内容发布，洞悉行业动态
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/daily" className="btn btn-primary" style={{ padding: '11px 28px', fontSize: '0.95rem' }}>
                📊 进入日报
                <ChevronRight size={16} />
              </Link>
              <Link href="/wechat" className="btn btn-outline" style={{ padding: '11px 28px', fontSize: '0.95rem' }}>
                📮 公众号管理
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section style={{ paddingBottom: 64 }}>
          <div className="grid-2" style={{ gap: 24 }}>
            {/* AI 日报卡片 */}
            <Link href="/daily" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="card violet-card" style={{ padding: '40px 36px', borderRadius: 20 }}>
                <div className="card-icon">📊</div>
                <div className="card-title-accent">AI 日报</div>
                <div style={{ color: '#475569', fontSize: '0.9rem', marginBottom: 20 }}>
                  多源情报聚合 · 每日自动更新
                </div>
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'X/Twitter 热门话题',
                    'GitHub Trending',
                    'Hacker News',
                    'Product Hunt',
                    '行业融资动态',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#475569' }}>
                      <CheckCircle size={15} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>点击进入 →</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(139,92,246,0.12)', color: '#7c3aed', padding: '4px 12px', borderRadius: 9999 }}>
                    PRO
                  </span>
                </div>
              </div>
            </Link>

            {/* 公众号卡片 */}
            <Link href="/wechat" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="card cyan-card" style={{ padding: '40px 36px', borderRadius: 20 }}>
                <div className="card-icon">📮</div>
                <div className="card-title-accent">公众号</div>
                <div style={{ color: '#475569', fontSize: '0.9rem', marginBottom: 20 }}>
                  内容管理 · 发布记录
                </div>
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    '历史文章归档',
                    '阅读数据分析',
                    '内容发布管理',
                    '选题与草稿',
                    '效果追踪',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#475569' }}>
                      <CheckCircle size={15} style={{ color: '#0891b2', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(34,211,238,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>点击进入 →</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(34,211,238,0.12)', color: '#0891b2', padding: '4px 12px', borderRadius: 9999 }}>
                    BETA
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 快捷入口区 */}
        <section style={{ paddingBottom: 80 }}>
          <div style={{
            background: 'var(--card-bg)', border: '1.5px solid var(--border)',
            borderRadius: 20, padding: '28px 32px', boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              快捷入口
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { href: '/resume', icon: '📄', label: '个人简历' },
                { href: '/sources', icon: '🔌', label: '信源配置' },
                { href: '/reports', icon: '📝', label: '日报历史' },
                { href: '/settings', icon: '⚙️', label: '系统设置' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="quick-link"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border)', paddingTop: 32, paddingBottom: 48,
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>📊</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>智能情报中枢</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            © 2025 · 智能情报与内容管理中枢
          </p>
        </footer>
      </div>
    </main>
  )
}
