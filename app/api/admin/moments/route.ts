import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { readMoments, writeMoments } from '@/lib/data'

export async function GET() {
  const list = readMoments()
  return NextResponse.json(list)
}

export async function POST(request: Request) {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const moment = await request.json()
    const list = readMoments()
    moment.id = Date.now().toString()
    moment.createdAt = new Date().toISOString()
    list.unshift(moment)
    const success = writeMoments(list)
    if (success) return NextResponse.json({ success: true, id: moment.id })
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
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
    const list = readMoments()
    const index = list.findIndex((m: any) => m.id === updated.id)
    if (index === -1) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }
    list[index] = { ...list[index], ...updated }
    const success = writeMoments(list)
    if (success) return NextResponse.json({ success: true })
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
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
    if (!id) return NextResponse.json({ error: '缺少ID参数' }, { status: 400 })
    const list = readMoments()
    const filtered = list.filter((m: any) => m.id !== id)
    const success = writeMoments(filtered)
    if (success) return NextResponse.json({ success: true })
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: '请求错误' }, { status: 400 })
  }
}


