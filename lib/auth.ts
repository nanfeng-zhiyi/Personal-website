import { cookies } from 'next/headers'
import crypto from 'crypto'

// 简单的密码哈希（生产环境应使用 bcrypt）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-this'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + SESSION_SECRET).digest('hex')
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hashed = hashPassword(password)
  const correctHash = hashPassword(ADMIN_PASSWORD)
  return hashed === correctHash
}

export async function createSession(): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天
  
  const cookieStore = await cookies()
  cookieStore.set('admin_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
  })
  
  return sessionId
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

