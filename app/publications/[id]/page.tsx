import Navbar from '@/components/Navbar'
import { readPublications } from '@/lib/data'
import { notFound } from 'next/navigation'

export default async function PublicationDetail({ params }: { params: { id: string } }) {
  const list = readPublications()
  const pub = list.find((p: any) => p.id === params.id)

  if (!pub) {
    notFound()
  }

  const pdfUrl = pub.pdfUrl || pub.doi || ''

  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/publications" />

        <div className="max-w-5xl mx-auto mt-20 space-y-8">
          {/* 头部信息 */}
          <section className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
            {pub.image && (
              <div className="md:w-52 flex-shrink-0 rounded-xl overflow-hidden border border-emerald-400/40">
                <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-200">{pub.title}</h1>
                {pub.year && (
                  <span className="text-xs text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30">
                    {pub.year}
                  </span>
                )}
              </div>
              {pub.authors && (
                <p className="text-xs md:text-sm text-gray-300">
                  作者：{pub.authors}
                </p>
              )}
              {pub.venue && (
                <p className="text-xs md:text-sm text-gray-300">
                  发表：{pub.venue}
                </p>
              )}
              {pub.doi && (
                <p className="text-xs md:text-sm text-cyan-300 break-all">
                  DOI / 链接：{pub.doi}
                </p>
              )}
              {pub.summary && (
                <p className="text-sm text-gray-200 leading-relaxed mt-2">
                  {pub.summary}
                </p>
              )}
            </div>
          </section>

          {/* 原文预览 */}
          {pdfUrl && (
            <section className="glass-card rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-cyan-200">论文原文</h2>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs md:text-sm text-cyan-300 hover:text-cyan-100 underline underline-offset-4"
                >
                  在新标签页打开
                </a>
              </div>
              <p className="text-xs md:text-sm text-gray-400">
                若下方内嵌预览无法加载，可能是目标站点禁止嵌入，可点击右上角链接直接访问。
              </p>
              <div className="mt-2 h-[60vh] rounded-xl overflow-hidden border border-cyan-400/20 bg-slate-900">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title={pub.title}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}


