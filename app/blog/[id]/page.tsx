import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TechButton from '@/components/TechButton'
import { notFound } from 'next/navigation'
import { readBlog } from '@/lib/data'
import { renderMarkdown } from '@/lib/markdown'
import { formatRelativeTime, formatFullDateTime } from '@/lib/timeUtils'

export default async function BlogPost({ params }: { params: { id: string } }) {
  const { id } = params
  const posts = readBlog()
  const post = posts.find((p: any) => p.id === id)

  if (!post) {
    notFound()
  }

  const htmlContent = renderMarkdown(post.content || '')

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/blog" />

        <div className="max-w-4xl mx-auto mt-20">
          {/* 返回按钮 */}
          <div className="mb-8">
            <TechButton href="/blog" variant="outline">
              ← 返回博客列表
            </TechButton>
          </div>

          {/* 文章头部 */}
          <div className="mb-12">
            <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
              {/* 分类和时间信息 */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="text-xs font-medium text-cyan-400 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 px-3 py-1.5 rounded-full border border-cyan-400/30">
                  {post.category}
                </span>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.readTime}</span>
                  </div>
                  <span className="text-gray-600">·</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span title={formatFullDateTime(post.date)}>
                      {formatRelativeTime(post.date)}
                    </span>
                  </div>
                  {post.author && (
                    <>
                      <span className="text-gray-600">·</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{post.author}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 标题 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                {post.title}
              </h1>

              {/* 标签 */}
              {(post.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(post.tags || []).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-md border border-purple-400/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 文章内容 */}
          <article className="glass-card rounded-2xl p-6 md:p-8 lg:p-10 mb-12">
            <div
              className="prose prose-invert prose-cyan max-w-none
                prose-headings:text-cyan-300 prose-headings:font-bold
                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-cyan-200 prose-strong:font-semibold
                prose-code:text-pink-400
                prose-code:bg-gray-800
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:rounded
                prose-code:text-sm
                prose-pre:bg-gray-900
                prose-pre:border
                prose-pre:border-cyan-400/20
                prose-pre:rounded-xl
                prose-img:rounded-xl prose-img:border prose-img:border-cyan-400/20
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-cyan-400/50 prose-blockquote:pl-4 prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>

          {/* 底部导航 */}
          <div className="flex justify-between items-center pt-8 border-t border-cyan-400/20">
            <TechButton href="/blog" variant="outline">
              ← 返回列表
            </TechButton>
            <div className="text-sm text-gray-400">
              分享这篇文章
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

