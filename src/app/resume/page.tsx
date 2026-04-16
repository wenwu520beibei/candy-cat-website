import { promises as fs } from 'fs'
import path from 'path'

export default async function ResumePage() {
  const htmlPath = path.join(process.cwd(), 'public', '个人简历.html')
  const html = await fs.readFile(htmlPath, 'utf-8')

  return (
    <main style={{ minHeight: '100vh' }}>
      <iframe
        src="/个人简历.html"
        style={{ width: '100%', height: '100vh', border: 'none' }}
        title="个人简历"
      />
    </main>
  )
}
