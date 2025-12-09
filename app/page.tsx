import Navbar from '@/components/Navbar'
import TechButton from '@/components/TechButton'
import HeroCarousel from '@/components/HeroCarousel'
import { readHome } from '@/lib/data'

export default function Home() {
  const home = readHome()
  const slides = home.slides || []
  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/" />

        {/* 顶部欢迎区：占据首屏，大部分信息集中于此 */}
        <section className="max-w-6xl mx-auto mt-16 md:mt-20 md:min-h-[60vh] flex items-center">
          <div className="grid gap-10 md:gap-16 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] items-center">
            {/* 左侧：主文案与按钮 */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-[10px] md:text-xs font-mono text-cyan-300 tracking-[0.25em] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>PERSONAL · DIGITAL · SPACE</span>
              </div>

              <h1 className="mt-6 md:mt-8 text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
                贾秀泽
              </h1>

              <p className="mt-4 md:mt-6 text-sm md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                这里是一块属于我的<span className="text-cyan-300 font-semibold">数字主控台</span>：
                用来集中呈现博客文章、个人档案与成长轨迹。
                <br className="hidden md:block" />
                它既是作品集，也是一个可以持续进化的<span className="text-purple-300 font-semibold">个人操作系统界面</span>。
              </p>

              <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
                <TechButton href="/blog" variant="primary">
                  进入博客空间
                </TechButton>
                <TechButton href="/profile" variant="secondary">
                  查看个人档案
                </TechButton>
                <TechButton href="/about" variant="outline">
                  了解站点构成
                </TechButton>
              </div>

              <p className="mt-5 text-xs md:text-sm text-gray-500 max-w-xl">
                所有内容均由我在后台实时维护：从头像、背景到文章与履历，
                你现在看到的一切，都可以视作我在当下时刻的数字快照。
              </p>
            </div>

            {/* 右侧：主题图形，类似 GitHub hero 插画 */}
            <div className="hidden md:flex justify-end">
              <div className="relative w-full max-w-sm">
                {/* 背景光晕 */}
                <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-500/25 via-blue-600/10 to-purple-600/25 blur-3xl opacity-80" />

                <div className="relative glass-card rounded-[1.75rem] px-6 py-6 overflow-hidden flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono tracking-[0.24em] text-cyan-300/80 uppercase">
                        DIGITAL · DASHBOARD
                      </p>
                      <p className="mt-1 text-sm text-gray-400">你的内容在这里被系统化整理</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,0.7)]">
                      <span className="text-2xl">🛰️</span>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-900/60 border border-cyan-400/25 px-3 py-3 flex flex-col gap-1">
                      <span className="text-[11px] text-cyan-300/80">Blog</span>
                      <span className="text-sm font-semibold text-cyan-50">技术记录</span>
                      <span className="text-[11px] text-gray-400">文章与实验</span>
                    </div>
                    <div className="rounded-xl bg-slate-900/60 border border-purple-400/25 px-3 py-3 flex flex-col gap-1">
                      <span className="text-[11px] text-purple-300/80">Profile</span>
                      <span className="text-sm font-semibold text-purple-50">个人档案</span>
                      <span className="text-[11px] text-gray-400">履历与能力</span>
                    </div>
                    <div className="rounded-xl bg-slate-900/60 border border-emerald-400/25 px-3 py-3 flex flex-col gap-1">
                      <span className="text-[11px] text-emerald-300/80">Awards</span>
                      <span className="text-sm font-semibold text-emerald-50">成长轨迹</span>
                      <span className="text-[11px] text-gray-400">奖项与里程碑</span>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>实时可编辑 · 一处修改全站同步</span>
                    </div>
                    <span className="text-cyan-300/80 font-mono">v1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 居中立体轮播 */}
        {slides.length > 0 && (
          <section className="max-w-4xl mx-auto mt-4 md:-mt-4">
            <HeroCarousel slides={slides} />
          </section>
        )}

        {/* 向下滚动区域：分块展示站点结构 */}
        <section className="max-w-6xl mx-auto mt-16 md:mt-20 space-y-10 md:space-y-12 pb-16 md:pb-24">
          {/* 信息卡片 */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card rounded-2xl p-6 md:p-7 text-left hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">🌐</span>
                </div>
                <p className="text-xs font-mono text-cyan-300/80 tracking-[0.18em] uppercase">
                  OVERVIEW
                </p>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-cyan-200 mb-3">一站式个人空间</h2>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                博客、档案与获奖记录分区呈现，却共享同一套视觉与交互语言，
                在不同终端上都保持统一而稳定的体验。
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 md:p-7 text-left hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">✨</span>
                </div>
                <p className="text-xs font-mono text-purple-300/80 tracking-[0.18em] uppercase">
                  EXPERIENCE
                </p>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-purple-200 mb-3">科技感与可读性的平衡</h2>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                液态玻璃与暗色背景只是包装，真正重要的是内容本身——
                因此界面在设计时始终优先保证文字与代码的清晰可读。
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 md:p-7 text-left hidden md:block hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400/20 to-cyan-500/20 border border-sky-400/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xl">⚡</span>
                </div>
                <p className="text-xs font-mono text-sky-300/80 tracking-[0.18em] uppercase">
                  UNDER THE HOOD
                </p>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-sky-200 mb-3">持续迭代的实验场</h2>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                新的交互实验、视觉尝试与后端能力扩展都会优先在这里落地，
                这个首页只是当前阶段的一个版本，而不是终点。
              </p>
            </div>
          </div>

          {/* 底部简要导览：保持轻量，避免信息堆叠 */}
          <div className="grid gap-4 md:grid-cols-3 text-xs md:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>博客记录技术实践、思考与灵感片段。</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>个人档案聚合教育经历、技能谱系与获奖信息。</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>后台可视化控制外观与内容，支持多端自适应访问。</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

