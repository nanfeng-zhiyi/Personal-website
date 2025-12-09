import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TechButton from '@/components/TechButton'
import { notFound } from 'next/navigation'
import { readMoments } from '@/lib/data'
import { formatRelativeTime, formatFullDateTime } from '@/lib/timeUtils'

// 根据图片数量决定布局
function getImageGridClass(count: number) {
  if (count === 1) return 'grid-cols-1 max-w-2xl'
  if (count === 2) return 'grid-cols-2 max-w-4xl'
  if (count === 3) return 'grid-cols-3'
  if (count === 4) return 'grid-cols-2'
  return 'grid-cols-3'
}

export default async function MomentDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const moments = readMoments()
  const moment = moments.find((m: any) => m.id === id)

  if (!moment) {
    notFound()
  }

  const imageCount = moment.images?.length || 0
  const dateStr = moment.date || moment.createdAt || ''
  const relativeTime = formatRelativeTime(dateStr)
  const fullDateTime = formatFullDateTime(dateStr)

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/moments" />

        <div className="max-w-4xl mx-auto mt-20">
          {/* 返回按钮 */}
          <div className="mb-8">
            <TechButton href="/moments" variant="outline">
              ← 返回动态列表
            </TechButton>
          </div>

          {/* 动态详情 */}
          <article className="glass-card rounded-2xl p-6 md:p-8 mb-12">
            {/* 头部：时间信息和心情标签 */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-emerald-400/10">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-400/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-base font-medium text-gray-300" title={fullDateTime}>
                    {relativeTime || dateStr}
                  </span>
                </div>
                {moment.mood && (
                  <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 text-emerald-200 text-sm font-medium">
                    {moment.mood}
                  </span>
                )}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="space-y-6">
              {/* 文字内容 */}
              {moment.content && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg md:text-xl text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {moment.content}
                  </p>
                </div>
              )}

              {/* 图片展示 */}
              {imageCount > 0 && (
                <div className={`grid ${getImageGridClass(imageCount)} gap-4 mt-6`}>
                  {moment.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className={`relative rounded-xl overflow-hidden border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 ${
                        imageCount === 1
                          ? 'aspect-auto max-h-[600px]'
                          : imageCount === 2
                          ? 'aspect-square'
                          : 'aspect-square'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`动态图片 ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* 底部导航 */}
          <div className="flex justify-between items-center pt-8 border-t border-emerald-400/20">
            <TechButton href="/moments" variant="outline">
              ← 返回列表
            </TechButton>
            <div className="text-sm text-gray-400">
              分享这条动态
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

