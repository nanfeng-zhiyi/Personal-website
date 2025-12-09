import Navbar from '@/components/Navbar'
import TechButton from '@/components/TechButton'

export default function About() {
  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/about" />

        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              关于这个网站
            </h1>
            <p className="text-xl text-gray-300">
              探索构建这个科技风网站的技术与理念
            </p>
          </div>

          <div className="space-y-8">
            {/* 技术栈 */}
            <div className="glass-card rounded-2xl p-6 md:p-8 hover:border-cyan-400/40 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                技术栈
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Next.js 14', desc: 'React 全栈框架，支持 SSR/SSG', icon: '⚡' },
                  { name: 'TypeScript', desc: '类型安全，提升开发体验', icon: '📘' },
                  { name: 'Tailwind CSS', desc: '现代化样式，快速开发', icon: '🎨' },
                  { name: 'API Routes', desc: '后端逻辑集成，无需独立服务器', icon: '🔌' },
                ].map((tech, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{tech.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-cyan-300 mb-2">{tech.name}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{tech.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 特点 */}
            <div className="glass-card rounded-2xl p-6 md:p-8 hover:border-purple-400/40 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-purple-400 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                核心特点
              </h2>
              <ul className="space-y-4">
                {[
                  '无需独立后端服务器，所有逻辑都在前端代码中',
                  '支持服务端渲染（SSR）和静态生成（SSG）',
                  '自动代码分割和性能优化',
                  '响应式设计，完美适配各种设备',
                  '科技风 UI 设计，玻璃态效果和动态背景',
                ].map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-purple-500/5 transition-colors group"
                  >
                    <span className="text-cyan-400 mt-1 text-xl group-hover:scale-110 transition-transform">▹</span>
                    <span className="text-gray-300 flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 设计理念 */}
            <div className="glass-card rounded-2xl p-6 md:p-8 hover:border-pink-400/40 transition-all duration-300">
              <h2 className="text-3xl font-bold mb-6 text-pink-400 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400/20 to-orange-500/20 border border-pink-400/30 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                设计理念
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                这个网站采用了现代化的科技风设计语言，融合了：
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🌌</div>
                  <h4 className="font-semibold text-cyan-300 mb-2">动态背景</h4>
                  <p className="text-sm text-gray-400">粒子效果与网格动画</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-400/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💎</div>
                  <h4 className="font-semibold text-purple-300 mb-2">玻璃态效果</h4>
                  <p className="text-sm text-gray-400">毛玻璃与霓虹边框</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-pink-500/10 to-transparent rounded-xl border border-pink-400/20 hover:border-pink-400/40 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                  <h4 className="font-semibold text-pink-300 mb-2">流畅动画</h4>
                  <p className="text-sm text-gray-400">平滑过渡与交互反馈</p>
                </div>
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

