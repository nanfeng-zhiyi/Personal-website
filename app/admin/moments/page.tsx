'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AdminMoments() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/moments')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || '加载失败')
      }
      const data = await res.json()
      setItems(data)
    } catch (error: any) {
      console.error('加载动态失败:', error)
      alert(error?.message || '加载失败，请检查权限')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条动态吗？')) return
    try {
      const res = await fetch(`/api/admin/moments?id=${id}`, { method: 'DELETE' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        fetchData()
      } else {
        const error = await res.json().catch(() => ({}))
        alert(error?.error || '删除失败')
      }
    } catch (error: any) {
      alert(error?.message || '删除失败')
    }
  }

  const handleSave = async (moment: any) => {
    try {
      const url = '/api/admin/moments'
      const method = moment.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moment),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        setShowForm(false)
        setEditing(null)
        fetchData()
      } else {
        const error = await res.json().catch(() => ({}))
        alert(error?.error || '保存失败')
      }
    } catch (error: any) {
      alert(error?.message || '保存失败')
    }
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
        router.push('/admin/login')
        return ''
      }
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || '上传失败')
      }
      const data = await res.json()
      return data.url as string
    } catch (error: any) {
      alert(error?.message || '上传失败')
      return ''
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
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

        <div className="max-w-5xl mx-auto mt-20">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="text-cyan-400 hover:text-cyan-300 mb-4 block"
              >
                ← 返回
              </button>
              <h1 className="text-4xl font-bold text-emerald-300">管理动态</h1>
            </div>
            <button
              onClick={() => {
                setEditing(null)
                setShowForm(true)
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90"
            >
              + 新建动态
            </button>
          </div>

          {showForm && (
            <MomentForm
              moment={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
              onUpload={handleImageUpload}
              uploading={uploading}
              fileInputRef={fileInputRef}
            />
          )}

          <div className="space-y-6">
            {items.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4 opacity-50">📝</div>
                <p className="text-gray-400 text-lg">暂无动态</p>
                <p className="text-gray-500 text-sm mt-2">点击上方按钮创建第一条动态</p>
              </div>
            ) : (
              items.map((item) => {
                const imageCount = item.images?.length || 0
                const getImageGridClass = (count: number) => {
                  if (count === 1) return 'grid-cols-1 max-w-md'
                  if (count === 2) return 'grid-cols-2 max-w-2xl'
                  if (count === 3) return 'grid-cols-3'
                  if (count === 4) return 'grid-cols-2'
                  return 'grid-cols-3'
                }
                
                return (
                  <div key={item.id} className="glass-card rounded-2xl p-6 md:p-8 hover:border-emerald-400/40 transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* 内容区域 */}
                      <div className="flex-1 space-y-4">
                        {/* 头部：日期和心情标签 */}
                        <div className="flex items-center justify-between pb-4 border-b border-emerald-400/10">
                          <div className="flex items-center gap-3">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm font-medium text-gray-300">
                                {item.date || item.createdAt?.slice(0, 10)}
                              </span>
                            </div>
                            {item.mood && (
                              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-medium">
                                {item.mood}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 文字内容 */}
                        {item.content && (
                          <p className="text-base text-gray-200 whitespace-pre-wrap leading-relaxed">
                            {item.content}
                          </p>
                        )}

                        {/* 图片展示 */}
                        {imageCount > 0 && (
                          <div className={`grid ${getImageGridClass(imageCount)} gap-3 mt-4`}>
                            {item.images.map((img: string, idx: number) => (
                              <div
                                key={idx}
                                className={`relative rounded-xl overflow-hidden border border-emerald-400/20 transition-all duration-300 ${
                                  imageCount === 1
                                    ? 'aspect-auto max-h-64'
                                    : 'aspect-square'
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`动态图片 ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex md:flex-col gap-2 md:min-w-[100px]">
                        <button
                          onClick={() => {
                            setEditing(item)
                            setShowForm(true)
                          }}
                          className="px-4 py-2 text-cyan-300 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/10 text-sm transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-4 py-2 text-red-300 border border-red-400/30 rounded-lg hover:bg-red-400/10 text-sm transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function MomentForm({ moment, onSave, onCancel, onUpload, uploading, fileInputRef }: any) {
  const [formData, setFormData] = useState({
    content: moment?.content || '',
    mood: moment?.mood || '',
    images: moment?.images || [],
    ...(moment?.id && { id: moment.id }),
  })

  const handleImagePick = async () => {
    const input = fileInputRef.current
    if (!input) return
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      const url = await onUpload(file)
      if (url) {
        setFormData((prev: typeof formData) => ({
          ...prev,
          images: [...(prev.images || []), url],
        }))
      }
    }
    input.click()
  }

  const handleRemoveImage = (idx: number) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== idx),
    }))
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-6 space-y-4">
      <h2 className="text-2xl font-bold text-emerald-300">{moment ? '编辑动态' : '发布动态'}</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">心情/标签（可选）</label>
        <input
          type="text"
          value={formData.mood}
          onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white"
          placeholder="例如：开心 / 学习 / 笔记"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">内容</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white"
          placeholder="说点什么..."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleImagePick}
            className="px-4 py-2 text-sm text-emerald-200 border border-emerald-400/30 rounded hover:bg-emerald-400/10 disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? '上传中...' : '添加图片'}
          </button>
          <span className="text-xs text-gray-500">支持 PNG/JPEG/GIF/WEBP，最大 15MB</span>
        </div>
        {/* 隐藏的文件选择器 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          className="hidden"
        />
        {formData.images?.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {formData.images.map((img: string, idx: number) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-emerald-400/30">
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 px-2 py-1 text-[11px] rounded bg-black/60 text-white"
                >
                  移除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onSave(formData)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90"
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
  )
}


