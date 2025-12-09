'use client'

import { useEffect, useState } from 'react'
import TechButton from '@/components/TechButton'

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  image?: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!slides.length) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (!slides.length) return null

  const getOffset = (i: number) => {
    const diff = i - index
    if (isMobile) {
      // 移动端关闭 3D，只显示当前卡片，其他淡出，提升帧率
      if (diff === 0) return { zIndex: 20, scale: 1, translateX: 0, rotateY: 0, opacity: 1 }
      return { zIndex: 10, scale: 0.98, translateX: 0, rotateY: 0, opacity: 0 }
    }

    if (diff === 0) return { zIndex: 30, scale: 1, translateX: 0, rotateY: 0, opacity: 1 }
    if (diff === -1 || (diff === slides.length - 1 && index === 0)) {
      return { zIndex: 20, scale: 0.9, translateX: -40, rotateY: 18, opacity: 0.8 }
    }
    if (diff === 1 || (diff === -(slides.length - 1) && index === slides.length - 1)) {
      return { zIndex: 20, scale: 0.9, translateX: 40, rotateY: -18, opacity: 0.8 }
    }
    return { zIndex: 10, scale: 0.8, translateX: diff < 0 ? -90 : 90, rotateY: 0, opacity: 0 }
  }

  return (
    <div className="mt-8 md:mt-10 flex flex-col items-center">
      <div className="relative h-[260px] md:h-[300px] lg:h-[320px] w-full max-w-3xl perspective-[1200px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {slides.map((slide, i) => {
            const { zIndex, scale, translateX, rotateY, opacity } = getOffset(i)
            return (
              <article
                key={slide.id}
                className="absolute w-full glass-card rounded-3xl px-6 py-5 md:px-8 md:py-7 cursor-pointer transition-transform transition-opacity duration-500 ease-out will-change-transform overflow-hidden"
                style={{
                  zIndex,
                  opacity,
                  transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => setIndex(i)}
              >
                {/* 图像背景（可选） */}
                {slide.image && (
                  <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-70"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/40 to-slate-950/80" />
                  </div>
                )}

                <div className="relative flex flex-col gap-3">
                  {slide.subtitle && (
                    <p className="text-[10px] md:text-xs font-mono tracking-[0.18em] uppercase text-cyan-300/80">
                      {slide.subtitle}
                    </p>
                  )}
                  <h3 className="text-lg md:text-2xl font-semibold text-cyan-50">{slide.title}</h3>
                  {slide.description && (
                    <p className="text-xs md:text-sm text-gray-200/90 leading-relaxed line-clamp-3">
                      {slide.description}
                    </p>
                  )}
                  {slide.ctaHref && slide.ctaLabel && (
                    <div className="mt-2">
                      <TechButton href={slide.ctaHref} variant="outline" className="text-xs md:text-sm px-4 py-2">
                        {slide.ctaLabel}
                      </TechButton>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* 指示器 */}
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-cyan-400' : 'w-2.5 bg-cyan-400/40 hover:bg-cyan-400/70'
            }`}
            aria-label={`跳转到第 ${i + 1} 张`}
          />
        ))}
      </div>
    </div>
  )
}


