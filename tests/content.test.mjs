import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import {
  createArticle,
  deleteArticle,
  findArticle,
  listArticles,
  readArticleByPath,
  searchArticles,
  serializeArticle,
  serializeFrontmatter,
} from '../dist/lib/content.js'

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'study-cli-test-'))
  fs.mkdirSync(path.join(root, 'content'), { recursive: true })
  return root
}

test('frontmatter 解析', () => {
  const root = makeRoot()
  const frontmatter = {
    title: '测试文章',
    description: '这是摘要',
    category: '测试',
    tags: ['A', 'B'],
    date: '2026-09-16',
    updated: '2026-09-17',
    featured: true,
  }
  createArticle(root, {
    relPath: 'test/hello.md',
    frontmatter,
    body: '# 测试文章\n\n正文内容',
  })
  const article = readArticleByPath(root, 'test/hello.md')
  assert.equal(article.title, '测试文章')
  assert.equal(article.description, '这是摘要')
  assert.equal(article.category, '测试')
  assert.deepEqual(article.tags, ['A', 'B'])
  assert.equal(article.date, '2026-09-16')
  assert.equal(article.updated, '2026-09-17')
  assert.equal(article.featured, true)
  assert.ok(article.body.includes('正文内容'))
  fs.rmSync(root, { recursive: true, force: true })
})

test('frontmatter 序列化格式', () => {
  const text = serializeArticle(
    {
      title: 'Hello World',
      description: 'A summary',
      category: 'JavaScript',
      tags: ['Async', 'Event Loop'],
      date: '2026-09-17',
      updated: '2026-09-17',
      featured: false,
    },
    '# Hello World\n\nBody',
  )
  assert.ok(text.startsWith('---\n'))
  assert.ok(text.includes('title: "Hello World"'))
  assert.ok(text.includes('tags:\n  - "Async"\n  - "Event Loop"'))
  assert.ok(text.includes('featured: false'))
  assert.ok(text.endsWith('Body\n'))
})

test('slug 生成', async () => {
  const { slugify } = await import('../dist/lib/slug.js')
  assert.equal(slugify('JavaScript Event Loop'), 'javascript-event-loop')
  assert.equal(slugify('  CSS Grid 布局 '), 'css-grid-布局')
  assert.equal(slugify('Hello, World!'), 'hello-world')
})

test('文件创建', () => {
  const root = makeRoot()
  const article = createArticle(root, {
    relPath: 'javascript/event-loop.md',
    frontmatter: {
      title: 'Event Loop',
      description: 'desc',
      category: 'JavaScript',
      tags: ['Async'],
      date: '2026-09-17',
      updated: '2026-09-17',
      featured: false,
    },
    body: '# Event Loop',
  })
  assert.ok(fs.existsSync(article.filePath))
  assert.equal(article.relPath, 'javascript/event-loop.md')
  fs.rmSync(root, { recursive: true, force: true })
})

test('文件创建拒绝覆盖', () => {
  const root = makeRoot()
  const frontmatter = {
    title: 'T',
    description: 'd',
    category: 'C',
    tags: [],
    date: '2026-09-17',
    updated: '2026-09-17',
    featured: false,
  }
  createArticle(root, { relPath: 'c/a.md', frontmatter, body: 'x' })
  assert.throws(() => createArticle(root, { relPath: 'c/a.md', frontmatter, body: 'y' }), /已存在/)
  fs.rmSync(root, { recursive: true, force: true })
})

test('文件删除', () => {
  const root = makeRoot()
  const frontmatter = {
    title: 'T',
    description: 'd',
    category: 'C',
    tags: [],
    date: '2026-09-17',
    updated: '2026-09-17',
    featured: false,
  }
  createArticle(root, { relPath: 'c/a.md', frontmatter, body: 'x' })
  deleteArticle(root, 'c/a.md')
  assert.equal(fs.existsSync(path.join(root, 'content/c/a.md')), false)
  fs.rmSync(root, { recursive: true, force: true })
})

test('按 slug 查找文章', () => {
  const root = makeRoot()
  const frontmatter = {
    title: 'Event Loop',
    description: 'd',
    category: 'JavaScript',
    tags: ['Async'],
    date: '2026-09-17',
    updated: '2026-09-17',
    featured: false,
  }
  createArticle(root, { relPath: 'javascript/event-loop.md', frontmatter, body: 'body' })
  assert.equal(findArticle(root, 'javascript/event-loop')?.title, 'Event Loop')
  assert.equal(findArticle(root, 'javascript-event-loop')?.title, 'Event Loop')
  assert.equal(findArticle(root, 'event-loop')?.title, 'Event Loop')
  fs.rmSync(root, { recursive: true, force: true })
})

test('搜索覆盖 title/description/tags/正文', () => {
  const root = makeRoot()
  const base = {
    date: '2026-09-17',
    updated: '2026-09-17',
    featured: false,
  }
  createArticle(root, {
    relPath: 'javascript/event-loop.md',
    frontmatter: { ...base, title: 'Event Loop', description: '异步', category: 'JavaScript', tags: ['Async'] },
    body: '微任务与宏任务',
  })
  createArticle(root, {
    relPath: 'css/grid.md',
    frontmatter: { ...base, title: 'Grid', description: '布局', category: 'CSS', tags: ['Layout'] },
    body: '网格布局',
  })
  assert.equal(searchArticles(root, 'Event Loop').length, 1)
  assert.equal(searchArticles(root, '异步').length, 1)
  assert.equal(searchArticles(root, 'Async').length, 1)
  assert.equal(searchArticles(root, '宏任务').length, 1)
  assert.equal(searchArticles(root, '不存在').length, 0)
  fs.rmSync(root, { recursive: true, force: true })
})

test('文章列表按 updated 倒序', () => {
  const root = makeRoot()
  const base = { description: 'd', category: 'C', tags: [], featured: false }
  createArticle(root, {
    relPath: 'c/a.md',
    frontmatter: { ...base, title: 'A', date: '2026-09-01', updated: '2026-09-01' },
    body: 'a',
  })
  createArticle(root, {
    relPath: 'c/b.md',
    frontmatter: { ...base, title: 'B', date: '2026-09-02', updated: '2026-09-02' },
    body: 'b',
  })
  const articles = listArticles(root)
  assert.equal(articles[0].title, 'B')
  fs.rmSync(root, { recursive: true, force: true })
})
