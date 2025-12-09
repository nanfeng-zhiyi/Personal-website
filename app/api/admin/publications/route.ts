import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { readPublications, writePublications } from '@/lib/data'

export async function GET() {
  const list = readPublications()
  return NextResponse.json(list)
}

export async function POST(request: Request) {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const pub = await request.json()
    const list = readPublications()

    pub.id = Date.now().toString()
    pub.createdAt = new Date().toISOString()

    list.unshift(pub)
    const success = writePublications(list)

    if (success) {
      return NextResponse.json({ success: true, id: pub.id })
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
    const updated = await request.json()
    const list = readPublications()

    const index = list.findIndex((p: any) => p.id === updated.id)
    if (index === -1) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    list[index] = { ...list[index], ...updated }
    const success = writePublications(list)

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

    const list = readPublications()
    const filtered = list.filter((p: any) => p.id !== id)
    const success = writePublications(filtered)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '删除失败' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: '请求错误' }, { status: 400 })
  }
}


