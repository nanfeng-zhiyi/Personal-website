import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import { readProfile, writeProfile } from '@/lib/data'

export async function GET() {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const profile = readProfile()
  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  const isAuthenticated = await verifySession()
  if (!isAuthenticated) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const success = writeProfile(data)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: '保存失败' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: '请求错误' }, { status: 400 })
  }
}

