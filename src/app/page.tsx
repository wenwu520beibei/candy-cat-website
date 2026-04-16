import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="page">
      <div className="container">
        <div className="page-header animate-fade-up">
          <h1 className="page-title">
            <span className="page-title-icon">🍬</span>
            糖果猫猫
          </h1>
          <p className="page-subtitle">
            智能情报与内容管理中枢
          </p>
        </div>

        <div className="grid-2" style={{ marginTop: 8 }}>
          <Link href="/dashboard" className="card nav-card pink animate-fade-up animate-delay-1" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="card-body" style={{ padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
              <div className="card-title" style={{ fontSize: '1.3rem', marginBottom: 8 }}>AI 日报</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>多源情报聚合 · 每日更新</div>
            </div>
          </Link>

          <Link href="/wechat" className="card nav-card green animate-fade-up animate-delay-2" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="card-body" style={{ padding: '36px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📮</div>
              <div className="card-title" style={{ fontSize: '1.3rem', marginBottom: 8 }}>公众号</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>内容管理 · 发布记录</div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
