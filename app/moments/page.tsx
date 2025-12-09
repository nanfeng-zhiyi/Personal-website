import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { readMoments } from '@/lib/data'
import { formatRelativeTime, formatFullDateTime } from '@/lib/timeUtils'

// 根据图片数量决定布局
function getImageGridClass(count: number) {
  if (count === 1) return 'grid-cols-1 max-w-md'
  if (count === 2) return 'grid-cols-2 max-w-2xl'
  if (count === 3) return 'grid-cols-3'
  if (count === 4) return 'grid-cols-2'
  return 'grid-cols-3'
}

export default async function Moments() {
  const list = readMoments()

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/moments" />

        <div className="max-w-4xl mx-auto mt-16 md:mt-20">
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              动态
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              这里记录一些日常想法、灵感与瞬间，类似 QQ 空间/朋友圈的动态流。
            </p>
          </div>

          {list.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4 opacity-50">📝</div>
              <p className="text-gray-400 text-lg">暂无动态</p>
              <p className="text-gray-500 text-sm mt-2">开始记录你的第一个动态吧</p>
            </div>
          ) : (
            <div className="space-y-6">
              {list.map((item: any, index: number) => {
                const imageCount = item.images?.length || 0
                const dateStr = item.date || item.createdAt || ''
                const relativeTime = formatRelativeTime(dateStr)
                const fullDateTime = formatFullDateTime(dateStr)
                
                return (
                  <Link
                    key={item.id}
                    href={`/moments/${item.id}`}
                    className="block glass-card rounded-2xl p-6 md:p-8 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group"
                  >
                    {/* 头部：时间信息和心情标签 */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-emerald-400/10">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-emerald-400/60"
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
                          <span className="text-sm font-medium text-gray-300" title={fullDateTime}>
                            {relativeTime || dateStr}
                          </span>
                        </div>
                        {item.mood && (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-medium">
                            {item.mood}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 内容区域 */}
                    <div className="space-y-4">
                      {/* 文字内容 */}
                      {item.content && (
                        <p className="text-base md:text-lg text-gray-200 whitespace-pre-wrap leading-relaxed line-clamp-3">
                          {item.content}
                        </p>
                      )}

                      {/* 图片展示 */}
                      {imageCount > 0 && (
                        <div className={`grid ${getImageGridClass(imageCount)} gap-3 mt-4`}>
                          {item.images.slice(0, 4).map((img: string, idx: number) => (
                            <div
                              key={idx}
                              className={`relative rounded-xl overflow-hidden border border-emerald-400/20 group-hover:border-emerald-400/40 transition-all duration-300 ${
                                imageCount === 1
                                  ? 'aspect-auto max-h-96'
                                  : imageCount === 2
                                  ? 'aspect-square'
                                  : 'aspect-square'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`动态图片 ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              {imageCount > 4 && idx === 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <span className="text-white text-lg font-semibold">+{imageCount - 4}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 查看详情提示 */}
                    <div className="mt-4 pt-4 border-t border-emerald-400/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500">点击查看详情</span>
                      <svg className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


