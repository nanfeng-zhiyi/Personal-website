import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { readPublications } from '@/lib/data'
                                  
export default async function Publications() {
  const list = readPublications()

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/publications" />

        <div className="max-w-5xl mx-auto mt-20">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              论文与发表
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
              这里整理了我在学术与科研方向发表或参与的论文，包含期刊、会议与预印本等信息。
            </p>
          </div>

          {list.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4 opacity-50">📄</div>
              <p className="text-gray-400 text-lg">暂无论文记录</p>
              <p className="text-gray-500 text-sm mt-2">稍后再来看看吧</p>
            </div>
          ) : (
            <div className="space-y-6">
              {list.map((pub: any) => (
                <Link
                  key={pub.id}
                  href={`/publications/${pub.id}`}
                  className="block glass-card rounded-2xl p-6 md:p-8 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group"
                >
                  <div className="flex gap-6 items-center">
                    {pub.image && (
                      <div className="hidden md:block flex-shrink-0">
                        <div className="relative w-28 h-28 rounded-xl border border-emerald-400/40 overflow-hidden group-hover:border-emerald-400/60 transition-all duration-300 group-hover:scale-105">
                          <img
                            src={pub.image}
                            alt={pub.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg md:text-xl font-semibold text-emerald-200 group-hover:text-emerald-100 transition-colors">
                          {pub.title}
                        </h2>
                        {pub.year && (
                          <span className="text-xs font-medium text-cyan-300 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                            {pub.year}
                          </span>
                        )}
                      </div>
                      {pub.authors && (
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>{pub.authors}</span>
                        </div>
                      )}
                      {(pub.venue || pub.doi) && (
                        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400">
                          {pub.venue && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800/50 border border-gray-700/50">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {pub.venue}
                            </span>
                          )}
                          {pub.doi && (
                            <span className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800/50 border border-gray-700/50 text-cyan-300">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              {pub.doi}
                            </span>
                          )}
                        </div>
                      )}
                      {pub.summary && (
                        <p className="mt-1 text-sm md:text-base text-gray-300 leading-relaxed line-clamp-2">
                          {pub.summary}
                        </p>
                      )}
                    </div>
                    <div className="hidden md:block text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


