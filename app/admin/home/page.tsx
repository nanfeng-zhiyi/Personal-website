'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface HomeSlide {
  id: string
  title: string
  subtitle?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  image?: string
}

interface HomeData {
  slides: HomeSlide[]
}

export default function AdminHome() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [home, setHome] = useState<HomeData>({ slides: [] })
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/home')
        if (res.status === 401) {
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setHome(data)
      } catch (error) {
        console.error('加载首页数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const uploadFile = async (file: File) => {
    const body = new FormData()
    body.append('file', file)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body,
    })
    if (res.status === 401) {
      router.push('/admin/login')
      throw new Error('未授权')
    }
    let payload: any = null
    try {
      payload = await res.json()
    } catch (error) {
      payload = null
    }
    if (!res.ok) {
      throw new Error(payload?.error || '上传失败')
    }
    return payload?.url as string
  }

  const updateSlide = (index: number, field: keyof HomeSlide, value: string) => {
    setHome((prev) => {
      const slides = [...prev.slides]
      slides[index] = { ...slides[index], [field]: value }
      return { ...prev, slides }
    })
  }

  const addSlide = () => {
    setHome((prev) => ({
      ...prev,
      slides: [
        ...prev.slides,
        {
          id: Date.now().toString(),
          title: '新的轮播卡片',
          subtitle: '',
          description: '',
          ctaLabel: '',
          ctaHref: '',
          image: '',
        },
      ],
    }))
  }

  const removeSlide = (index: number) => {
    setHome((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index)
    try {
      const url = await uploadFile(file)
      updateSlide(index, 'image', url)
    } catch (error: any) {
      alert(error?.message || '上传失败')
    } finally {
      setUploadingIndex(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(home),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        alert('首页轮播设置已保存')
      } else {
        const error = await res.json().catch(() => ({}))
        alert(error?.error || '保存失败')
      }
    } catch (error: any) {
      alert(error?.message || '保存失败')
    } finally {
      setSaving(false)
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
              <h1 className="text-4xl font-bold text-cyan-300">主页设置</h1>
              <p className="text-gray-400 mt-2 text-sm">
                配置首页顶部的轮播卡片内容，用于突出重要入口与介绍
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存设置'}
            </button>
          </div>

          <div className="glass-card rounded-xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-cyan-200">轮播卡片</h2>
              <button
                type="button"
                onClick={addSlide}
                className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold"
              >
                + 新增卡片
              </button>
            </div>
            <p className="text-xs text-gray-500">
              建议保留 2~4 张卡片。顺序会直接影响首页轮播顺序。
            </p>

            <div className="space-y-5">
              {home.slides.map((slide, index) => (
                <div
                  key={slide.id || index}
                  className="rounded-2xl border border-cyan-400/20 bg-gray-900/50 p-5 md:p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">卡片 {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeSlide(index)}
                      className="text-sm text-red-300 hover:text-red-200"
                    >
                      删除
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">主标题</label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => updateSlide(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">副标题</label>
                      <input
                        type="text"
                        value={slide.subtitle || ''}
                        onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">描述</label>
                    <textarea
                      value={slide.description || ''}
                      onChange={(e) => updateSlide(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">按钮文字</label>
                        <input
                          type="text"
                          value={slide.ctaLabel || ''}
                          onChange={(e) => updateSlide(index, 'ctaLabel', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">按钮链接</label>
                        <input
                          type="text"
                          value={slide.ctaHref || ''}
                          onChange={(e) => updateSlide(index, 'ctaHref', e.target.value)}
                          placeholder="/blog 或 /profile 等"
                          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/30 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-300 mb-1">背景图片（可选）</label>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="px-3 py-2 text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold disabled:opacity-60"
                          disabled={uploadingIndex === index}
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/png,image/jpeg,image/jpg,image/gif,image/webp'
                            input.onchange = (e: any) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleImageUpload(index, file)
                              }
                            }
                            input.click()
                          }}
                        >
                          {uploadingIndex === index ? '上传中...' : '上传图片'}
                        </button>
                        {slide.image && (
                          <button
                            type="button"
                            className="px-3 py-2 text-xs border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500"
                            onClick={() => updateSlide(index, 'image', '')}
                          >
                            清除图片
                          </button>
                        )}
                      </div>
                      {slide.image && (
                        <div className="mt-2 h-20 rounded-lg overflow-hidden border border-cyan-400/30">
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {!slide.image && (
                        <p className="text-[11px] text-gray-500">
                          可选：作为轮播卡片的背景图使用，将在首页立体卡片中以渐隐方式呈现。
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {home.slides.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-6">
                  当前没有轮播卡片，点击右上角“新增卡片”开始配置首页内容。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


