'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AdminPublications() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

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

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/publications')
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
      console.error('加载失败:', error)
      alert(error?.message || '加载失败，请检查权限')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇论文记录吗？')) return
    try {
      const res = await fetch(`/api/admin/publications?id=${id}`, { method: 'DELETE' })
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

  const handleSave = async (pub: any) => {
    try {
      const url = '/api/admin/publications'
      const method = pub.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pub),
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

  const handleCoverUpload = (pub: any) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/jpg,image/gif,image/webp'
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      setUploadingId(pub.id)
      try {
        const url = await uploadFile(file)
        const updated = { ...pub, image: url }
        const res = await fetch('/api/admin/publications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        })
        if (res.ok) {
          setItems((prev) => prev.map((p) => (p.id === pub.id ? updated : p)))
        } else {
          alert('封面保存失败')
        }
      } catch (error: any) {
        alert(error?.message || '上传失败')
      } finally {
        setUploadingId(null)
      }
    }
    input.click()
  }

  const handleCoverClear = async (pub: any) => {
    const updated = { ...pub, image: '' }
    try {
      const res = await fetch('/api/admin/publications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (res.ok) {
        setItems((prev) => prev.map((p) => (p.id === pub.id ? updated : p)))
      } else {
        alert('清除封面失败')
      }
    } catch (error) {
      alert('清除封面失败')
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <button
                onClick={() => router.back()}
                className="text-cyan-400 hover:text-cyan-300 mb-4 block"
              >
                ← 返回
              </button>
              <h1 className="text-4xl font-bold text-emerald-400">管理论文</h1>
            </div>
            <button
              onClick={() => {
                setEditing(null)
                setShowForm(true)
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90"
            >
              + 添加论文
            </button>
          </div>

          {showForm && (
            <PublicationForm
              pub={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
            />
          )}

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center text-gray-400">
                暂无论文记录
              </div>
            ) : (
              items.map((pub) => (
                <div key={pub.id} className="glass-card rounded-xl p-6 flex items-start gap-4">
                  {pub.image && (
                    <div className="hidden md:block w-32 h-20 rounded-lg overflow-hidden border border-emerald-400/40 flex-shrink-0">
                      <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-emerald-300">{pub.title}</span>
                      {pub.year && (
                        <span className="text-xs text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
                          {pub.year}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">
                      {pub.authors && <span>{pub.authors}</span>}
                      {pub.venue && <span> · {pub.venue}</span>}
                    </p>
                    {pub.doi && (
                      <p className="text-xs text-cyan-300 mb-1 break-all">
                        DOI / 链接：{pub.doi}
                      </p>
                    )}
                    {pub.summary && (
                      <p className="text-sm text-gray-300 mt-1">
                        {pub.summary}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleCoverUpload(pub)}
                      className="px-3 py-1.5 text-xs text-emerald-300 border border-emerald-400/40 rounded hover:bg-emerald-400/10"
                    >
                      {uploadingId === pub.id ? '封面上传中...' : pub.image ? '更换封面' : '上传封面'}
                    </button>
                    {pub.image && (
                      <button
                        onClick={() => handleCoverClear(pub)}
                        className="px-3 py-1.5 text-xs text-gray-300 border border-gray-500/40 rounded hover:bg-gray-700/60"
                      >
                        清除封面
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditing(pub)
                        setShowForm(true)
                      }}
                      className="px-4 py-2 text-cyan-400 border border-cyan-400/30 rounded hover:bg-cyan-400/10 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(pub.id)}
                      className="px-4 py-2 text-red-400 border border-red-400/30 rounded hover:bg-red-400/10 text-sm"
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

function PublicationForm({ pub, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: pub?.title || '',
    authors: pub?.authors || '',
    venue: pub?.venue || '',
    year: pub?.year || '',
    doi: pub?.doi || '',
    pdfUrl: pub?.pdfUrl || '',
    summary: pub?.summary || '',
    ...(pub?.id && { id: pub.id }),
  })

  return (
    <div className="glass-card rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-emerald-400 mb-4">
        {pub ? '编辑' : '添加'}论文
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">论文标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">作者（按署名顺序）</label>
          <input
            type="text"
            value={formData.authors}
            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white text-sm"
            placeholder="例如：贾秀泽, XXX, XXX"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">发表期刊 / 会议</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white text-sm"
              placeholder="例如：CVPR 2025, IEEE T-PAMI"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">年份</label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">DOI / 链接</label>
          <input
            type="text"
            value={formData.doi}
            onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white text-sm"
            placeholder="可填写 DOI 或 Arxiv/项目地址"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">PDF 链接（原文）</label>
          <input
            type="text"
            value={formData.pdfUrl}
            onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white text-sm"
            placeholder="可选：如果有可直接访问的 PDF 链接，可在详情页内嵌预览"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">简要摘要 / 说明</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-emerald-400/30 rounded-lg text-white text-sm"
          />
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
    </div>
  )
}


