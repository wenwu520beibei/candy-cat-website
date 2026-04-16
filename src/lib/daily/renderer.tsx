import React from 'react'

interface Section {
  title: string
  emoji: string
  key: string
}

const SECTIONS: Section[] = [
  { title: '今日三大信号', emoji: '🚨', key: 'signals' },
  { title: '发现机会', emoji: '💡', key: 'opportunity' },
  { title: '技术选型', emoji: '⚙️', key: 'tech' },
  { title: '竞争情报', emoji: '🔍', key: 'competitive' },
  { title: '趋势判断', emoji: '📊', key: 'trends' },
  { title: '行动触发', emoji: '⚡', key: 'action' },
]

function parseBuilderPulse(content: string): Record<string, string> {
  const sections: Record<string, string> = {}

  // Find all section headers
  const sectionPattern = /^(#{1,3})\s+(.+)$/gm
  const matches = [...content.matchAll(sectionPattern)]
  const nonSectionContent: string[] = []

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index!
    const end = i + 1 < matches.length ? matches[i + 1].index! : content.length
    const sectionContent = content.slice(start, end).trim()

    if (sectionContent) {
      nonSectionContent.push(sectionContent)
    }
  }

  // If no clear sections, treat the whole content
  if (nonSectionContent.length === 0 && content.trim()) {
    nonSectionContent.push(content.trim())
  }

  // Try to identify sections by their titles
  const fullText = content
  for (const section of SECTIONS) {
    const idx = fullText.indexOf(section.title)
    if (idx !== -1) {
      // Find the next section title or end
      let endIdx = content.length
      for (const nextSection of SECTIONS) {
        if (nextSection.key !== section.key) {
          const nextIdx = fullText.indexOf(nextSection.title, idx + 1)
          if (nextIdx !== -1 && nextIdx < endIdx) {
            endIdx = nextIdx
          }
        }
      }
      sections[section.key] = content.slice(idx, endIdx).trim()
    }
  }

  // If no sections found, put everything in a generic content block
  if (Object.keys(sections).length === 0) {
    sections['content'] = content.trim()
  }

  return sections
}

function renderMarkdown(text: string): string {
  return text
    // Remove the section title line from the content
    .replace(/^#{1,3}\s+.+$/gm, '')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // H2
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Unordered lists
    .replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> items
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs (double newlines)
    .replace(/\n\n+/g, '</p><p>')
    // Single newlines in paragraphs
    .replace(/\n/g, '<br/>')
    // Wrap in paragraph
    .replace(/^(.+)$/, '<p>$1</p>')
}

export default function BuilderPulseRenderer({ content }: { content: string }) {
  const sections = parseBuilderPulse(content)

  const hasSections = Object.keys(sections).some(k => SECTIONS.some(s => s.key === k))

  if (!hasSections) {
    return (
      <div
        className="daily-content daily-content-single"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    )
  }

  return (
    <div className="daily-sections">
      {SECTIONS.map(section => {
        const text = sections[section.key]
        if (!text) return null
        return (
          <section key={section.key} className={`daily-section daily-section-${section.key}`}>
            <div className="daily-section-header">
              <span className="daily-section-emoji">{section.emoji}</span>
              <h2 className="daily-section-title">{section.title}</h2>
            </div>
            <div
              className="daily-section-body"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
            />
          </section>
        )
      })}
    </div>
  )
}
