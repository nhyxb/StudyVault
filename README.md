# Study Vault

一个现代、精致的个人学习知识库网站。视觉风格为 **液态玻璃 / Glassmorphism**，使用 React + TypeScript + Vite 构建，内容全部由仓库中的 Markdown 文件驱动，构建时自动生成文章列表、分类、标签与文章页面。

> 记录学习，沉淀知识 —— 把它当作你的「第二大脑」。

## 特性

- 🔍 首页搜索 + 统计（文章 / 分类 / 标签）
- 🗂 学习内容列表：关键词搜索、分类筛选、标签筛选、按更新时间排序
- 📄 内容详情页：Markdown、代码高亮（Prism）、标题目录、引用 / 表格 / 列表 / 代码块
- 🏷 分类页、标签页与对应筛选页
- 🧊 液态玻璃视觉系统：深色默认 + 浅色 / 深色主题切换（localStorage 记忆）
- 🖱 鼠标动效：背景光晕缓慢跟随、卡片 3D tilt、高光跟随、按钮磁吸
- ♿ 完整响应式与可访问性：支持键盘操作、aria-label、prefers-reduced-motion
- 🚀 纯静态站点，使用 hash 路由，完美兼容 GitHub Pages 项目子路径

## 技术栈

- React 19 + TypeScript（严格模式）+ Vite
- 纯 CSS / CSS Modules（无重 UI 框架）
- lucide-react 图标
- gray-matter（frontmatter 解析）+ marked / marked-highlight（Markdown → HTML）+ prismjs（代码高亮）
- GitHub Pages 官方 Actions 自动部署
- `study-cli`：随项目提供的命令行写作工具（commander + prompts + gray-matter）

## 快速开始

```bash
# 安装依赖（npm 或 pnpm 均可）
npm install        # 或 pnpm install

# 本地开发（自动读取 content/ 并生成数据）
npm run dev        # 或 pnpm dev

# 类型检查
npm run typecheck  # 或 pnpm typecheck

# Lint
npm run lint       # 或 pnpm lint

# 生产构建
npm run build      # 或 pnpm build

# 本地预览构建产物
npm run preview    # 或 pnpm preview
```

本地启动后访问终端显示的地址（默认 `http://localhost:5173`）。

## 内容编写

所有学习内容都放在 `content/` 目录下，按主题分子目录（`javascript/`、`frontend/`、`mathematics/`、`computer-science/` 等），文件为 Markdown。

frontmatter 示例：

```markdown
---
title: "理解 JavaScript Event Loop"
description: "从宏任务、微任务和浏览器事件循环理解 JavaScript 异步机制"
category: "JavaScript"
tags:
  - JavaScript
  - Async
  - Browser
date: "2026-09-16"
updated: "2026-09-16"
featured: true
---

# 理解 JavaScript Event Loop

这里放学习内容……
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | ✅ | 文章标题 |
| `description` | ✅ | 摘要（卡片与 SEO 使用） |
| `category` | ✅ | 分类名，构建时自动聚合 |
| `tags` | ✅ | 标签数组，构建时自动聚合 |
| `date` | ✅ | 创建日期（`YYYY-MM-DD`） |
| `updated` | 可选 | 更新日期，默认取 `date` |
| `featured` | 可选 | 是否进入首页「精选内容」 |

添加或修改文章后，重新运行 `npm run dev` / `npm run build` 即可（`predev` / `prebuild` 钩子会自动重新生成数据）。也可以手动运行 `npm run generate`。

## study-cli 命令行工具

`study-cli` 是随项目提供的一个独立 CLI（Node.js + TypeScript），让你不用离开终端即可创建、编辑、删除、搜索、查看和发布 `content/` 下的学习内容。CLI 与网站共享同一份 Markdown 数据源。

### 安装

```bash
# 1. 安装依赖（npm 或 pnpm）
npm install        # 或 pnpm install

# 2. 编译 CLI（输出 dist/cli.js）
npm run build:cli  # 或 pnpm run build:cli

# 3. 全局链接，之后可以在任意目录运行 study
npm link
```

> 提示：`vite build`（`npm run build`）会清空 `dist/` 目录。如果重新构建过网站，请再次运行 `npm run build:cli` 以重建 CLI。

### 常用命令

```bash
study init                              # 检查项目 / Git / content / remote 是否完整
study add "React Server Components"     # 快速创建（自动生成 slug，其余字段交互询问）
study add                               # 完整交互创建
study edit javascript/event-loop        # 按路径直接编辑
study edit                              # 列表选择后编辑
study delete old-note                   # 删除（需二次确认，并自动提交/推送）
study list                              # 查看所有文章
study list --category JavaScript        # 按分类筛选
study list --tag Async                  # 按标签筛选
study search "event loop"               # 搜索标题 / 摘要 / 标签 / 正文
study status                            # 查看 branch、remote、未提交文件、最近提交
study publish                           # 提交并推送 content/（无修改时提示“没有需要发布的内容”）
study config                            # 交互式修改配置（保存到 ~/.study-cli/config.json）
study config show                       # 查看当前配置
study config set defaultCategory JavaScript
```

### 发布流程

- `study publish` 等价于：`git add content/` → `git commit -m "content: update learning notes"` → `git push origin main`。
- 推送前会显示目标 remote 与分支；push 失败会原样显示 Git 报错。
- `study add "标题" --publish` 创建后自动提交推送，提交信息为 `content: add 标题`。
- 不想真的推送时，可用 `study publish --dry-run` 预览将要提交的内容。

### 配置项

配置保存在 `~/.study-cli/config.json`（不会写入任何 GitHub Token）：

| 配置项 | 说明 | 默认值 |
| --- | --- | --- |
| `defaultCategory` | 创建文章时的默认分类 | 空 |
| `defaultEditor` | 编辑器（优先于 `$VISUAL` / `$EDITOR`） | 空 |
| `defaultBranch` | 默认分支 | `main` |
| `autoPush` | 是否自动 push | `false` |
| `confirmBeforeCommit` | Git commit 前是否确认 | `true` |

编辑器解析顺序：`config.defaultEditor` → `$VISUAL` → `$EDITOR` → `code --wait` → `nano`。

### 安全约定

- 删除文章必须二次确认，才会真正删除文件并执行 Git 操作。
- 所有文件操作严格限制在项目 `content/` 目录内（阻止目录穿越）。
- 不会执行 `git reset --hard`、删除 Git 历史等危险操作。
- 不会覆盖未提交的用户修改；发布只会 `git add content/`。

### 开发与测试

```bash
npm run build:cli   # 编译 CLI（tsc -p tsconfig.cli.json）
npm run cli -- --help
npm test            # 编译 CLI 并运行 node:test 测试
npm run typecheck   # 同时类型检查网站与 CLI
```

## 站点配置

1. **站点 URL**：编辑根目录 `.env` 中的 `VITE_SITE_URL`，用于生成 Open Graph、sitemap.xml 与 robots.txt。

   ```
   VITE_SITE_URL=https://你的用户名.github.io/你的仓库名
   ```

2. **标题 / 副标题**：编辑 `src/config/site.ts`。
3. **首页精选数量、热词**：编辑 `src/pages/HomePage.tsx`。
4. **背景壁纸**：只需替换 `public/wallpaper.jpg`（文件名固定，必须保持 `.jpg` 后缀）。

   页面里没有任何壁纸开关或选项，换图后重新 `npm run dev` / `npm run build` 即可生效：

   - 建议尺寸 2400×1500 以上、横向图片，体积控制在 1MB 以内；小屏会自动裁切，无需另做移动端版本。
   - 图片始终按 `cover` 铺满全屏，裁切以中心为基准；想改这个策略，调整 `src/components/Background.module.css` 里的 `.wallpaperImg`。
   - 站点默认深色主题：壁纸会被压暗并叠加光晕，保证正文可读；浅色主题会自动加一层提亮遮罩。
   - 想恢复纯渐变背景，删除 `public/wallpaper.jpg` 即可，加载失败会自动降级，不会出现破图。
   - 部署后 `wallpaper.jpg` 可以被直接访问（例如 `https://你的站点/wallpaper.jpg`），**不要放含个人隐私的图片**。

## 部署到 GitHub Pages

### 方式一：GitHub Actions（推荐，已配置好）

1. 把本项目推送到 GitHub 仓库（默认分支 `main`）。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment** 的 **Source** 中选择 **GitHub Actions**。
4. 推送代码或手动触发 `.github/workflows/deploy.yml`（Actions 标签页 → Deploy to GitHub Pages → Run workflow）。
5. 部署完成后，访问 `https://你的用户名.github.io/仓库名/`。

工作流已正确设置：

- `permissions: contents: read, pages: write, id-token: write`
- 使用官方 `actions/configure-pages`、`actions/upload-pages-artifact`、`actions/deploy-pages`
- `vite.config.ts` 使用 `base: './'`，资源路径为相对路径，**仓库名随意，不需要改任何路径**
- 使用 hash 路由（`#/post/...`），刷新任意页面都不会 404

### 方式二：手动部署

```bash
npm run build
# 把 dist/ 目录内容推送到 gh-pages 分支，或使用任意静态托管平台
```

## 关于路由与 SEO

站点使用 **hash 路由**（`#/`），这是 GitHub Pages 项目子路径下最稳妥的静态方案：无论用户从哪个 URL 进入，服务器都只返回一个 `index.html`，刷新不会 404。

- `index.html` 已包含 title、meta description、Open Graph、favicon。
- 构建时自动生成 `dist/sitemap.xml` 与 `dist/robots.txt`（基于 `.env` 中的 `VITE_SITE_URL`）。
- 如需「无 hash 的路径路由 + 逐文章 SEO」，可改为 BrowserRouter 并在仓库放置 `404.html` 重定向脚本（本项目暂不启用）。

## 目录结构

```
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── content/                       # Markdown 学习内容（内容之源）
│   ├── javascript/
│   ├── frontend/
│   ├── mathematics/
│   └── computer-science/
├── public/                        # favicon、404 重定向、背景壁纸 wallpaper.jpg
├── scripts/
│   └── generate-content.mjs       # 构建期内容生成脚本
├── src/cli/                        # study-cli 源码（commands/ + lib/）
├── tests/                          # CLI 基础测试（node:test）
├── tsconfig.cli.json               # CLI 的 TypeScript 配置
├── src/
│   ├── components/                # 组件（Navbar、PostCard、TiltCard…）
│   ├── pages/                     # 页面（Home、Posts、Post…）
│   ├── layouts/                   # 布局
│   ├── data/                      # 数据访问层（含自动生成的 content.generated.ts）
│   ├── lib/                       # 路由、主题、hooks、工具
│   ├── styles/                    # 全局样式与 Markdown/Prism 样式
│   └── types/                     # TypeScript 类型
├── index.html
├── vite.config.ts
└── package.json
```

## 许可证

MIT
