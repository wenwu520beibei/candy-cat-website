import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🍬 Hermes 管理台',
  description: '糖果猫猫的 Hermes 信息中枢',
  icons: { icon: '🐱' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        {children}
        <div className="cat-deco" aria-hidden="true">🐱</div>
      </body>
    </html>
  )
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="brand-icon">🍬</span>
          <span className="brand-text">Hermes 管理台</span>
        </a>

        <nav>
          <ul className="navbar-nav">
            <li><a href="/" className="nav-link">🏠 总览</a></li>
            <li><a href="/sources" className="nav-link">🔌 信源</a></li>
            <li><a href="/reports" className="nav-link">📝 日报</a></li>
            <li><a href="/wechat" className="nav-link">📮 公众号</a></li>
            <li><a href="/settings" className="nav-link">⚙️ 配置</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
