import Navbar from '@/components/Navbar'
import TechCard from '@/components/TechCard'
import { readProfile, readAwards } from '@/lib/data'

export default async function Profile() {
  // 从文件系统读取数据
  const profile = readProfile()
  const awards = readAwards()

  const personalInfo = {
    name: profile.name || '你的名字',
    title: profile.title || '全栈开发者',
    email: profile.email || 'your.email@example.com',
    location: profile.location || '中国',
    avatar: profile.avatar || '',
    bio: profile.bio || '热爱编程，专注于全栈开发和现代化 Web 技术。',
  }

  const education = profile.education || []
  const skills = profile.skills || []

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/profile" />

        <div className="max-w-5xl mx-auto mt-20">
          {/* 个人信息头部 */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 blur-xl opacity-50 animate-pulse" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-1">
                {personalInfo.avatar ? (
                  <div
                    className="w-full h-full rounded-full bg-gray-900 bg-center bg-cover ring-2 ring-cyan-400/30"
                    style={{ backgroundImage: `url(${personalInfo.avatar})` }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-5xl md:text-6xl ring-2 ring-cyan-400/30">
                    👤
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {personalInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">{personalInfo.title}</p>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">{personalInfo.bio}</p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-sm md:text-base text-gray-400">
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {personalInfo.email}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {personalInfo.location}
              </span>
            </div>
          </div>

          {/* 教育经历 */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-cyan-400 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              教育经历
            </h2>
            <div className="space-y-6">
              {education.map((edu: any, idx: number) => (
                <div key={idx} className="glass-card rounded-2xl p-6 md:p-8 relative pl-12 hover:border-cyan-400/40 transition-all duration-300">
                  <div className="absolute left-6 top-6 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50"></div>
                  {idx < education.length - 1 && (
                    <div className="absolute left-[26px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 via-cyan-400/30 to-transparent"></div>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-cyan-300 mb-2">{edu.school}</h3>
                  <p className="text-lg md:text-xl text-gray-300 mb-2 font-medium">{edu.degree}</p>
                  <p className="text-sm text-cyan-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {edu.period}
                  </p>
                  {edu.description && (
                    <p className="text-gray-400 leading-relaxed">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 获奖经历 */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-purple-400 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              获奖经历
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {awards.length === 0 ? (
                <div className="col-span-2 glass-card rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4 opacity-50">🏆</div>
                  <p className="text-gray-400 text-lg">暂无获奖记录</p>
                </div>
              ) : (
                awards.map((award: any, idx: number) => (
                <div key={idx} className="glass-card rounded-2xl p-6 md:p-7 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-purple-300 flex-1">{award.title}</h3>
                    <span className="text-xs font-medium text-cyan-400 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 px-3 py-1.5 rounded-full border border-cyan-400/30 ml-3">
                      {award.year}
                    </span>
                  </div>
                  <p className="text-cyan-400 font-semibold mb-3 text-base">{award.level}</p>
                  {award.description && (
                    <p className="text-gray-400 text-sm leading-relaxed">{award.description}</p>
                  )}
                </div>
                ))
              )}
            </div>
          </div>

          {/* 技能 */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-pink-400 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400/20 to-orange-500/20 border border-pink-400/30 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              技能专长
            </h2>
            <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 hover:border-pink-400/40 transition-all duration-300">
              {skills.map((skill: any, idx: number) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300 font-medium text-base md:text-lg">{skill.name}</span>
                    <span className="text-cyan-400 text-sm font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2.5 overflow-hidden border border-gray-700/50">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${skill.level}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

