import { NextResponse } from 'next/server'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: '密码不能为空' }, { status: 400 })
    }

    const isValid = await verifyPassword(password)

    if (!isValid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }

    await createSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}

