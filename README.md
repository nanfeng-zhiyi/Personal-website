# Personal Website

This is a full-stack personal website built with Next.js. All backend logic is integrated into the frontend code, so no separate backend server is needed.

## Tech Stack

- **Next.js 14** - React full-stack framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **API Routes** - Integrated backend logic

## Quick Start

### 1. Install dependencies

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 2. Start the development server

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

### 3. Open the browser

Visit [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
website/
├── app/
│   ├── api/              # API Routes (backend logic)
│   │   ├── hello/
│   │   ├── time/
│   │   └── data/
│   ├── about/            # About page
│   ├── api-demo/         # API demo page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
├── package.json
├── tailwind.config.js    # Tailwind config
└── tsconfig.json         # TypeScript config
```

## Features

- ✅ Modern, polished UI
- ✅ Responsive layout with mobile support
- ✅ Dark mode
- ✅ API Routes examples (backend logic)
- ✅ TypeScript type safety
- ✅ Server-Side Rendering (SSR)

## Development Commands

- `npm run dev` - Start the dev server (local)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run linting

## API Routes

All backend logic lives in the `app/api` directory:

- `/api/hello` - Returns a greeting
- `/api/time` - Returns server time
- `/api/data` - Returns sample data

You can add any backend logic here, such as database operations, file handling, or third-party API calls.

## Deployment

This project can be easily deployed to:

- **Vercel** (recommended) - One-click deploy, fully free
- **Netlify** - Also supports Next.js
- **Other platforms** - Any platform that supports Node.js

