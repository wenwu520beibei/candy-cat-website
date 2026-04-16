import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="page">
      <div className="container">
        <div className="page-header animate-fade-up">
          <h1 className="page-title">
            <span className="page-title-icon">🐱</span>
            糖果猫猫
          </h1>
          <p className="page-subtitle">
            动漫风格的个人主页 & 工具导航平台
          </p>
        </div>

        <div className="stats-grid">
          <Link href="/resume" className="stat-card pink animate-fade-up animate-delay-1" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="stat-label">📄 个人简历</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: 8 }}>蒋文武</div>
            <div className="stat-sub">智能化部算法团队负责人</div>
            <div className="stat-icon">👤</div>
          </Link>

          <Link href="/dashboard" className="stat-card green animate-fade-up animate-delay-2" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="stat-label">📊 日报看板</div>
            <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: 8 }}>AI 日报</div>
            <div className="stat-sub">多源情报聚合</div>
            <div className="stat-icon">📰</div>
          </Link>
        </div>

        <div className="grid-2" style={{ marginTop: 24 }}>
          <div className="card animate-fade-up animate-delay-3">
            <div className="card-header">
              <div className="card-title">🎯 项目导航</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link href="/resume" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  📄 个人简历 — 查看简历详情
                </Link>
                <Link href="/dashboard" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  📊 日报看板 — AI 领域每日资讯
                </Link>
              </div>
            </div>
          </div>

          <div className="card animate-fade-up animate-delay-4">
            <div className="card-header">
              <div className="card-title">🌐 外部链接</div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="https://github.com/wenwu520beibei" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  🐙 GitHub — @wenwu520beibei
                </a>
                <a href="https://candy-ot4kk7kue-jiangwenwus-projects-0329490c.vercel.app" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  🚀 Vercel 部署 — 最新版本
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
