'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface ThemeSettings {
  theme: {
    mode: 'dynamic' | 'image'
    backgroundImage: string
    accentColor?: string
    glassStyle: 'default' | 'liquid'
  }
}

export default function AppearanceSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [backgroundUploading, setBackgroundUploading] = useState(false)
  const [settings, setSettings] = useState<ThemeSettings | null>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        if (res.status === 401) {
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setSettings(data)
      } catch (error) {
        console.error('加载站点设置失败:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const theme = settings?.theme || {
    mode: 'dynamic',
    backgroundImage: '',
    glassStyle: 'default',
  }

  const handleThemeModeChange = (mode: 'dynamic' | 'image') => {
    setSettings((prev: any) => ({
      ...(prev || {}),
      theme: {
        ...(prev?.theme || {}),
        mode,
      },
    }))
  }

  const handleGlassStyleChange = (glassStyle: 'default' | 'liquid') => {
    setSettings((prev: any) => ({
      ...(prev || {}),
      theme: {
        ...(prev?.theme || {}),
        glassStyle,
      },
    }))
  }

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

  const handleBackgroundUpload = async (file: File) => {
    setBackgroundUploading(true)
    try {
      const url = await uploadFile(file)
      setSettings((prev: any) => ({
        ...(prev || {}),
        theme: {
          ...(prev?.theme || {}),
          backgroundImage: url,
          mode: 'image',
        },
      }))
    } catch (error: any) {
      alert(error?.message || '上传失败')
    } finally {
      setBackgroundUploading(false)
      if (backgroundInputRef.current) {
        backgroundInputRef.current.value = ''
      }
    }
  }

  const handleRemoveBackground = () => {
    setSettings((prev: any) => ({
      ...(prev || {}),
      theme: {
        ...(prev?.theme || {}),
        backgroundImage: '',
        mode: 'dynamic',
      },
    }))
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        alert('外观设置已保存')
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

        <div className="max-w-4xl mx-auto mt-20">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="text-cyan-400 hover:text-cyan-300 mb-4 block"
              >
                ← 返回
              </button>
              <h1 className="text-4xl font-bold text-cyan-300">外观设置</h1>
              <p className="text-gray-400 mt-2 text-sm">
                调整全局背景、卡片样式等视觉效果，立即应用到整个站点
              </p>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !settings}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存外观'}
            </button>
          </div>

          <div className="glass-card rounded-xl p-8 space-y-6">
            {/* 背景模式 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-cyan-300">背景模式</h2>
              <p className="text-sm text-gray-400">
                在默认科技动态背景和自定义静态图像之间切换
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    value: 'dynamic',
                    label: '科技动态背景',
                    description: '保留默认的极光渐变 + 网格背景动画',
                  },
                  {
                    value: 'image',
                    label: '自定义静态图像',
                    description: '上传一张静态图像作为背景，可叠加轻微霓虹滤镜',
                  },
                ].map((option) => {
                  const selected = theme.mode === option.value
                  return (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        selected
                          ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.25)]'
                          : 'border-white/5 hover:border-cyan-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{option.label}</p>
                          <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                        </div>
                        <span
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-cyan-300' : 'border-gray-500'
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full bg-cyan-300 transition-opacity ${
                              selected ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="theme-mode"
                        value={option.value}
                        checked={theme.mode === option.value}
                        onChange={() => handleThemeModeChange(option.value as 'dynamic' | 'image')}
                        className="sr-only"
                      />
                    </label>
                  )
                })}
              </div>
            </div>

            {/* 卡片样式 */}
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-semibold text-sky-300">卡片样式</h2>
              <p className="text-sm text-gray-400">
                选择经典科技卡片或更接近 iOS 的液态玻璃卡片样式
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    value: 'default',
                    label: '经典科技卡片',
                    description: '当前的深色科技风玻璃卡片，性能表现最佳',
                  },
                  {
                    value: 'liquid',
                    label: '液态玻璃卡片（实验性）',
                    description: '高强度模糊与高光效果，更柔和的空间感',
                  },
                ].map((option) => {
                  const selected = theme.glassStyle === option.value
                  return (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        selected
                          ? 'border-sky-300 bg-sky-400/10 shadow-[0_0_25px_rgba(56,189,248,0.35)]'
                          : 'border-white/5 hover:border-sky-400/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{option.label}</p>
                          <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                        </div>
                        <span
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selected ? 'border-sky-300' : 'border-gray-500'
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full bg-sky-300 transition-opacity ${
                              selected ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="glass-style"
                        value={option.value}
                        checked={theme.glassStyle === option.value}
                        onChange={() => handleGlassStyleChange(option.value as 'default' | 'liquid')}
                        className="sr-only"
                      />
                    </label>
                  )
                })}
              </div>
            </div>

            {/* 背景图上传与预览 */}
            <div className="grid lg:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-300">背景预览</p>
                <div className="relative rounded-2xl border border-white/10 overflow-hidden h-48">
                  {theme.mode === 'image' && theme.backgroundImage ? (
                    <>
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${theme.backgroundImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950/80" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.4),_transparent_55%),linear-gradient(135deg,#0a0a0f_0%,#1a1a2e_60%,#16213e_100%)]" />
                  )}
                  <span className="absolute bottom-3 left-4 text-sm text-white/80">
                    {theme.mode === 'image' && theme.backgroundImage ? '自定义背景' : '默认动态背景'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-300">背景图片</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => backgroundInputRef.current?.click()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold text-sm disabled:opacity-60"
                    disabled={backgroundUploading}
                  >
                    {backgroundUploading ? '上传中...' : '上传图片背景'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveBackground}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 disabled:opacity-40"
                    disabled={!theme.backgroundImage}
                  >
                    清除背景
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  建议使用 4K 分辨率（例如 3840×2160）PNG/JPEG/GIF/WEBP 图片，最大 15MB
                </p>
                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleBackgroundUpload(file)
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


