import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'reports.db')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.exec(`
      CREATE TABLE IF NOT EXISTS reports (
        date TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        fetched_at TEXT NOT NULL
      )
    `)
  }
  return _db
}

export interface Report {
  date: string
  content: string
  fetched_at: string
}

export function getReport(date: string): Report | null {
  try {
    const db = getDb()
    const row = db.prepare('SELECT * FROM reports WHERE date = ?').get(date) as Report | undefined
    return row ?? null
  } catch {
    return null
  }
}

export function saveReport(date: string, content: string): void {
  try {
    const db = getDb()
    db.prepare(`
      INSERT OR REPLACE INTO reports (date, content, fetched_at)
      VALUES (?, ?, ?)
    `).run(date, content, new Date().toISOString())
  } catch {
    // ignore
  }
}

export function getAvailableDates(limit = 7): string[] {
  try {
    const db = getDb()
    const rows = db.prepare(
      'SELECT date FROM reports ORDER BY date DESC LIMIT ?'
    ).all(limit) as { date: string }[]
    return rows.map(r => r.date)
  } catch {
    return []
  }
}
