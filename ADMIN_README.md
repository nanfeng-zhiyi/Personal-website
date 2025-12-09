# 管理后台使用指南

## 概述

管理后台允许你动态管理网站内容，包括个人信息、获奖记录和博客文章。所有数据存储在 `data/` 目录下的 JSON 文件中。

## 快速开始

### 1. 访问管理后台

访问 `/admin` 路径，系统会自动跳转到登录页面。

### 2. 登录

默认密码：`admin123`

**重要：** 在生产环境中，请设置环境变量 `ADMIN_PASSWORD` 来修改密码：

```bash
# .env.local
ADMIN_PASSWORD=你的强密码
SESSION_SECRET=你的随机密钥
```

### 3. 管理内容

登录后，你可以：

- **个人信息管理** (`/admin/profile`)
  - 编辑姓名、职位、邮箱、位置、简介
  - 管理教育经历和技能

- **获奖记录管理** (`/admin/awards`)
  - 添加、编辑、删除获奖记录
  - 包含奖项名称、等级、年份、描述

- **博客管理** (`/admin/blog`)
  - 创建、编辑、删除博客文章
  - 支持 Markdown 格式
  - 设置分类、标签、阅读时间等

## 数据存储

所有数据存储在 `data/` 目录：

- `data/profile.json` - 个人信息
- `data/awards.json` - 获奖记录
- `data/blog.json` - 博客文章

这些文件会在首次使用时自动创建。

## API 端点

### 认证

- `POST /api/admin/login` - 登录
- `POST /api/admin/logout` - 登出

### 个人信息

- `GET /api/admin/profile` - 获取个人信息（需登录）
- `PUT /api/admin/profile` - 更新个人信息（需登录）

### 获奖记录

- `GET /api/admin/awards` - 获取所有获奖记录
- `POST /api/admin/awards` - 创建获奖记录（需登录）
- `PUT /api/admin/awards` - 更新获奖记录（需登录）
- `DELETE /api/admin/awards?id={id}` - 删除获奖记录（需登录）

### 博客

- `GET /api/admin/blog` - 获取所有博客文章
- `POST /api/admin/blog` - 创建博客文章（需登录）
- `PUT /api/admin/blog` - 更新博客文章（需登录）
- `DELETE /api/admin/blog?id={id}` - 删除博客文章（需登录）

## 安全建议

1. **修改默认密码**：在生产环境中必须修改默认密码
2. **使用 HTTPS**：在生产环境中启用 HTTPS
3. **保护数据目录**：确保 `data/` 目录有适当的文件权限
4. **定期备份**：定期备份 `data/` 目录中的数据文件

## 数据格式

### 个人信息格式

```json
{
  "name": "你的名字",
  "title": "全栈开发者",
  "email": "your.email@example.com",
  "location": "中国",
  "bio": "个人简介...",
  "education": [
    {
      "id": "1",
      "school": "XX大学",
      "degree": "计算机科学与技术",
      "period": "2018 - 2022",
      "description": "描述..."
    }
  ],
  "skills": [
    {
      "id": "1",
      "name": "JavaScript/TypeScript",
      "level": 90
    }
  ]
}
```

### 获奖记录格式

```json
[
  {
    "id": "1234567890",
    "title": "奖项名称",
    "level": "一等奖",
    "year": "2021",
    "description": "描述...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 博客文章格式

```json
[
  {
    "id": "1234567890",
    "title": "文章标题",
    "excerpt": "文章摘要...",
    "content": "文章内容（支持 Markdown）",
    "date": "2024-01-15",
    "category": "技术",
    "readTime": "5 分钟",
    "tags": ["Next.js", "React"],
    "author": "你的名字",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
]
```

## 故障排除

### 无法登录

1. 检查环境变量 `ADMIN_PASSWORD` 是否正确设置
2. 清除浏览器 cookies 后重试
3. 检查服务器日志查看错误信息

### 数据未保存

1. 检查 `data/` 目录是否存在且有写入权限
2. 查看服务器日志确认错误信息
3. 确保文件系统有足够的空间

### 页面显示旧数据

1. 清除浏览器缓存
2. 重启开发服务器
3. 检查数据文件是否正确更新

## 扩展功能

未来可以考虑添加：

- 图片上传功能
- Markdown 编辑器
- 数据导入/导出
- 版本历史记录
- 多用户支持

