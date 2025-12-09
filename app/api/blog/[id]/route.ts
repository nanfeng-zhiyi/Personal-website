import { NextResponse } from 'next/server'
import { readBlog } from '@/lib/data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const posts = readBlog()
  const post = posts.find((p: any) => p.id === id)

  if (!post) {
    return NextResponse.json({ error: '文章不存在' }, { status: 404 })
  }

  return NextResponse.json(post)
}

