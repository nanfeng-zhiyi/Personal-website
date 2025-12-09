import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: '你好！这是来自 API Route 的问候',
    timestamp: new Date().toISOString(),
  })
}

