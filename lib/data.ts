import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

// 确保数据目录存在（延迟执行，避免阻塞）
function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true })
    } catch (error) {
      console.error('创建数据目录失败:', error)
    }
  }
}

// 不在模块加载时执行，避免阻塞

const profileFile = path.join(dataDir, 'profile.json')
const awardsFile = path.join(dataDir, 'awards.json')
const blogFile = path.join(dataDir, 'blog.json')
const momentsFile = path.join(dataDir, 'moments.json')
const publicationsFile = path.join(dataDir, 'publications.json')
const settingsFile = path.join(dataDir, 'settings.json')
const homeFile = path.join(dataDir, 'home.json')

// 初始化默认数据
const defaultProfile = {
  name: '你的名字',
  title: '全栈开发者',
  email: 'your.email@example.com',
  location: '中国',
  avatar: '',
  bio: '热爱编程，专注于全栈开发和现代化 Web 技术。致力于创造优雅、高效的解决方案。',
  education: [
    {
      id: '1',
      school: 'XX大学',
      degree: '计算机科学与技术',
      period: '2018 - 2022',
      description: '主修课程：数据结构、算法、操作系统、计算机网络等',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript/TypeScript', level: 90 },
    { id: '2', name: 'React/Next.js', level: 85 },
    { id: '3', name: 'Node.js', level: 80 },
  ],
}

const defaultAwards: any[] = []

const defaultPublications: any[] = []

const defaultBlog: any[] = []

const defaultMoments: any[] = []

const defaultSettings = {
  theme: {
    mode: 'dynamic' as 'dynamic' | 'image',
    backgroundImage: '',
    accentColor: '#0ea5e9',
    glassStyle: 'default' as 'default' | 'liquid',
  },
}

const defaultHome = {
  slides: [
    {
      id: 'welcome',
      title: '欢迎来到我的数字主控台',
      subtitle: 'Explore · Build · Share',
      description: '在这里阅读我的技术博客、了解个人履历，并见证项目与想法的持续演进。',
      ctaLabel: '查看最新博客',
      ctaHref: '/blog',
      image: '',
    },
    {
      id: 'profile',
      title: '一站式个人档案',
      subtitle: 'Profile · Timeline · Skills',
      description: '教育背景、技能谱系与获奖记录被组织成清晰的时间线和能力图谱。',
      ctaLabel: '打开个人档案',
      ctaHref: '/profile',
      image: '',
    },
  ],
}

// 读取数据
export function readProfile() {
  try {
    ensureDataDir()
    if (fs.existsSync(profileFile)) {
      const content = fs.readFileSync(profileFile, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('读取个人信息失败:', error)
  }
  return { ...defaultProfile }
}

export function readAwards() {
  try {
    ensureDataDir()
    if (fs.existsSync(awardsFile)) {
      const content = fs.readFileSync(awardsFile, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('读取获奖记录失败:', error)
  }
  return [...defaultAwards]
}

export function readPublications() {
  try {
    ensureDataDir()
    if (fs.existsSync(publicationsFile)) {
      const content = fs.readFileSync(publicationsFile, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('读取论文列表失败:', error)
  }
  return [...defaultPublications]
}

export function readBlog() {
  try {
    ensureDataDir()
    if (fs.existsSync(blogFile)) {
      const content = fs.readFileSync(blogFile, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('读取博客失败:', error)
  }
  return [...defaultBlog]
}

export function readMoments() {
  try {
    ensureDataDir()
    if (fs.existsSync(momentsFile)) {
      const content = fs.readFileSync(momentsFile, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error('读取动态失败:', error)
  }
  return [...defaultMoments]
}

export function readSettings() {
  try {
    ensureDataDir()
    if (fs.existsSync(settingsFile)) {
      const content = fs.readFileSync(settingsFile, 'utf-8')
      const parsed = JSON.parse(content)
      return { ...defaultSettings, ...parsed }
    }
  } catch (error) {
    console.error('读取站点设置失败:', error)
  }
  return { ...defaultSettings }
}

export function readHome() {
  try {
    ensureDataDir()
    if (fs.existsSync(homeFile)) {
      const content = fs.readFileSync(homeFile, 'utf-8')
      const parsed = JSON.parse(content)
      return { ...defaultHome, ...parsed }
    }
  } catch (error) {
    console.error('读取首页数据失败:', error)
  }
  return { ...defaultHome }
}

// 写入数据
export function writeProfile(data: any) {
  try {
    ensureDataDir()
    fs.writeFileSync(profileFile, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入个人信息失败:', error)
    return false
  }
}

export function writeAwards(data: any[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(awardsFile, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入获奖记录失败:', error)
    return false
  }
}

export function writePublications(data: any[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(publicationsFile, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入论文列表失败:', error)
    return false
  }
}

export function writeBlog(data: any[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(blogFile, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入博客失败:', error)
    return false
  }
}

export function writeMoments(data: any[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(momentsFile, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入动态失败:', error)
    return false
  }
}

export function writeSettings(data: any) {
  try {
    ensureDataDir()
    fs.writeFileSync(settingsFile, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入站点设置失败:', error)
    return false
  }
}

export function writeHome(data: any) {
  try {
    ensureDataDir()
    fs.writeFileSync(homeFile, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('写入首页数据失败:', error)
    return false
  }
}

