import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const uploadDir = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

function ensureUploadDir() {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }
}

export async function POST(request: Request) {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
        return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file')

        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: '缺少文件' }, { status: 400 })
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: '仅支持 PNG/JPEG/GIF/WEBP 图像' }, { status: 400 })
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: '文件大小不能超过 15MB' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        ensureUploadDir()

        const ext = path.extname(file.name) || '.png'
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
        const filePath = path.join(uploadDir, filename)

        await fs.promises.writeFile(filePath, buffer)

        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error('上传失败:', error)
        return NextResponse.json({ error: '上传失败' }, { status: 500 })
    }
}


