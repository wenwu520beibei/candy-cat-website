import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '智能情报与内容中枢',
  description: 'AI日报 · 多源情报聚合 · 每日更新',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="brand-icon">📊</span>
          <span className="brand-text">智能中枢</span>
        </a>

        <nav className="navbar-nav">
          <a href="/daily" className="nav-link nav-icon-only" title="AI日报">📊</a>
          <a href="/wechat" className="nav-link nav-icon-only" title="公众号">📮</a>
          <div className="nav-dropdown">
            <span className="nav-link nav-icon-only">👤</span>
            <div className="dropdown-menu">
              <a href="/resume" className="dropdown-item">📄 个人简历</a>
              <a href="/sources" className="dropdown-item">🔌 信源配置</a>
              <a href="/reports" className="dropdown-item">📝 日报历史</a>
              <a href="/settings" className="dropdown-item">⚙️ 系统设置</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
