'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { formatDate, getDatesRange } from '@/lib/daily/fetcher'

interface DateTabsProps {
  availableDates: string[]
  currentDate: string
}

function formatLabel(dateStr: string): string {
  const today = formatDate(new Date())
  const yesterday = formatDate(new Date(Date.now() - 86400000))
  const dayBefore = formatDate(new Date(Date.now() - 2 * 86400000))

  if (dateStr === today) return '今天'
  if (dateStr === yesterday) return '昨天'
  if (dateStr === dayBefore) return '前天'

  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export default function DateTabs({ availableDates, currentDate }: DateTabsProps) {
  const today = formatDate(new Date())
  const allDates = getDatesRange(7)

  // Only show dates that are either in availableDates or are today/fallback
  const tabs = allDates.filter(d => availableDates.includes(d) || d === today).slice(0, 7)

  return (
    <div className="date-tabs">
      {tabs.map(date => {
        const isActive = date === currentDate
        const label = formatLabel(date)
        return (
          <Link
            key={date}
            href={`/daily?date=${date}`}
            className={`date-tab ${isActive ? 'date-tab-active' : ''}`}
            replace
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
