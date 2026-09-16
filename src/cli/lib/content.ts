import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { slugify } from './slug.js'
import type { Article, ArticleFrontmatter, ArticleMatch } from './types.js'

export type { Article, ArticleFrontmatter, ArticleMatch } from './types.js'

const CONTENT_DIR = 'content'

export function contentDir(root: string): string {
  return path.join(root, CONTENT_DIR)
}

function yamlString(value: string): string {
  // 双引号 YAML 与 JSON 字符串转义规则兼容。
  return JSON.stringify(value)
}

export function serializeFrontmatter(frontmatter: ArticleFrontmatter): string {
  const tags = frontmatter.tags.length
    ? frontmatter.tags.map((tag) => `  - ${yamlString(tag)}`).join('\n')
    : '  []'
  return [
    '---',
    `title: ${yamlString(frontmatter.title)}`,
    `description: ${yamlString(frontmatter.description)}`,
    `category: ${yamlString(frontmatter.category)}`,
    'tags:',
    tags,
    `date: ${yamlString(frontmatter.date)}`,
    `updated: ${yamlString(frontmatter.updated)}`,
    `featured: ${frontmatter.featured ? 'true' : 'false'}`,
    '---',
    '',
  ].join('\n')
}

export function serializeArticle(frontmatter: ArticleFrontmatter, body: string): string {
  const normalizedBody = body.replace(/\r\n/g, '\n').trimEnd()
  return `${serializeFrontmatter(frontmatter)}${normalizedBody}\n`
}

function normalizeRelPath(relPath: string): string {
  return relPath.replace(/\\/g, '/').replace(/^\.\//, '')
}

function parseArticleFile(filePath: string, relPath: string): Article {
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = matter(raw)
  const data = parsed.data as Record<string, unknown>

  const title = String(data.title ?? '').trim() || path.posix.basename(relPath, '.md')
  const description = String(data.description ?? '').trim()
  const category = String(data.category ?? '').trim() || path.posix.dirname(relPath)
  const date = String(data.date ?? '').trim()
  const updated = String(data.updated ?? '').trim() || date

  let tags: string[] = []
  if (Array.isArray(data.tags)) {
    tags = data.tags.map((tag) => String(tag).trim()).filter(Boolean)
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
  }

  return {
    relPath: normalizeRelPath(relPath),
    slug: normalizeRelPath(relPath).replace(/\.md$/, ''),
    filePath,
    title,
    description,
    category,
    tags,
    date,
    updated,
    featured: Boolean(data.featured),
    body: parsed.content,
  }
}

/** 读取 content/ 下的全部文章，按 updated 倒序排列。 */
export function listArticles(root: string): Article[] {
  const dir = contentDir(root)
  if (!fs.existsSync(dir)) return []

  const files: string[] = []
  const walk = (current: string): void => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.isFile() && entry.name.endsWith('.md')) files.push(full)
    }
  }
  walk(dir)
  files.sort()

  return files
    .map((file) => {
      const relPath = path.relative(dir, file).split(path.sep).join('/')
      return parseArticleFile(file, relPath)
    })
    .sort((a, b) => (b.updated || b.date || '').localeCompare(a.updated || a.date || ''))
}

/** 将用户输入的相对路径解析为 content/ 内的绝对路径，阻止目录穿越。 */
export function resolveArticlePath(root: string, relPath: string): string {
  const base = path.resolve(contentDir(root))
  const full = path.resolve(base, normalizeRelPath(relPath))
  const prefix = base.endsWith(path.sep) ? base : `${base}${path.sep}`
  if (full !== base && !full.startsWith(prefix)) {
    throw new Error(`路径必须在 content/ 目录内：${relPath}`)
  }
  return full
}

/**
 * 按引用查找文章。支持：
 * - javascript/event-loop（分类/文件名）
 * - javascript-event-loop（网站使用的完整 slug）
 * - event-loop（仅文件名）
 */
export function findArticlesBySlug(root: string, ref: string): Article[] {
  const normalized = normalizeRelPath(ref.trim()).replace(/\.md$/, '').replace(/^\/+/, '')
  if (!normalized) return []

  const articles = listArticles(root)
  const byPath = articles.filter((article) => article.slug === normalized)
  if (byPath.length > 0) return byPath

  const fullSlug = normalized.replace(/\//g, '-')
  const byFullSlug = articles.filter((article) => article.slug.replace(/\//g, '-') === fullSlug)
  if (byFullSlug.length > 0) return byFullSlug

  // 兼容「react/server-components」→ react/react-server-components 这类
  // 目录名被 slug 自动前缀的常见写法。
  if (normalized.includes('/')) {
    const dir = path.posix.dirname(normalized)
    const base = path.posix.basename(normalized)
    const prefixed = `${dir}-${base}`
    const byDirPrefix = articles.filter(
      (article) =>
        path.posix.dirname(article.slug) === dir && path.posix.basename(article.slug) === prefixed,
    )
    if (byDirPrefix.length > 0) return byDirPrefix
  }

  const base = path.posix.basename(normalized)
  return articles.filter((article) => path.posix.basename(article.slug) === base)
}

export function findArticle(root: string, ref: string): Article | null {
  const matches = findArticlesBySlug(root, ref)
  if (matches.length === 1) return matches[0]
  if (matches.length > 1) {
    const list = matches.map((article) => `  - ${article.slug}`).join('\n')
    throw new Error(`匹配到多篇文章：\n${list}`)
  }
  return null
}

export function readArticleByPath(root: string, relPath: string): Article {
  const full = resolveArticlePath(root, relPath)
  if (!fs.existsSync(full)) {
    throw new Error(`文章不存在：${relPath}`)
  }
  return parseArticleFile(full, normalizeRelPath(relPath))
}

export interface CreateArticleInput {
  relPath: string
  frontmatter: ArticleFrontmatter
  body: string
}

export function createArticle(root: string, input: CreateArticleInput): Article {
  const relPath = normalizeRelPath(input.relPath)
  const full = resolveArticlePath(root, relPath)
  if (fs.existsSync(full)) {
    throw new Error(`文章已存在：${relPath}`)
  }
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, serializeArticle(input.frontmatter, input.body), 'utf8')
  return parseArticleFile(full, relPath)
}

export function updateArticle(
  root: string,
  relPath: string,
  frontmatter: ArticleFrontmatter,
  body: string,
): Article {
  const normalized = normalizeRelPath(relPath)
  const full = resolveArticlePath(root, normalized)
  if (!fs.existsSync(full)) {
    throw new Error(`文章不存在：${normalized}`)
  }
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, serializeArticle(frontmatter, body), 'utf8')
  return parseArticleFile(full, normalized)
}

function pruneEmptyDirs(dir: string, stopAt: string): void {
  let current = dir
  while (current !== stopAt && current.startsWith(`${stopAt}${path.sep}`)) {
    try {
      if (fs.readdirSync(current).length === 0) {
        fs.rmdirSync(current)
        current = path.dirname(current)
      } else {
        break
      }
    } catch {
      break
    }
  }
}

export function deleteArticle(root: string, relPath: string): void {
  const normalized = normalizeRelPath(relPath)
  const full = resolveArticlePath(root, normalized)
  if (!fs.existsSync(full)) {
    throw new Error(`文章不存在：${normalized}`)
  }
  fs.rmSync(full)
  pruneEmptyDirs(path.dirname(full), contentDir(root))
}

function makeSnippet(body: string, query: string, radius = 60): string {
  const lower = body.toLowerCase()
  const index = lower.indexOf(query)
  if (index < 0) return body.replace(/\s+/g, ' ').trim().slice(0, 120)
  const start = Math.max(0, index - radius)
  const end = Math.min(body.length, index + query.length + radius)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < body.length ? '…' : ''
  return `${prefix}${body.slice(start, end).replace(/\s+/g, ' ').trim()}${suffix}`
}

/** 在 title / description / tags / 正文中搜索。 */
export function searchArticles(root: string, query: string): ArticleMatch[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: ArticleMatch[] = []
  for (const article of listArticles(root)) {
    const matchedIn: string[] = []
    if (article.title.toLowerCase().includes(q)) matchedIn.push('title')
    if (article.description.toLowerCase().includes(q)) matchedIn.push('description')
    if (article.tags.some((tag) => tag.toLowerCase().includes(q))) matchedIn.push('tags')
    if (article.body.toLowerCase().includes(q)) matchedIn.push('body')
    if (matchedIn.length === 0) continue
    results.push({ article, matchedIn, snippet: makeSnippet(article.body, q) })
  }
  return results
}

/** 去重后的分类显示名列表。 */
export function listCategories(root: string): string[] {
  const seen = new Set<string>()
  for (const article of listArticles(root)) {
    if (article.category) seen.add(article.category)
  }
  return [...seen]
}

/**
 * 根据分类显示名确定目录名：
 * 优先复用已有文章所在目录，否则对分类名做 slugify。
 */
export function categoryDirFor(root: string, category: string): string {
  const existing = listArticles(root).find((article) => article.category === category)
  if (existing) return path.posix.dirname(existing.slug)
  return slugify(category) || 'uncategorized'
}
