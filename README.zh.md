# AI Affiliate Programs

一个开源的、无数据库架构的开发者工具资源导航平台。

## 致谢
本网站代码基于[devtoolset](https://github.com/iAmCorey/devtoolset)进行二次开发，感谢原作者的开源贡献！

## 功能特点

- **无数据库架构**：使用 GitHub 进行内容存储和管理
- **动态内容渲染**：使用 Next.js 服务端渲染
- **Markdown 支持**：使用 Markdown 格式编写内容
- **管理界面**：内置管理面板进行内容管理
- **响应式设计**：使用 Tailwind CSS 实现全响应式设计
- **SEO 友好**：优化的动态元数据
- **国际化支持**：支持中英文切换

## 路由结构

### 页面路由

- `/` - 首页
  - 展示开发工具导航
  - 支持工具搜索和分类浏览

- `/[locale]/category` - 分类页面
  - 按字母顺序展示所有工具分类
  - 支持分类导航和筛选

- `/[locale]/article` - 文章列表页面
  - 展示所有技术文章
  - 支持文章预览和阅读

- `/[locale]/changelog` - 更新日志页面
  - 展示网站更新历史
  - 记录功能变更和优化

- `/[locale]/login` - 登录页面
  - 管理员登录入口
  - 基于密码的认证系统

- `/admin` - 管理后台（需要认证）
  - 内容管理
  - 文章编辑
  - 工具管理

### API 路由

#### 认证相关
- `/api/login` (POST)
  - 管理员登录
  - 设置认证 Cookie

- `/api/logout` (POST)
  - 退出登录
  - 清除认证 Cookie

- `/api/check-auth` (GET)
  - 检查用户登录状态

#### 内容管理
- `/api/articles` 
  - GET: 获取文章列表
  - POST: 更新文章内容

- `/api/articles/create` (POST)
  - 创建新文章

- `/api/getCategory` 
  - GET: 获取分类列表
  - POST: 更新分类信息

- `/api/getSrc` 
  - GET: 获取资源内容
  - POST: 更新资源内容

## 技术实现

### 认证流程
- 使用环境变量 `ACCESS_PASSWORD` 存储管理员密码
- JWT token 存储在 httpOnly cookie 中
- 中间件进行路由保护（/admin 路径）

### 内容管理
- 使用 GitHub API 进行内容存储
- Markdown 格式支持
- 文章元数据使用 Front Matter 格式

### 国际化
- 使用 next-intl 实现多语言支持
- 支持中英文动态切换
- 路由级别的语言处理

### SEO 优化
- 动态生成 sitemap.xml
- 自动生成 robots.txt
- 页面级别的元数据优化

## 环境变量配置

项目需要配置以下环境变量：

```plaintext
ACCESS_PASSWORD=管理员密码
GITHUB_TOKEN=GitHub API 访问令牌
GITHUB_OWNER=仓库所有者
GITHUB_REPO=仓库名称
```
### GitHub 配置说明
由于项目采用无数据库架构，所有的内容（工具数据、文章等）都存储在 GitHub 仓库中。为了能够通过 API 读写这些内容，需要配置以下参数：

1. GITHUB_TOKEN
   
   - 用途：授权应用访问 GitHub API
   - 获取方式：在 GitHub 个人设置的 Developer settings > Personal access tokens 中生成
   - 所需权限：repo（读写仓库内容）
   - 安全提示：token 应妥善保管，不要泄露或提交到代码仓库中
2. GITHUB_OWNER
   
   - 用途：指定内容存储仓库的所有者（用户名或组织名）
   - 示例：如仓库地址为 github.com/username/repo ，则 owner 为 username
3. GITHUB_REPO
   
   - 用途：指定存储内容的具体仓库名称
   - 示例：如仓库地址为 github.com/username/repo ，则 repo 为 repo
这三个配置共同工作，使应用能够：

- 读取工具数据和文章内容
- 通过管理界面更新内容
- 同步文章变更
- 管理多语言资源

## 开发说明
1. 工具数据存储在 data/json/[locale]/tools/ 目录
2. 文章内容存储在 data/md/ 目录
3. 翻译文件位于 messages/ 目录

