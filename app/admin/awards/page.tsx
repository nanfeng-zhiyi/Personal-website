'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AdminAwards() {
  const router = useRouter()
  const [awards, setAwards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchAwards()
  }, [])

  const fetchAwards = async () => {
    try {
      const res = await fetch('/api/admin/awards')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error?.error || '加载失败')
      }
      const data = await res.json()
      setAwards(data)
    } catch (error: any) {
      console.error('加载失败:', error)
      alert(error?.message || '加载失败，请检查权限')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return

    try {
      const res = await fetch(`/api/admin/awards?id=${id}`, { method: 'DELETE' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        fetchAwards()
      } else {
        const error = await res.json().catch(() => ({}))
        alert(error?.error || '删除失败')
      }
    } catch (error: any) {
      alert(error?.message || '删除失败')
    }
  }

  const handleSave = async (award: any) => {
    try {
      const url = '/api/admin/awards'
      const method = award.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(award),
      })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        setShowForm(false)
        setEditing(null)
        fetchAwards()
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

        <div className="max-w-4xl mx-auto mt-20">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <button
                onClick={() => router.back()}
                className="text-cyan-400 hover:text-cyan-300 mb-4 block"
              >
                ← 返回
              </button>
              <h1 className="text-4xl font-bold text-purple-400">管理获奖记录</h1>
            </div>
            <button
              onClick={() => {
                setEditing(null)
                setShowForm(true)
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90"
            >
              + 添加
            </button>
          </div>

          {showForm && (
            <AwardForm
              award={editing}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
            />
          )}

          <div className="space-y-4">
            {awards.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center text-gray-400">
                暂无获奖记录
              </div>
            ) : (
              awards.map((award) => (
                <div key={award.id} className="glass-card rounded-xl p-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-purple-300 mb-2">{award.title}</h3>
                    <p className="text-cyan-400 mb-1">{award.level}</p>
                    <p className="text-gray-400 text-sm mb-2">{award.year}</p>
                    <p className="text-gray-300">{award.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(award)
                        setShowForm(true)
                      }}
                      className="px-4 py-2 text-cyan-400 border border-cyan-400/30 rounded hover:bg-cyan-400/10"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(award.id)}
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

function AwardForm({ award, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: award?.title || '',
    level: award?.level || '',
    year: award?.year || '',
    description: award?.description || '',
    ...(award?.id && { id: award.id }),
  })

  return (
    <div className="glass-card rounded-xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        {award ? '编辑' : '添加'}获奖记录
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">奖项名称</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-purple-400/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">等级</label>
          <input
            type="text"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-purple-400/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">年份</label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-purple-400/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-purple-400/20 rounded-lg text-white"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90"
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

