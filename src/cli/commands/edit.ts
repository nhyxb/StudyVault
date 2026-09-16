import path from 'node:path'
import prompts from 'prompts'
import {
  categoryDirFor,
  deleteArticle,
  findArticle,
  listArticles,
  listCategories,
  updateArticle,
  type Article,
  type ArticleFrontmatter,
} from '../lib/content.js'
import { loadConfig, type StudyConfig } from '../lib/config.js'
import { today } from '../lib/date.js'
import { editText, resolveEditor } from '../lib/editor.js'
import { color, ensureTTY, error, info, success } from '../lib/ui.js'
import { parseTags } from './add.js'

export interface EditOptions {
  title?: string
  description?: string
  category?: string
  tags?: string
  featured?: boolean
  unfeatured?: boolean
  content?: string
}

interface ArticleChanges {
  title?: string
  description?: string
  category?: string
  tags?: string[]
  featured?: boolean
  body?: string
}

const onCancel = () => {
  throw new Error('已取消')
}

async function promptCategory(root: string, current: string): Promise<string> {
  ensureTTY('分类')
  const categories = listCategories(root)
  const choices = [
    ...categories.map((name) => ({ title: name, value: name })),
    { title: '＋ 新建分类', value: '__new__' },
  ]
  const answer = await prompts(
    {
      type: 'select',
      name: 'category',
      message: '分类',
      choices,
      initial: Math.max(0, categories.indexOf(current)),
    },
    { onCancel },
  )
  if (answer.category === '__new__') {
    const created = await prompts(
      {
        type: 'text',
        name: 'category',
        message: '新分类名称',
        validate: (value) => (String(value ?? '').trim() ? true : '分类不能为空'),
      },
      { onCancel },
    )
    const category = String(created.category ?? '').trim()
    if (!category) throw new Error('分类不能为空')
    return category
  }
  return String(answer.category)
}

async function askText(message: string, initial: string): Promise<string> {
  ensureTTY(message)
  const answer = await prompts(
    { type: 'text', name: 'value', message, initial },
    { onCancel },
  )
  return String(answer.value ?? '').trim()
}

async function askTags(current: string[]): Promise<string[]> {
  ensureTTY('标签')
  const answer = await prompts(
    {
      type: 'list',
      name: 'tags',
      message: '标签（逗号分隔）',
      separator: ',',
      initial: current.join(','),
    },
    { onCancel },
  )
  const tags = Array.isArray(answer.tags) ? answer.tags.map((tag) => String(tag)) : []
  return tags.flatMap((tag) => parseTags(tag))
}

async function askToggle(message: string, initial: boolean): Promise<boolean> {
  ensureTTY(message)
  const answer = await prompts(
    { type: 'toggle', name: 'value', message, initial, active: 'yes', inactive: 'no' },
    { onCancel },
  )
  return Boolean(answer.value)
}

async function askBody(current: string, config: StudyConfig): Promise<string> {
  ensureTTY('正文内容')
  const editor = resolveEditor(config)
  if (!editor) throw new Error('未找到可用的编辑器（请设置 $VISUAL / $EDITOR 或 study config）')
  info(`将使用 ${editor} 编辑正文（保存并关闭后继续）`)
  const result = editText(current, editor)
  if (!result.ok || result.text === undefined) {
    throw new Error(result.error ?? '编辑器执行失败')
  }
  return result.text
}

function hasNonInteractiveChanges(options: EditOptions): boolean {
  return (
    options.title !== undefined ||
    options.description !== undefined ||
    options.category !== undefined ||
    options.tags !== undefined ||
    options.featured === true ||
    options.unfeatured === true ||
    options.content !== undefined
  )
}

function buildNonInteractiveChanges(options: EditOptions): ArticleChanges {
  const changes: ArticleChanges = {}
  if (options.title !== undefined) changes.title = options.title.trim()
  if (options.description !== undefined) changes.description = options.description.trim()
  if (options.category !== undefined) changes.category = options.category.trim()
  if (options.tags !== undefined) changes.tags = parseTags(options.tags)
  if (options.featured) changes.featured = true
  if (options.unfeatured) changes.featured = false
  if (options.content !== undefined) changes.body = options.content
  return changes
}

async function buildInteractiveChanges(
  root: string,
  config: StudyConfig,
  article: Article,
): Promise<ArticleChanges> {
  const { fields } = await prompts(
    {
      type: 'multiselect',
      name: 'fields',
      message: '选择要修改的字段（空格选择，回车确认）',
      choices: [
        { title: '标题', value: 'title' },
        { title: '摘要', value: 'description' },
        { title: '分类', value: 'category' },
        { title: '标签', value: 'tags' },
        { title: '精选', value: 'featured' },
        { title: '正文', value: 'body' },
      ],
      min: 1,
    },
    { onCancel },
  )

  const changes: ArticleChanges = {}
  const selected = Array.isArray(fields) ? fields.map((field) => String(field)) : []
  for (const field of selected) {
    if (field === 'title') changes.title = await askText('新标题', article.title)
    else if (field === 'description') changes.description = await askText('新摘要', article.description)
    else if (field === 'category') changes.category = await promptCategory(root, article.category)
    else if (field === 'tags') changes.tags = await askTags(article.tags)
    else if (field === 'featured') changes.featured = await askToggle('是否精选', article.featured)
    else if (field === 'body') changes.body = await askBody(article.body, config)
  }
  return changes
}

async function selectArticle(root: string): Promise<Article | null> {
  ensureTTY('文章选择')
  const articles = listArticles(root)
  if (articles.length === 0) {
    info('没有可编辑的文章')
    return null
  }
  console.log(color.bold('选择要编辑的文章：'))
  articles.forEach((article, index) => {
    console.log(
      `  ${String(index + 1).padStart(2)}. ${article.title}  [${article.category}]  ${article.updated}`,
    )
  })
  const answer = await prompts(
    {
      type: 'select',
      name: 'slug',
      message: '文章',
      choices: articles.map((article) => ({
        title: `${article.title}  [${article.category}]  ${article.updated}`,
        value: article.slug,
      })),
    },
    { onCancel },
  )
  return findArticle(root, String(answer.slug))
}

export async function runEdit(root: string, ref: string | undefined, options: EditOptions): Promise<void> {
  try {
    const config = loadConfig()
    const article = ref ? findArticle(root, ref) : await selectArticle(root)
    if (!article) {
      if (ref) error(`Article not found: ${ref}`)
      return
    }

    const changes = hasNonInteractiveChanges(options)
      ? buildNonInteractiveChanges(options)
      : await buildInteractiveChanges(root, config, article)

    const title = changes.title ?? article.title
    const description = changes.description ?? article.description
    const category = changes.category ?? article.category
    const tags = changes.tags ?? article.tags
    const featured = changes.featured ?? article.featured
    const body = changes.body ?? article.body

    const frontmatter: ArticleFrontmatter = {
      title,
      description,
      category,
      tags,
      date: article.date,
      updated: today(),
      featured,
    }

    const fileName = path.posix.basename(article.slug)
    const targetDir = categoryDirFor(root, category)
    const newRelPath = `${targetDir}/${fileName}.md`

    if (newRelPath !== article.relPath) {
      const existing = findArticle(root, newRelPath)
      if (existing && existing.relPath !== article.relPath) {
        throw new Error(`目标路径已存在其他文章：${newRelPath}`)
      }
      const moved = updateArticle(root, newRelPath, frontmatter, body)
      deleteArticle(root, article.relPath)
      success(`Updated: content/${moved.relPath}`)
      return
    }

    updateArticle(root, article.relPath, frontmatter, body)
    success(`Updated: content/${article.relPath}`)
  } catch (err) {
    if (err instanceof Error && err.message === '已取消') {
      info('已取消')
      return
    }
    error(err instanceof Error ? err.message : String(err))
    process.exitCode = 1
  }
}
