'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const SECTIONS = [
  { key: 'signals',    title: '今日三大信号',    emoji: '🚨', color: 'var(--violet-500)' },
  { key: 'opportunity',title: '发现机会',        emoji: '💡', color: 'var(--cyan-500)'   },
  { key: 'tech',       title: '技术选型',        emoji: '⚙️', color: '#3b82f6'          },
  { key: 'competitive',title: '竞争情报',        emoji: '🔍', color: 'var(--pink-500)'  },
  { key: 'trends',     title: '趋势判断',        emoji: '📊', color: 'var(--amber)'     },
  { key: 'action',     title: '行动触发',        emoji: '⚡', color: 'var(--green)'     },
]

interface Section {
  key: string
  title: string
  emoji: string
  color: string
  content: string[]
}

interface TocItem { id: string; title: string; emoji: string; color: string }

// Parse raw markdown into structured sections
function parseSections(content: string): Section[] {
  const lines = content.split('\n')
  const sections: Section[] = []
  let current: Section | null = null

  // Intro lines collected before any ## section
  const introLines: string[] = []
  // Signals blockquotes
  const signalLines: string[] = []
  let inIntro = true
  let sawFirstHR = false

  for (const line of lines) {
    // Skip top-level title
    if (line.startsWith('# BuilderPulse')) continue

    // Capture signals blockquotes ("> **今日三大信号**：", "> 1.", "> 2.", "> 3.")
    if (line.startsWith('> **今日三大信号')) {
      // Extract text after the bold label
      const m = line.match(/^>\s*\*\*今日三大信号[：:]\*\*\s*(.*)/)
      if (m && m[1]) signalLines.push(m[1].trim())
      continue
    }
    if (line.startsWith('> ')) {
      const stripped = line.replace(/^>\s*/, '')
      if (stripped.match(/^[123]\.\s/)) {
        signalLines.push(stripped)
      } else if (stripped && !stripped.includes('交叉参考') && !stripped.includes('更新于')) {
        introLines.push(line)
      }
      continue
    }

    // Skip update line
    if (line.includes('交叉参考') || line.includes('更新于')) continue

    // First HR marks end of intro / signals
    if (line.trim() === '---') { inIntro = false; sawFirstHR = true; continue }

    // Section header: ## 发现机会, ## 技术选型 etc.
    const sectionMatch = line.match(/^## (.+)/)
    if (sectionMatch) {
      inIntro = false
      const title = sectionMatch[1].trim()
      const meta = SECTIONS.find(s => s.title === title)
      if (meta) {
        current = { key: meta.key, title: meta.title, emoji: meta.emoji, color: meta.color, content: [] }
        sections.push(current)
      }
      continue
    }

    if (current) {
      current.content.push(line)
    } else if (inIntro) {
      introLines.push(line)
    }
  }

  // Build signals section
  const signalsSection: Section = {
    key: 'signals',
    title: '今日三大信号',
    emoji: '🚨',
    color: 'var(--violet-500)',
    content: signalLines,
  }

  // If we have intro content and a "发现机会" section, prepend intro to it
  if (introLines.length > 0) {
    const oppSection = sections.find(s => s.key === 'opportunity')
    if (oppSection) {
      oppSection.content = [...introLines, ...oppSection.content]
    } else if (sections.length > 0) {
      sections[0].content = [...introLines, ...sections[0].content]
    }
  }

  // Only include signals if it has content
  if (signalLines.length > 0) {
    return [signalsSection, ...sections]
  }
  return sections
}

// Convert one section's markdown lines to HTML
function renderLines(lines: string[]): string {
  if (lines.length === 0) return ''
  const parts: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip horizontal rules
    if (line.trim() === '---') { i++; continue }

    // H3 sub-heading
    const h3 = line.match(/^### (.+)/)
    if (h3) {
      parts.push(`<h3 class="daily-h3">${h3[1].trim()}</h3>`)
      i++; continue
    }

    // Blockquote
    if (line.startsWith('>')) {
      const text = line.replace(/^>\s*/, '')
      parts.push(`<blockquote class="daily-blockquote">${text}</blockquote>`)
      i++; continue
    }

    // Bold label line like "**Takeaway**："
    if (line.match(/^\*\*.+?\*\*[：:]/)) {
      parts.push(`<p class="daily-takeaway">${renderInline(line)}</p>`)
      i++; continue
    }

    // Unordered list item
    if (line.match(/^[\-\*] /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[\-\*] /)) {
        items.push(`<li>${renderInline(lines[i].replace(/^[\-\*] /, ''))}</li>`)
        i++
      }
      parts.push(`<ul class="daily-list">${items.join('')}</ul>`)
      continue
    }

    // Ordered list item
    if (line.match(/^\d+\. /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(`<li>${renderInline(lines[i].replace(/^\d+\. /, ''))}</li>`)
        i++
      }
      parts.push(`<ol class="daily-list">${items.join('')}</ol>`)
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++; continue
    }

    // Regular paragraph
    parts.push(`<p class="daily-p">${renderInline(line)}</p>`)
    i++
  }

  return parts.join('\n')
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="daily-inline-code">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="daily-link">$1</a>')
}

export default function DailyContent({
  content,
  tabDates,
  currentDate,
}: {
  content: string
  tabDates?: string[]
  currentDate?: string
}) {
  const sections = parseSections(content)
  const [activeId, setActiveId] = useState('signals')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Build TOC — signals NOT hardcoded; only sections that exist in SECTIONS array
  const toc: TocItem[] = SECTIONS
    .filter(s => sections.some(sec => sec.key === s.key))
    .map(s => ({ id: s.key, title: s.title, emoji: s.emoji, color: s.color }))

  // Intersection observer for active section
  useEffect(() => {
    observerRef.current?.disconnect()
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id)
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    observerRef.current = obs

    setTimeout(() => {
      document.querySelectorAll('.daily-section').forEach(el => obs.observe(el))
    }, 300)

    return () => obs.disconnect()
  }, [sections])

  return (
    <div className="daily-layout">
      {/* Sticky sidebar */}
      <aside className="daily-sidebar">
        <div className="daily-sidebar-inner">
          {/* Date tabs */}
          {tabDates && currentDate && (
            <div className="daily-date-tabs">
              {tabDates.map(date => {
                const isActive = date === currentDate
                const today = new Date()
                const yesterday = new Date(Date.now() - 86400000)
                const dayBefore = new Date(Date.now() - 2 * 86400000)
                const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`
                const todayStr = today.toISOString().slice(0, 10)
                const yestStr = yesterday.toISOString().slice(0, 10)
                const dayBStr = dayBefore.toISOString().slice(0, 10)
                let label = fmt(new Date(date))
                if (date === todayStr) label = '今天'
                else if (date === yestStr) label = '昨天'
                else if (date === dayBStr) label = '前天'
                return (
                  <Link
                    key={date}
                    href={`/daily?date=${date}`}
                    replace
                    className={`daily-date-tab ${isActive ? 'active' : ''}`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          )}

          <p className="daily-sidebar-label">导航</p>
          <nav>
            {toc.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`daily-sidebar-item ${activeId === item.id ? 'active' : ''}`}
                style={{ '--accent': item.color } as React.CSSProperties}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveId(item.id)
                }}
              >
                <span className="daily-sidebar-emoji">{item.emoji}</span>
                <span className="daily-sidebar-text">{item.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="daily-main">
        {/* 移动端横向日期导航（桌面端隐藏） */}
        {tabDates && currentDate && (
          <div className="daily-date-strip">
            {tabDates.map(date => {
              const isActive = date === currentDate
              const today = new Date()
              const yesterday = new Date(Date.now() - 86400000)
              const dayBefore = new Date(Date.now() - 2 * 86400000)
              const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`
              const todayStr = today.toISOString().slice(0, 10)
              const yestStr = yesterday.toISOString().slice(0, 10)
              const dayBStr = dayBefore.toISOString().slice(0, 10)
              let label = fmt(new Date(date))
              if (date === todayStr) label = '今天'
              else if (date === yestStr) label = '昨天'
              else if (date === dayBStr) label = '前天'
              return (
                <Link
                  key={date}
                  href={`/daily?date=${date}`}
                  replace
                  className={`daily-date-tab ${isActive ? 'active' : ''}`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        )}

        {sections.map(section => {
          const meta = SECTIONS.find(s => s.key === section.key)
          if (!meta) return null
          const html = renderLines(section.content)
          return (
            <section
              key={section.key}
              id={section.key}
              className="daily-section"
            >
              <div className="daily-section-header">
                <span
                  className="daily-section-icon"
                  style={{ background: meta.color }}
                >
                  {meta.emoji}
                </span>
                <h2 className="daily-section-title" style={{ color: meta.color }}>
                  {meta.title}
                </h2>
              </div>
              <div
                className="daily-section-body"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </section>
          )
        })}
      </div>
    </div>
  )
}
