'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function AdminBlog() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || '加载失败')
      }
      const data = await res.json()
      setPosts(data)
    } catch (error: any) {
      console.error('加载失败:', error)
      alert(error?.message || '加载失败，请检查权限')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        fetchPosts()
      } else {
        const error = await res.json().catch(() => ({}))
        alert(error?.error || '删除失败')
      }
    } catch (error: any) {
      alert(error?.message || '删除失败')
    }
  }

  const handleSave = async (post: any) => {
    try {
      const url = '/api/admin/blog'
      const method = post.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        setShowForm(false)
        setEditing(null)
        fetchPosts()
      } else {
        const error = await res.json().catch(() => ({}))
        alert(error?.error || '保存失败')
      }
    } catch (error: any) {
      alert(error?.message || '保存失败')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-8">
          <Navbar currentPath="/admin" />
          <div className="text-center mt-32 text-gray-400">加载中...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/admin" />

        <div className="max-w-6xl mx-auto mt-20">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <button
                onClick={() => router.back()}
                className="text-cyan-400 hover:text-cyan-300 mb-4 block"
              >
                ← 返回
              </button>
              <h1 className="text-4xl font-bold text-pink-400">管理博客</h1>
            </div>
            <button
              onClick={() => {
                setEditing(null)
                setShowForm(true)
              }}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90"
            >
              + 新建文章
            </button>
          </div>

          {showForm && (
            <BlogForm
              post={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
            />
          )}

          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center text-gray-400">
                暂无博客文章
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="glass-card rounded-xl p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-pink-300 mb-2">{post.title}</h3>
                    <div className="flex items-center gap-3 mb-2 text-sm text-gray-400">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <p className="text-gray-300">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditing(post)
                        setShowForm(true)
                      }}
                      className="px-4 py-2 text-cyan-400 border border-cyan-400/30 rounded hover:bg-cyan-400/10"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 text-red-400 border border-red-400/30 rounded hover:bg-red-400/10"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function BlogForm({ post, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || '技术',
    readTime: post?.readTime || '5 分钟',
    tags: post?.tags?.join(', ') || '',
    author: post?.author || '你的名字',
    ...(post?.id && { id: post.id }),
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const snippetPresets = [
    { label: '标题', value: '\n\n## 二级标题\n\n' },
    { label: '列表', value: '\n\n- 列表项 1\n- 列表项 2\n- 列表项 3\n\n' },
    { label: '引用', value: '\n\n> 这里是一段引用\n\n' },
    { label: '代码块', value: '\n\n```ts\nconst main = () => {\n  console.log(\"hello world\")\n}\n```\n\n' },
    { label: '表格', value: '\n\n| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |\n\n' },
    { label: '公式', value: '\n\n$$\nx_\\text{pred} = f(x_\\text{input})\n$$\n\n' },
  ]

  const insertSnippet = (text: string) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      content: `${prev.content}${text}`,
    }))
  }

  const wordCount = formData.content.trim().length

  const handleSubmit = () => {
    const tags = formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    onSave({ ...formData, tags })
  }

  const handleImageUpload = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    setUploading(true)
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      })
      if (res.status === 401) {
        alert('未授权，请重新登录')
        window.location.href = '/admin/login'
        return
      }
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || '上传失败')
      }
      const data = await res.json()
      const markdown = `\n![${file.name}](${data.url})\n`
      setFormData((prev: typeof formData) => ({
        ...prev,
        content: `${prev.content}${markdown}`,
      }))
    } catch (error: any) {
      alert(error?.message || '上传失败')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const onImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-pink-400 mb-4">
        {post ? '编辑' : '新建'}博客文章
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-pink-400/20 rounded-lg text-white"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-pink-400/20 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">阅读时间</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-pink-400/20 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标签（逗号分隔）</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-pink-400/20 rounded-lg text-white"
              placeholder="Next.js, React, Web开发"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">摘要</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-gray-800 border border-pink-400/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">内容（支持 Markdown）</label>
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={onImageButtonClick}
              className="px-4 py-2 text-sm text-cyan-300 border border-cyan-400/40 rounded hover:bg-cyan-400/10 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={uploading}
            >
              {uploading ? '上传中...' : '插入图片'}
            </button>
            <span className="text-xs text-gray-500">
              支持 PNG/JPEG/GIF/WEBP，最大 15MB
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(file)
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {snippetPresets.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => insertSnippet(item.value)}
                className="px-3 py-1.5 text-xs border border-cyan-400/30 text-cyan-200 rounded hover:bg-cyan-400/10"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="border border-pink-400/20 rounded-lg overflow-hidden">
            <MDEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val || '' })}
              height={420}
              textareaProps={{
                placeholder: '在这里输入 Markdown 内容，支持富文本、公式与扩展语法。',
              }}
              previewOptions={{
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>字数：{wordCount}（含空格）</span>
            <span>快捷插入：标题 / 列表 / 引用 / 代码 / 表格 / 公式</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90"
          >
            保存
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

