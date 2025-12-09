import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { readAwards, writeAwards } from '@/lib/data'

export async function GET() {
  const awards = readAwards()
  return NextResponse.json(awards)
}

export async function POST(request: Request) {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const award = await request.json()
    const awards = readAwards()
    
    // 生成ID
    award.id = Date.now().toString()
    award.createdAt = new Date().toISOString()
    
    awards.push(award)
    const success = writeAwards(awards)

    if (success) {
      return NextResponse.json({ success: true, id: award.id })
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
    const updatedAward = await request.json()
    const awards = readAwards()
    
    const index = awards.findIndex((a: any) => a.id === updatedAward.id)
    if (index === -1) {
      return NextResponse.json({ error: '记录不存在' }, { status: 404 })
    }

    awards[index] = { ...awards[index], ...updatedAward }
    const success = writeAwards(awards)

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

    const awards = readAwards()
    const filtered = awards.filter((a: any) => a.id !== id)
    const success = writeAwards(filtered)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '删除失败' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: '请求错误' }, { status: 400 })
  }
}

