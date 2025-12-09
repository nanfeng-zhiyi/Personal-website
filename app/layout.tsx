import type { Metadata } from 'next'
import './globals.css'
import 'katex/dist/katex.min.css'
import TechBackground from '@/components/TechBackground'
import AppShell from '@/components/AppShell'
import { readSettings } from '@/lib/data'

export const metadata: Metadata = {
  title: '个人网站 - 科技风',
  description: '现代化的科技风个人网站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = readSettings()
  const glassStyle = settings.theme?.glassStyle === 'liquid' ? 'theme-liquid' : ''

  return (
    <html lang="zh-CN" className="dark">
      <body className={`relative min-h-screen ${glassStyle}`}>
        <TechBackground theme={settings.theme} />
        <noscript>
          <style>{`.app-shell{opacity:1 !important}`}</style>
        </noscript>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}

