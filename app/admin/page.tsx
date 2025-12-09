import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default async function AdminDashboard() {
  const isAuthenticated = await verifySession()

  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/admin" />

        <div className="max-w-6xl mx-auto mt-20">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              管理后台
            </h1>
            <p className="text-gray-400">管理你的网站内容</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            <Link
              href="/admin/profile"
              className="glass-card rounded-xl p-8 hover:border-cyan-400/50"
            >
              <div className="text-4xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">个人信息</h2>
              <p className="text-gray-400">编辑个人资料、教育经历和技能</p>
            </Link>

            <Link
              href="/admin/awards"
              className="glass-card rounded-xl p-8 hover:border-purple-400/50"
            >
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-2xl font-bold text-purple-400 mb-2">获奖记录</h2>
              <p className="text-gray-400">管理获奖记录和成就</p>
            </Link>

            <Link
              href="/admin/publications"
              className="glass-card rounded-xl p-8 hover:border-emerald-400/50"
            >
              <div className="text-4xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-emerald-300 mb-2">论文管理</h2>
              <p className="text-gray-400">维护已发表论文与相关信息</p>
            </Link>

            <Link
              href="/admin/blog"
              className="glass-card rounded-xl p-8 hover:border-pink-400/50"
            >
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-pink-400 mb-2">博客管理</h2>
              <p className="text-gray-400">创建、编辑和删除博客文章</p>
            </Link>

            <Link
              href="/admin/home"
              className="glass-card rounded-xl p-8 hover:border-emerald-400/50"
            >
              <div className="text-4xl mb-4">🧭</div>
              <h2 className="text-2xl font-bold text-emerald-300 mb-2">主页设置</h2>
              <p className="text-gray-400">配置首页轮播与介绍内容</p>
            </Link>

            <Link
              href="/admin/appearance"
              className="glass-card rounded-xl p-8 hover:border-sky-400/50"
            >
              <div className="text-4xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-sky-300 mb-2">外观设置</h2>
              <p className="text-gray-400">配置背景模式与液态玻璃卡片风格</p>
            </Link>

            <Link
              href="/admin/moments"
              className="glass-card rounded-xl p-8 hover:border-emerald-400/50"
            >
              <div className="text-4xl mb-4">📜</div>
              <h2 className="text-2xl font-bold text-emerald-300 mb-2">动态管理</h2>
              <p className="text-gray-400">发布/编辑类似 QQ 空间的动态</p>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="px-6 py-3 border border-red-400/30 text-red-400 rounded-lg hover:bg-red-400/10"
              >
                退出登录
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

