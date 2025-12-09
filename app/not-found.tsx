import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TechButton from '@/components/TechButton'

export default function NotFound() {
  return (
    <main className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPath="/" />
        <div className="max-w-2xl mx-auto mt-32 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-2xl text-gray-300 mb-8">页面未找到</p>
          <p className="text-gray-400 mb-12">抱歉，您访问的页面不存在。</p>
          <TechButton href="/" variant="primary">
            返回首页
          </TechButton>
        </div>
      </div>
    </main>
  )
}

