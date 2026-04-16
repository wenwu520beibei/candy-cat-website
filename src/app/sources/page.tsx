import { getSources } from './lib'
import SourcesClient from './SourcesClient'

export const dynamic = 'force-dynamic'

export default function SourcesPage() {
  const sources = getSources()

  return (
    <main className="page">
      <div className="container">
        <div className="page-header animate-fade-up">
          <h1 className="page-title">
            <span className="page-title-icon">🔌</span>
            信源状态
          </h1>
          <p className="page-subtitle">
            共 {sources.length} 个信源配置 · {sources.filter(s => s.status === 'online').length} 在线 · {sources.filter(s => s.status === 'warn').length} 警告 · {sources.filter(s => s.status === 'offline').length} 离线
          </p>
        </div>
        <SourcesClient initialSources={sources} />
      </div>
    </main>
  )
}
