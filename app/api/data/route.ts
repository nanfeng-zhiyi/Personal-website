import { NextResponse } from 'next/server'

export async function GET() {
  // 模拟从数据库获取数据
  const data = {
    users: [
      { id: 1, name: '张三', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', email: 'lisi@example.com' },
      { id: 3, name: '王五', email: 'wangwu@example.com' },
    ],
    stats: {
      totalUsers: 3,
      activeUsers: 2,
      createdAt: new Date().toISOString(),
    },
  }

  return NextResponse.json(data)
}

