'use client'

import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface NavItem {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/', label: '首页' },
  { href: '/profile', label: '个人资料' },
  { href: '/blog', label: '博客' },
  { href: '/moments', label: '动态' },
  { href: '/publications', label: '论文' },
  { href: '/about', label: '关于' },
]

export default function Navbar({ currentPath }: { currentPath?: string }) {
  const pathname = usePathname()
  const activePath = currentPath || pathname
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50)
  })

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'backdrop-blur-xl bg-slate-950/90 shadow-lg shadow-cyan-500/10'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link href="/" className="text-xl md:text-2xl font-bold neon-text text-cyan-400 block">
                贾秀泽
              </Link>
            </motion.div>

            {/* 桌面端导航 - 统一设计 */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {navItems.map((item, index) => {
                const isActive = activePath === item.href || activePath.startsWith(item.href + '/')
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="relative text-sm font-medium transition-colors duration-200 px-4 py-2"
                    >
                      <motion.span
                        className={`block relative z-10 ${
                          isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              aria-label="菜单"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pb-4 space-y-2">
            {navItems.map((item) => {
              const isActive = activePath === item.href || activePath.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/5'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </motion.div>
      </motion.nav>
      {/* 导航栏占位，避免内容被遮挡 */}
      <div className="h-16 md:h-20" />
    </>
  )
}

