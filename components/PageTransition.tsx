'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [showShimmer, setShowShimmer] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // 首次加载时不显示动画
    if (previousPath === null) {
      setPreviousPath(pathname)
      return
    }
    
    // 路径变化时显示动画
    if (pathname !== previousPath) {
      setShowShimmer(true)
      const timer = setTimeout(() => {
        setShowShimmer(false)
      }, 400)
      setPreviousPath(pathname)
      return () => clearTimeout(timer)
    }
  }, [pathname, previousPath])

  // 如果用户偏好减少动画，直接返回内容
  if (shouldReduceMotion) {
    return <div className="w-full">{children}</div>
  }

  // 首次加载时直接显示内容，不显示动画
  const shouldAnimate = previousPath !== null && pathname !== previousPath

  return (
    <div className="relative w-full">
      {/* 顶部进度条指示器 */}
      {showShimmer && (
        <motion.div
          className="page-transition-shimmer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      <motion.div
        key={pathname}
        initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full relative z-10"
      >
        {children}
      </motion.div>
    </div>
  )
}

