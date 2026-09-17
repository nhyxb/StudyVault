import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'

// 按需加载常用语言的 Prism 高亮组件
loadLanguages([
  'markup-templating',
  'typescript',
  'jsx',
  'tsx',
  'json',
  'bash',
  'css',
  'python',
  'markdown',
  'c',
  'cpp',
  'java',
  'go',
  'rust',
  'sql',
  'yaml',
])

const langAliases = {
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  json: 'json',
  jsonc: 'json',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  css: 'css',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  markup: 'markup',
  py: 'python',
  python: 'python',
  md: 'markdown',
  markdown: 'markdown',
  text: 'plain',
  txt: 'plain',
  plain: 'plain',
  http: 'plain',
  yaml: 'yaml',
  yml: 'yaml',
  sql: 'sql',
  c: 'c',
  cpp: 'cpp',
  java: 'java',
  go: 'go',
  rust: 'rust',
}

const marked = new Marked(
  markedHighlight({
    langPrefix: 'language-',
    highlight(code, lang) {
      const language = langAliases[String(lang || '').trim().toLowerCase()] || 'plain'
      if (language === 'plain' || !Prism.languages[language]) {
        return Prism.util.encode(code)
      }
      try {
        return Prism.highlight(code, Prism.languages[language], language)
      } catch (error) {
        console.warn(`[generate-content] 代码高亮失败（${lang}）：`, error?.message ?? error)
        return Prism.util.encode(code)
      }
    },
  }),
  {
    // 给正文标题补上 id，目录（TableOfContents）的滚动定位依赖它。
    // id 与 extractHeadings 共用 createHeadingId，保证两边永远一致。
    renderer: {
      heading({ tokens, depth }) {
        const text = rawText(tokens)
        return `<h${depth} id="${escapeHtml(headingId(text))}">${this.parser.parseInline(tokens)}</h${depth}>\n`
      },
    },
  },
)

marked.setOptions({ gfm: true, breaks: false })

function stripMdFormatting(text) {
  return text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .trim()
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 取标题 token 的纯文本，用于生成与目录一致的 id（`code` 会保留反引号，交由 stripMdFormatting 处理）。 */
function rawText(tokens) {
  return (tokens ?? [])
    .map((token) => {
      if (typeof token?.text === 'string') return token.text
      if (Array.isArray(token?.tokens)) return rawText(token.tokens)
      return ''
    })
    .join('')
}

/** 标题 id：与目录数据同源，同一标题重复出现时追加 -2、-3。 */
function headingId(rawTitle) {
  return slugify(stripMdFormatting(rawTitle))
}

function readingTime(text) {
  if (!text) return 1
  const cjk = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length
  const words = (text.match(/[A-Za-z0-9]+/g) || []).length
  return Math.max(1, Math.round(cjk / 400 + words / 220))
}

function extractHeadings(markdown) {
  const lines = markdown.split(/\r?\n/)
  const headings = []
  const used = new Map()
  let inFence = false

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const level = match[1].length
    const text = stripMdFormatting(match[2])
    const base = headingId(text) || `section-${headings.length + 1}`
    const count = used.get(base) || 0
    used.set(base, count + 1)
    const id = count > 0 ? `${base}-${count + 1}` : base
    headings.push({ id, text, level })
  }
  return headings
}

/**
 * 读取 content/ 目录下的全部 Markdown，
 * 生成 src/data/content.generated.ts（文章、分类、标签数据）。
 * 当 writeSitemap 为 true 时，同时写出 sitemap.xml 与 robots.txt。
 */
export async function generateContent({
  root = process.cwd(),
  outDir = 'dist',
  siteUrl = '',
  writeSitemap = false,
} = {}) {
  const contentDir = path.join(root, 'content')
  if (!fs.existsSync(contentDir)) {
    throw new Error(`找不到 content 目录：${contentDir}`)
  }

  const files = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.md')) files.push(full)
    }
  }
  walk(contentDir)
  files.sort()

  const posts = []
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8')
    const { data, content } = matter(raw)
    const rel = path.relative(contentDir, file).split(path.sep).join('/')
    const slug = rel.replace(/\.md$/, '').split('/').join('-')

    const title = String(data.title ?? '').trim()
    const description = String(data.description ?? '').trim()
    const category = String(data.category ?? '').trim()
    const tags = Array.isArray(data.tags)
      ? data.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : []
    const date = String(data.date ?? '').trim()
    const updated = String(data.updated ?? data.date ?? '').trim()
    const featured = Boolean(data.featured)

    if (!title || !description || !category || !date) {
      console.warn(`[generate-content] 跳过 ${rel}：frontmatter 缺少 title / description / category / date`)
      continue
    }

    const html = marked.parse(content)
    const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const headings = extractHeadings(content)

    posts.push({
      slug,
      title,
      description,
      category,
      tags,
      date,
      updated: updated || date,
      featured,
      readingTime: readingTime(plainText),
      headings,
      plainText,
      html,
    })
  }

  posts.sort((a, b) => (b.updated || b.date).localeCompare(a.updated || a.date))

  const categoryMap = new Map()
  const tagMap = new Map()
  for (const post of posts) {
    categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1)
    for (const tag of post.tags) tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
  }

  const categories = [...categoryMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))

  const tags = [...tagMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))

  const outFile = path.join(root, 'src', 'data', 'content.generated.ts')
  fs.mkdirSync(path.dirname(outFile), { recursive: true })

  const header = `/* eslint-disable */
/**
 * 本文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑。
 * 修改 content/ 下的 Markdown 后运行 \`npm run generate\` 重新生成。
 */
import type { CategoryInfo, Post, TagInfo } from '../types'

`
  const body =
    `export const posts: Post[] = ${JSON.stringify(posts, null, 2)}\n\n` +
    `export const categories: CategoryInfo[] = ${JSON.stringify(categories, null, 2)}\n\n` +
    `export const tags: TagInfo[] = ${JSON.stringify(tags, null, 2)}\n`

  fs.writeFileSync(outFile, header + body, 'utf8')
  console.log(`[generate-content] 已生成 ${posts.length} 篇文章 → ${path.relative(root, outFile)}`)

  if (writeSitemap && siteUrl && outDir) {
    const distDir = path.join(root, outDir)
    fs.mkdirSync(distDir, { recursive: true })

    const latestUpdated = posts.length > 0 ? posts[0].updated || posts[0].date : ''
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${latestUpdated}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
    const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8')
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf8')
    console.log('[generate-content] 已生成 sitemap.xml 与 robots.txt')
  }
}

const isDirectRun =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])

if (isDirectRun) {
  generateContent().catch((error) => {
    console.error('[generate-content] 失败：', error)
    process.exit(1)
  })
}
