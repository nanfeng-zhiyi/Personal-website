import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TechButton from '@/components/TechButton'
import { readBlog } from '@/lib/data'
import { formatRelativeTime } from '@/lib/timeUtils'

// 博客文章类型
interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  tags: string[]
  coverImage?: string
}

function extractFirstImage(markdown: string | undefined): string | null {
  if (!markdown) return null
  const match = markdown.match(/!\[[^\]]*]\(([^)]+)\)/)
  if (!match) return null
  return match[1]
}

export default async function Blog() {
  // 从文件系统读取博客数据
  const posts = readBlog()
  const blogPosts: BlogPost[] = posts.map((post: any) => ({
    ...post,
    coverImage: extractFirstImage(post.content || post.excerpt),
  }))
  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/blog" />

        <div className="max-w-5xl mx-auto mt-20">
          {/* 页面标题 */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              个人博客
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              分享技术见解、开发经验和学习心得
            </p>
          </div>

          {/* 博客列表 */}
          <div className="space-y-6 mb-12">
            {blogPosts.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4 opacity-50">📝</div>
                <p className="text-gray-400 text-lg">暂无博客文章</p>
                <p className="text-gray-500 text-sm mt-2">前往管理后台创建你的第一篇文章</p>
              </div>
            ) : (
              blogPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block glass-card rounded-2xl p-6 md:p-8 group hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-1 w-full">
                      {/* 头部信息 */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="text-xs font-medium text-cyan-400 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 px-3 py-1.5 rounded-full border border-cyan-400/30">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-400">{post.readTime}</span>
                          </div>
                          <span className="text-gray-600">·</span>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-400" title={post.date}>
                              {formatRelativeTime(post.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 标题 */}
                      <h2 className="text-xl md:text-2xl font-bold text-cyan-300 mb-3 group-hover:text-cyan-400 transition-colors leading-tight">
                        {post.title}
                      </h2>

                      {/* 摘要 */}
                      <p className="text-gray-400 mb-4 leading-relaxed line-clamp-2 text-sm md:text-base">
                        {post.excerpt}
                      </p>

                      {/* 标签 */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-400/20 hover:border-purple-400/40 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 封面图片 */}
                    {post.coverImage && (
                      <div className="w-full md:w-48 h-32 md:h-36 rounded-xl overflow-hidden relative flex-shrink-0 border border-cyan-400/20 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:scale-105">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      </div>
                    )}

                    {/* 箭头指示器 */}
                    <div className="absolute top-6 right-6 md:relative md:top-auto md:right-auto text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* 分页（示例） */}
          <div className="flex justify-center gap-4">
            <button className="px-4 py-2 text-gray-400 hover:text-cyan-400 transition-colors">
              上一页
            </button>
            <span className="px-4 py-2 text-cyan-400">1</span>
            <button className="px-4 py-2 text-gray-400 hover:text-cyan-400 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

