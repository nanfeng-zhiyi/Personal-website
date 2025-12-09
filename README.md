# 个人网站

这是一个使用 Next.js 构建的全栈个人网站，所有后端逻辑都集成在前端代码中，无需独立的后端服务器。

## 技术栈

- **Next.js 14** - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 现代化样式设计
- **API Routes** - 后端逻辑集成

## 快速开始

### 1. 安装依赖

```bash
npm install
```

或者使用 yarn:

```bash
yarn install
```

### 2. 启动开发服务器

```bash
npm run dev
```

或者使用 yarn:

```bash
yarn dev
```

### 3. 打开浏览器

访问 [http://localhost:3000](http://localhost:3000) 查看网站

## 项目结构

```
website/
├── app/
│   ├── api/              # API Routes（后端逻辑）
│   │   ├── hello/
│   │   ├── time/
│   │   └── data/
│   ├── about/            # 关于页面
│   ├── api-demo/         # API 演示页面
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── public/               # 静态资源
├── package.json
├── tailwind.config.js    # Tailwind 配置
└── tsconfig.json         # TypeScript 配置
```

## 功能特性

- ✅ 美观的现代化 UI 设计
- ✅ 响应式布局，支持移动端
- ✅ 深色模式支持
- ✅ API Routes 示例（后端逻辑）
- ✅ TypeScript 类型安全
- ✅ 服务端渲染（SSR）

## 开发命令

- `npm run dev` - 启动开发服务器（本地运行）
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行代码检查

## API Routes

所有后端逻辑都在 `app/api` 目录中：

- `/api/hello` - 返回问候语
- `/api/time` - 返回服务器时间
- `/api/data` - 返回示例数据

你可以在这些文件中添加任何后端逻辑，如数据库操作、文件处理、第三方 API 调用等。

## 部署

这个项目可以轻松部署到：

- **Vercel**（推荐）- 一键部署，完全免费
- **Netlify** - 同样支持 Next.js
- **其他平台** - 任何支持 Node.js 的平台


