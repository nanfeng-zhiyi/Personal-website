'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import TechButton from '@/components/TechButton'

export default function ApiDemo() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (endpoint: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(endpoint)
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError('请求失败，请确保开发服务器正在运行')
    } finally {
      setLoading(false)
    }
  }

  const apiEndpoints = [
    { name: '获取问候语', endpoint: '/api/hello', color: 'from-cyan-500 to-blue-600' },
    { name: '获取服务器时间', endpoint: '/api/time', color: 'from-green-500 to-emerald-600' },
    { name: '获取示例数据', endpoint: '/api/data', color: 'from-purple-500 to-pink-600' },
  ]

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/api-demo" />

        <div className="max-w-5xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              API Routes 演示
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              这些 API 端点都定义在 <code className="bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded border border-cyan-400/30 font-mono">app/api</code> 目录中
            </p>
            <p className="text-gray-400">
              无需独立后端服务器，所有逻辑都在前端代码中
            </p>
          </div>

          <div className="space-y-8">
            {/* API 测试区域 */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-3">
                <span className="text-3xl">🚀</span>
                测试 API 端点
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {apiEndpoints.map((api, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchData(api.endpoint)}
                    disabled={loading}
                    className={`relative px-6 py-4 rounded-lg font-semibold text-white bg-gradient-to-r ${api.color} hover:opacity-90 disabled:opacity-50 shadow-lg`}
                  >
                    {api.name}
                    {loading && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="animate-spin text-2xl">⟳</span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 结果显示 */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-3">
                <span className="text-3xl">📡</span>
                响应结果
              </h2>
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin text-4xl text-cyan-400 mb-4">⟳</div>
                  <p className="text-gray-400">正在请求数据...</p>
                </div>
              )}
              {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-semibold mb-2">❌ 错误</p>
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              {data && !loading && (
                <div className="relative">
                  <div className="absolute top-4 right-4 text-xs text-gray-500 font-mono">
                    JSON
                  </div>
                  <pre className="bg-gray-900/80 border border-cyan-400/20 p-6 rounded-lg overflow-auto text-sm text-gray-300 font-mono backdrop-blur-sm">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
              {!data && !loading && !error && (
                <div className="text-center py-12 border-2 border-dashed border-cyan-400/20 rounded-lg">
                  <div className="text-5xl mb-4 opacity-50">⚡</div>
                  <p className="text-gray-400 text-lg">点击上方按钮测试 API</p>
                  <p className="text-gray-500 text-sm mt-2">所有请求都在服务端处理</p>
                </div>
              )}
            </div>

            {/* API 说明 */}
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-pink-400 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                工作原理
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Next.js 的 <span className="text-cyan-400 font-semibold">API Routes</span> 功能允许你在 <code className="bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded text-sm">app/api</code> 目录中创建后端端点。
                </p>
                <p>
                  这些路由文件会自动成为可访问的 API 端点，你可以在这里处理：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-400">
                  <li>数据库操作</li>
                  <li>文件上传和处理</li>
                  <li>第三方 API 调用</li>
                  <li>身份验证和授权</li>
                  <li>任何后端业务逻辑</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8">
              <TechButton href="/" variant="outline">
                ← 返回首页
              </TechButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

