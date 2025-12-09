'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AdminProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      await fetchProfile()
      setLoading(false)
    }
    load()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setProfile(data)
    } catch (error) {
      console.error('加载失败:', error)
    }
  }


  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        alert('保存成功！')
        router.push('/admin')
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

  const updateProfileField = (field: string, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }))
  }

  const updateEducationField = (index: number, field: string, value: string) => {
    const updated = [...(profile?.education || [])]
    updated[index] = { ...updated[index], [field]: value }
    updateProfileField('education', updated)
  }

  const addEducation = () => {
    const newEntry = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      period: '',
      description: '',
    }
    updateProfileField('education', [...(profile?.education || []), newEntry])
  }

  const removeEducation = (index: number) => {
    const updated = [...(profile?.education || [])]
    updated.splice(index, 1)
    updateProfileField('education', updated)
  }

  const updateSkillField = (index: number, field: string, value: string | number) => {
    const updated = [...(profile?.skills || [])]
    updated[index] = { ...updated[index], [field]: value }
    updateProfileField('skills', updated)
  }

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      level: 50,
    }
    updateProfileField('skills', [...(profile?.skills || []), newSkill])
  }

  const removeSkill = (index: number) => {
    const updated = [...(profile?.skills || [])]
    updated.splice(index, 1)
    updateProfileField('skills', updated)
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

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true)
    try {
      const url = await uploadFile(file)
      updateProfileField('avatar', url)
    } catch (error: any) {
      alert(error?.message || '上传失败')
    } finally {
      setAvatarUploading(false)
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = () => {
    updateProfileField('avatar', '')
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
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-cyan-400 hover:text-cyan-300 mb-4"
            >
              ← 返回
            </button>
            <h1 className="text-4xl font-bold text-cyan-400">编辑个人信息</h1>
          </div>

          <div className="glass-card rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">头像</label>
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-1">
                  {profile?.avatar ? (
                    <div
                      className="w-full h-full rounded-full bg-gray-900 bg-center bg-cover"
                      style={{ backgroundImage: `url(${profile.avatar})` }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-4xl">
                      👤
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-60"
                      disabled={avatarUploading}
                    >
                      {avatarUploading ? '上传中...' : '上传头像'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:border-gray-500 disabled:opacity-40"
                      disabled={!profile?.avatar}
                    >
                      移除头像
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">建议使用正方形图片，最大 15MB，支持 PNG/JPEG/GIF/WEBP</p>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleAvatarUpload(file)
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">姓名</label>
              <input
                type="text"
                value={profile?.name || ''}
                onChange={(e) => updateProfileField('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">职位</label>
              <input
                type="text"
                value={profile?.title || ''}
                onChange={(e) => updateProfileField('title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">邮箱</label>
              <input
                type="email"
                value={profile?.email || ''}
                onChange={(e) => updateProfileField('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">位置</label>
              <input
                type="text"
                value={profile?.location || ''}
                onChange={(e) => updateProfileField('location', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">简介</label>
              <textarea
                value={profile?.bio || ''}
                onChange={(e) => updateProfileField('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
              />
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-cyan-300">教育经历</h2>
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-2 text-sm text-cyan-300 border border-cyan-400/40 rounded-lg hover:bg-cyan-400/10"
                >
                  + 新增
                </button>
              </div>
              <div className="space-y-6">
                {(profile?.education || []).map((edu: any, index: number) => (
                  <div key={edu.id || index} className="rounded-xl border border-cyan-400/20 bg-gray-900/40 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">经历 {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-sm text-red-300 hover:text-red-200"
                      >
                        删除
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">学校</label>
                        <input
                          type="text"
                          value={edu.school || ''}
                          onChange={(e) => updateEducationField(index, 'school', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">学位</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducationField(index, 'degree', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">时间</label>
                        <input
                          type="text"
                          value={edu.period || ''}
                          onChange={(e) => updateEducationField(index, 'period', e.target.value)}
                          placeholder="如：2018 - 2022"
                          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">描述</label>
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => updateEducationField(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-800 border border-cyan-400/20 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(profile?.education || []).length === 0 && (
                  <div className="text-center text-gray-500 text-sm">暂无教育经历，点击“新增”进行添加</div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-pink-300">技能专长</h2>
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 text-sm text-pink-200 border border-pink-400/40 rounded-lg hover:bg-pink-400/10"
                >
                  + 新增
                </button>
              </div>
              <div className="space-y-6">
                {(profile?.skills || []).map((skill: any, index: number) => (
                  <div key={skill.id || index} className="rounded-xl border border-pink-400/20 bg-gray-900/40 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">技能 {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-sm text-red-300 hover:text-red-200"
                      >
                        删除
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">名称</label>
                        <input
                          type="text"
                          value={skill.name || ''}
                          onChange={(e) => updateSkillField(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-pink-400/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">熟练度（%）</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={skill.level ?? 0}
                            onChange={(e) => updateSkillField(index, 'level', Number(e.target.value))}
                            className="flex-1 accent-pink-400"
                          />
                          <span className="w-12 text-right text-pink-200 font-semibold">{skill.level ?? 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(profile?.skills || []).length === 0 && (
                  <div className="text-center text-gray-500 text-sm">暂无技能条目，点击“新增”进行添加</div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500"
              >
                取消
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

