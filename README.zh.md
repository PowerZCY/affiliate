# AI Affiliate Programs

开源的热门AI工具导航平台
积极拥抱AI，探索AI工具的无限可能

## 功能特点

- **无数据库架构**：使用 GitHub 进行内容存储和管理
- **动态内容渲染**：使用 Next.js 服务端渲染
- **响应式设计**：使用 Tailwind CSS 实现全响应式设计
- **SEO 友好**：优化的动态元数据
- **国际化支持**：支持中英文切换

## 工程结构
```
├── data/                # 数据存储
│   ├── json/            # JSON 格式的工具数据
│   │   ├── en/          # 英文数据
│   │   └── zh/          # 中文数据
│   └── md/              # Markdown 文章
├── messages/            # 国际化翻译文件
│   ├── en.json       
│   └── zh.json
├── src/                 # 源代码
│   ├── app/             # Next.js 应用主目录
│   ├── components/      # 组件
│   └── lib/             # 工具库
└── public/              # 静态资源
```

## 路由结构

### 页面路由

- `/` - 首页
  - 展示开发工具导航
  - 支持工具搜索和分类浏览

- `/[locale]/category` - 分类页面
  - 按字母顺序展示所有工具分类
  - 支持分类导航和筛选


## 开发说明
1. 工具数据存储在 data/json/[locale]/tools/ 目录
2. 文章内容存储在 data/md/ 目录
3. 翻译文件位于 messages/ 目录


## 许可证

[MIT](LICENSE) - Copyright (c) 2025 D8ger