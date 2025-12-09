import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { readBlog, writeBlog } from '@/lib/data'

export async function GET() {
  const posts = readBlog()
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const post = await request.json()
    const posts = readBlog()
    
    // 生成ID和日期
    post.id = Date.now().toString()
    post.date = new Date().toISOString().split('T')[0]
    post.createdAt = new Date().toISOString()
    
    // 如果没有摘要，从内容生成
    if (!post.excerpt && post.content) {
      post.excerpt = post.content.substring(0, 150) + '...'
    }
    
    posts.unshift(post) // 新文章放在最前面
    const success = writeBlog(posts)

    if (success) {
      return NextResponse.json({ success: true, id: post.id })
    } else {
      return NextResponse.json({ error: '保存失败' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: '请求错误' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const updatedPost = await request.json()
    const posts = readBlog()
    
    const index = posts.findIndex((p: any) => p.id === updatedPost.id)
    if (index === -1) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    posts[index] = { ...posts[index], ...updatedPost }
    const success = writeBlog(posts)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '保存失败' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: '请求错误' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID参数' }, { status: 400 })
    }

    const posts = readBlog()
    const filtered = posts.filter((p: any) => p.id !== id)
    const success = writeBlog(filtered)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '删除失败' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: '请求错误' }, { status: 400 })
  }
}

