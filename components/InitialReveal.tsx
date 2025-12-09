'use client'

import { useEffect, useMemo, useState } from 'react'

interface Particle {
  id: number
  left: string
  top: string
  delay: string
}

interface InitialRevealProps {
  onFinish: () => void
}

export default function InitialReveal({ onFinish }: InitialRevealProps) {
  const [shouldRender, setShouldRender] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 1.2}s`,
      })),
    []
  )

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 1800)

    const removeTimer = setTimeout(() => {
      setShouldRender(false)
      onFinish()
    }, 2400)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [onFinish])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#030712] overflow-hidden transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden="true"
    >
      {/* 背景网格+噪声 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.12),transparent_40%),linear-gradient(135deg,#0a0f1a,#050810)]" />
      <div className="absolute inset-0 animate-reveal-grid bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:120px_120px]" />
      <div className="absolute inset-0 mix-blend-soft-light opacity-40 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22><path fill=%22%23ffffff%22 fill-opacity=%220.03%22 d=%22M0 0h40v40H0z%22/></svg>')]" />

      {/* 粒子 */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute block w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-float"
          style={{ left: p.left, top: p.top, animationDelay: p.delay }}
        />
      ))}

      {/* 中心立体光球 */}
      <div className="absolute left-1/2 top-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.45),rgba(59,130,246,0.2),rgba(14,165,233,0.05))] blur-3xl opacity-70 animate-pulse-slow" />
      <div className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30 animate-rotate-slow" />

      {/* 文字&进度 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-5">
        <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-cyan-200/80">System Booting</p>
        <h1 className="text-4xl md:text-5xl font-black text-cyan-50 drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]">
          欢迎来到未来
        </h1>
        <p className="text-gray-300 text-sm md:text-base">正在唤醒你的数字空间...</p>
        <div className="mt-6 h-1.5 w-72 overflow-hidden rounded-full bg-cyan-400/20">
          <span className="block h-full w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-progress-bar" />
        </div>
      </div>
    </div>
  )
}


