import fs from 'fs'
import path from 'path'

function getSkillsDirs() {
  const skillsDir = '/root/.hermes/skills'
  const cats: Array<{ name: string; count: number }> = []
  try {
    if (!fs.existsSync(skillsDir)) return []
    for (const cat of fs.readdirSync(skillsDir)) {
      const catPath = path.join(skillsDir, cat)
      if (!fs.statSync(catPath).isDirectory()) continue
      const skills = fs.readdirSync(catPath).filter(s =>
        fs.statSync(path.join(catPath, s)).isDirectory()
      )
      cats.push({ name: cat, count: skills.length })
    }
  } catch {}
  return cats
}

function getHermesConfig() {
  const configPath = '/root/.hermes/config.yaml'
  try {
    if (fs.existsSync(configPath)) {
      const yaml = require('js-yaml').load(fs.readFileSync(configPath, 'utf-8'))
      return yaml
    }
  } catch {}
  return null
}

export default function SettingsPage() {
  const config = getHermesConfig()
  const skillCats = getSkillsDirs()
  const totalSkills = skillCats.reduce((s, c) => s + c.count, 0)

  const cronJobs = [
    {
      id: '0e537481b763',
      name: '每日AI日报',
      schedule: '0 8 * * *',
      scheduleDesc: '每天 08:00',
      lastRun: '2026-04-16 08:00',
      nextRun: '2026-04-17 08:00',
      status: 'ok',
      target: 'Feishu',
    },
    {
      id: '1efee42faadc',
      name: 'Skills知识库同步',
      schedule: '0 9 * * 0',
      scheduleDesc: '每周日 09:00',
      lastRun: '2026-04-13 09:00',
      nextRun: '2026-04-20 09:00',
      status: 'ok',
      target: 'Local',
    },
  ]

  const cronLogs = [
    { time: '2026-04-16 08:00:23', job: '每日AI日报', status: '✅ 成功', duration: '4m 12s', items: 126 },
    { time: '2026-04-15 08:01:05', job: '每日AI日报', status: '✅ 成功', duration: '5m 03s', items: 138 },
    { time: '2026-04-14 08:03:41', job: '每日AI日报', status: '✅ 成功', duration: '4m 51s', items: 142 },
    { time: '2026-04-13 09:00:00', job: 'Skills知识库同步', status: '✅ 成功', duration: '12m 30s', items: 697 },
  ]

  const enabledToolsets = [
    { name: 'browser', desc: '浏览器自动化', status: true },
    { name: 'terminal', desc: '终端执行', status: true },
    { name: 'file', desc: '文件读写', status: true },
    { name: 'search', desc: '网络搜索', status: true },
    { name: 'vision', desc: '图片分析', status: true },
    { name: 'image_gen', desc: '图片生成', status: true },
    { name: 'cronjob', desc: '定时任务', status: true },
    { name: 'skills', desc: 'Skills知识库', status: true },
  ]

  const sysInfo = {
    hermesHome: process.env.HERMES_HOME || '~/.hermes',
    nodeVersion: process.version,
    platform: process.platform,
    lastUpdated: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
  }

  return (
    <main className="page">
      <div className="container">

        <div className="page-header animate-fade-up">
          <h1 className="page-title">
            <span className="page-title-icon">⚙️</span>
            系统配置
          </h1>
          <p className="page-subtitle">
            Hermes 运行时配置 · Skills · 定时任务
          </p>
        </div>

        {/* 系统信息 */}
        <div className="card animate-fade-up animate-delay-1" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div className="card-title">💻 系统信息</div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Hermes Home', value: sysInfo.hermesHome },
                { label: 'Node.js', value: sysInfo.nodeVersion },
                { label: '平台', value: sysInfo.platform },
                { label: '最后刷新', value: sysInfo.lastUpdated },
              ].map(item => (
                <div key={item.label} style={{ padding: '12px 16px', background: 'var(--pink-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid-2">

          {/* 左侧：Cron + 日志 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Cron任务 */}
            <div className="card animate-fade-up animate-delay-2">
              <div className="card-header">
                <div className="card-title">
                  <span>⏰</span>
                  定时任务
                  <span className="badge badge-online" style={{ marginLeft: 8 }}>{cronJobs.length} 个</span>
                </div>
              </div>
              <div>
                {cronJobs.map(job => (
                  <div key={job.id} className="list-item">
                    <div className="list-icon">⏰</div>
                    <div className="list-content">
                      <div className="list-title">{job.name}</div>
                      <div className="list-desc">{job.scheduleDesc} · 推送至 {job.target}</div>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>上次: {job.lastRun}</span>
                        <span>下次: {job.nextRun}</span>
                      </div>
                    </div>
                    <span className="badge badge-online">✓ 正常</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cron执行日志 */}
            <div className="card animate-fade-up animate-delay-3">
              <div className="card-header">
                <div className="card-title"><span>📜</span> 执行日志</div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>时间</th>
                      <th>任务</th>
                      <th>状态</th>
                      <th style={{ textAlign: 'right' }}>耗时</th>
                      <th style={{ textAlign: 'right' }}>条数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cronLogs.map((log, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{log.time}</td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>{log.job}</td>
                        <td><span className="badge badge-online" style={{ fontSize: '0.68rem' }}>{log.status}</span></td>
                        <td style={{ textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{log.duration}</td>
                        <td style={{ textAlign: 'right', fontSize: '0.82rem', fontWeight: 700, color: 'var(--lav-400)' }}>{log.items}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* 右侧：Toolsets + Skills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 启用的工具集 */}
            <div className="card animate-fade-up animate-delay-2">
              <div className="card-header">
                <div className="card-title">
                  <span>🧰</span>
                  启用的工具集
                  <span className="badge badge-lav" style={{ marginLeft: 8 }}>{enabledToolsets.filter(t => t.status).length} 个</span>
                </div>
              </div>
              <div className="card-body" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {enabledToolsets.map(tool => (
                    <div
                      key={tool.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: tool.status ? 'rgba(76,175,130,0.08)' : 'var(--pink-50)',
                        border: `1px solid ${tool.status ? 'rgba(76,175,130,0.2)' : 'var(--border)'}`,
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>{tool.status ? '✅' : '❌'}</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{tool.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tool.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills目录 */}
            <div className="card animate-fade-up animate-delay-3">
              <div className="card-header">
                <div className="card-title">
                  <span>🧠</span>
                  Skills 知识库
                  <span className="badge badge-pink" style={{ marginLeft: 8 }}>{totalSkills} 个分类</span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--lav-50)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--lav-300)' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lav-400)', marginBottom: 4 }}>📚 知识库统计</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    共 {totalSkills} 个 Skill · 存储于 <code style={{ fontSize: '0.78rem' }}>~/.hermes/skills/</code>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {skillCats.map(cat => (
                    <span key={cat.name} className="badge badge-lav" style={{ fontSize: '0.72rem' }}>
                      {cat.name} ({cat.count})
                    </span>
                  ))}
                  {skillCats.length === 0 && (
                    <span className="badge badge-warn">Skills目录为空</span>
                  )}
                </div>
              </div>
            </div>

            {/* Hermes配置 */}
            {config && (
              <div className="card animate-fade-up animate-delay-4">
                <div className="card-header">
                  <div className="card-title"><span>🔧</span> Hermes 运行时配置</div>
                </div>
                <div className="card-body" style={{ padding: '12px 16px' }}>
                  <div className="table-wrap">
                    <table>
                      <tbody>
                        {Object.entries(config as Record<string, unknown>).slice(0, 12).map(([key, val]) => (
                          <tr key={key}>
                            <td style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', width: '40%' }}>{key}</td>
                            <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </main>
  )
}
