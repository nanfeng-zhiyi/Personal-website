/**
 * 格式化时间显示
 * 比较近的显示相对时间（几分钟前、几小时前等）
 * 时间较长的显示具体日期和时间
 */
export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return ''
  
  try {
    const date = new Date(dateStr)
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateStr // 如果日期无效，返回原始字符串
    }
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    // 如果日期在未来，返回原始日期
    if (diff < 0) {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
    
    // 秒
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) {
      return seconds < 10 ? '刚刚' : `${seconds}秒前`
    }
    
    // 分钟
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 60) {
      return `${minutes}分钟前`
    }
    
    // 小时
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 24) {
      return `${hours}小时前`
    }
    
    // 天
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 1) {
      return '昨天'
    }
    if (days < 7) {
      return `${days}天前`
    }
    
    // 超过7天，显示具体日期和时间
    const isSameYear = date.getFullYear() === now.getFullYear()
    
    if (isSameYear) {
      // 同年：显示月日和时间
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      // 不同年：显示年月日和时间
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  } catch (error) {
    // 如果解析失败，返回原始字符串
    return dateStr
  }
}

/**
 * 格式化完整日期时间
 */
export function formatFullDateTime(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return dateStr
  }
}

/**
 * 格式化日期（不包含时间）
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

