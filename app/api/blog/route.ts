import { NextResponse } from 'next/server'
import { readBlog } from '@/lib/data'

export async function GET() {
  const posts = readBlog()
  // 返回博客列表（不包含完整内容）
  const postsWithoutContent = posts.map(({ content, ...post }) => post)
  return NextResponse.json({
    posts: postsWithoutContent,
    total: postsWithoutContent.length,
  })
}

