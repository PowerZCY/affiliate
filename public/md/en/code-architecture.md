---
id: "code-architecture"
title: "Space-Brain 代码架构设计文档"
slug: "code-architecture"
excerpt: "详细的技术架构设计，包括技术栈选型、项目结构、核心模块设计等完整开发指南。"
tags: ["development", "architecture"]
author:
  name: "帝八哥"
  avatar: "/images/default.webp"
publishedAt: "2024-01-22"
readTime: "15 min"
imageUrl: "/images/code-architecture.webp"
featured: false
---

# Space-Brain 代码架构设计文档

## 1. 技术栈概述

### 1.1 前端技术
- **框架**: Next.js 14 (App Router)
- **包管理**: pnpm
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **图标**: Lucide React
- **国际化**: next-intl

### 1.2 后端技术
- **API**: Next.js API Routes
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js

### 1.3 开发工具
- **版本控制**: Git
- **代码规范**: ESLint, Prettier
- **测试**: Jest, React Testing Library

## 2. 项目结构 
space-brain/
├── .github/ # GitHub 工作流配置
├── docs/ # 项目文档
├── prisma/ # Prisma 模式和迁移
├── public/ # 静态资源
├── src/
│ ├── app/ # Next.js App Router 路由
│ │ ├── [locale]/ # 国际化路由
│ │ │ ├── (marketing) # 营销页面路由组
│ │ │ ├── (dashboard) # 仪表板页面路由组
│ │ │ ├── api/ # API 路由
│ │ │ └── ...
│ │ └── ...
│ ├── components/ # React 组件
│ │ ├── ui/ # UI 基础组件
│ │ ├── marketing/ # 营销相关组件
│ │ ├── dashboard/ # 仪表板相关组件
│ │ └── ...
│ ├── lib/ # 工具函数和库
│ │ ├── utils.ts # 通用工具函数
│ │ ├── db.ts # 数据库客户端
│ │ └── ...
│ ├── hooks/ # 自定义 React Hooks
│ ├── styles/ # 全局样式
│ ├── types/ # TypeScript 类型定义
│ ├── messages/ # 国际化消息
│ │ ├── en.json # 英文翻译
│ │ └── zh.json # 中文翻译
│ └── ...
├── .eslintrc.js # ESLint 配置
├── .gitignore # Git 忽略文件
├── .prettierrc # Prettier 配置
├── next.config.js # Next.js 配置
├── package.json # 项目依赖
├── postcss.config.js # PostCSS 配置
├── tailwind.config.js # Tailwind CSS 配置
└── tsconfig.json # TypeScript 配置

## 3. 核心模块设计

### 3.1 页面路由结构

- **营销页面** (`/app/[locale]/(marketing)/`)
  - 首页 (`/`)
  - 产品页面 (`/products/[productId]`)
  - 解决方案 (`/solutions`)
  - 定价 (`/pricing`)
  - 下载 (`/download`)
  - 关于我们 (`/about`)
  - 博客 (`/blog`)

- **仪表板页面** (`/app/[locale]/(dashboard)/`)
  - 用户仪表板 (`/dashboard`)
  - 账户设置 (`/settings`)
  - 许可证管理 (`/licenses`)

- **API 路由** (`/app/api/`)
  - 认证 (`/auth/[...]`)
  - 产品 (`/products/[...]`)
  - 用户 (`/users/[...]`)
  - 订阅 (`/subscriptions/[...]`)

### 3.2 数据模型

```prisma
// 用户模型
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  licenses      License[]
}

// 产品模型
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  features    Json
  imageUrl    String?
  price       Float?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  licenses    License[]
  versions    ProductVersion[]
}

// 产品版本模型
model ProductVersion {
  id          String   @id @default(cuid())
  version     String
  releaseDate DateTime
  changelog   String
  downloadUrl String
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 许可证模型
model License {
  id         String   @id @default(cuid())
  key        String   @unique
  type       LicenseType
  validUntil DateTime?
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// 博客文章模型
model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  excerpt   String?
  imageUrl  String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 枚举类型
enum Role {
  USER
  ADMIN
}

enum LicenseType {
  TRIAL
  PERSONAL
  PROFESSIONAL
  ENTERPRISE
}
```

### 3.3 组件设计

#### 3.3.1 UI 组件
基于 shadcn/ui 构建的基础组件，包括：
- Button
- Card
- Dialog
- Dropdown
- Form 元素
- Navigation
- Tabs
- Toast

#### 3.3.2 布局组件
- `RootLayout`: 应用根布局
- `MarketingLayout`: 营销页面布局
- `DashboardLayout`: 仪表板页面布局

#### 3.3.3 业务组件
- `ProductCard`: 产品展示卡片
- `PricingTable`: 定价表格
- `FeatureComparison`: 功能对比
- `DownloadButton`: 下载按钮
- `LicenseManager`: 许可证管理界面

## 4. 状态管理

### 4.1 服务器组件
- 使用 Next.js 14 的服务器组件获取数据
- 通过 props 和上下文传递数据

### 4.2 客户端状态
- 使用 React 的 useState 和 useReducer 管理局部状态
- 使用 React Context 管理跨组件状态

## 5. API 设计

### 5.1 RESTful API
- 遵循 RESTful 设计原则
- 使用 Next.js API Routes 实现

### 5.2 主要端点
- `/api/auth/*`: 认证相关
- `/api/products`: 产品管理
- `/api/users`: 用户管理
- `/api/licenses`: 许可证管理
- `/api/blog`: 博客文章管理

## 6. 国际化策略

### 6.1 路由结构
- 使用 next-intl 的动态路由 `[locale]`
- 支持的语言: 英文 (en), 中文 (zh)

### 6.2 翻译文件
- 使用 JSON 格式的翻译文件
- 按照功能模块组织翻译内容

## 7. 性能优化

### 7.1 静态生成
- 尽可能使用静态生成 (SSG)
- 利用增量静态再生成 (ISR) 更新内容

### 7.2 图像优化
- 使用 Next.js Image 组件
- 实现响应式图像和延迟加载

### 7.3 代码分割
- 自动路由级代码分割
- 动态导入大型组件

## 8. 安全考虑

### 8.1 认证与授权
- 使用 NextAuth.js 实现安全认证
- 基于角色的访问控制

### 8.2 数据保护
- 输入验证和清理
- CSRF 保护
- 安全的 HTTP 头部

## 9. 测试策略

### 9.1 单元测试
- 使用 Jest 测试工具函数和钩子

### 9.2 组件测试
- 使用 React Testing Library 测试组件

### 9.3 集成测试
- 测试页面和 API 路由

## 10. 部署流程

### 10.1 CI/CD
- GitHub Actions 自动化工作流
- 自动测试和构建

### 10.2 环境
- 开发环境
- 预发布环境
- 生产环境

### 10.3 监控
- 错误跟踪
- 性能监控
- 用户分析

