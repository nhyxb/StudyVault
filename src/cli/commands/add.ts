import prompts from 'prompts'
import {
  categoryDirFor,
  createArticle,
  listCategories,
  type ArticleFrontmatter,
} from '../lib/content.js'
import { loadConfig, type StudyConfig } from '../lib/config.js'
import { today } from '../lib/date.js'
import { resolveEditor, editText } from '../lib/editor.js'
import { getBranch, getRemote, gitAdd, gitCommit, gitPush, isGitRepo } from '../lib/git.js'
import { slugify } from '../lib/slug.js'
import { ensureTTY, error, info, success } from '../lib/ui.js'

export interface AddOptions {
  slug?: string
  category?: string
  tags?: string
  description?: string
  featured?: boolean
  content?: string
  publish?: boolean
}

const onCancel = () => {
  throw new Error('已取消')
}

export function parseTags(input: string): string[] {
  return input
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

async function promptCategory(root: string, config: StudyConfig): Promise<string> {
  ensureTTY('分类')
  const categories = listCategories(root)
  const choices = [
    ...categories.map((name) => ({ title: name, value: name })),
    { title: '＋ 新建分类', value: '__new__' },
  ]
  const defaultIndex = config.defaultCategory
    ? Math.max(0, categories.indexOf(config.defaultCategory))
    : 0

  const answer = await prompts(
    {
      type: 'select',
      name: 'category',
      message: '分类',
      choices,
      initial: defaultIndex,
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

async function promptTags(): Promise<string[]> {
  ensureTTY('标签')
  const answer = await prompts(
    {
      type: 'list',
      name: 'tags',
      message: '标签（逗号分隔）',
      separator: ',',
    },
    { onCancel },
  )
  const tags = Array.isArray(answer.tags) ? answer.tags.map((tag) => String(tag)) : []
  return tags.flatMap((tag) => parseTags(tag))
}

async function promptContent(title: string, config: StudyConfig): Promise<string> {
  ensureTTY('正文内容')
  const initial = `# ${title}\n\n`
  const editor = resolveEditor(config)
  if (editor) {
    info(`将使用 ${editor} 编辑正文（保存并关闭后继续）`)
    const result = editText(initial, editor)
    if (!result.ok || result.text === undefined) {
      throw new Error(result.error ?? '编辑器执行失败')
    }
    return result.text
  }
  const answer = await prompts(
    {
      type: 'text',
      name: 'content',
      message: '正文内容（未找到编辑器，仅支持单行输入）',
    },
    { onCancel },
  )
  return String(answer.content ?? '')
}

async function autoPublish(root: string, relPath: string, message: string): Promise<void> {
  if (!isGitRepo(root)) {
    error('不是 Git 仓库，已创建文件但跳过发布')
    process.exitCode = 1
    return
  }
  const config = loadConfig()
  const branch = getBranch(root) || config.defaultBranch
  const remote = getRemote(root)
  info(`推送目标：${remote || '(未配置 remote)'} / ${branch}`)

  const add = gitAdd(root, [`content/${relPath}`])
  if (add.status !== 0) {
    error(`git add 失败：${add.stderr || add.stdout}`)
    process.exitCode = 1
    return
  }
  const commit = gitCommit(root, message)
  if (commit.status !== 0) {
    error(`git commit 失败：${commit.stderr || commit.stdout}`)
    process.exitCode = 1
    return
  }
  const push = gitPush(root, 'origin', branch)
  if (push.status !== 0) {
    error('推送失败，请检查 remote 配置与网络权限')
    process.exitCode = 1
    return
  }
  success(`Published to origin/${branch}`)
}

export async function runAdd(root: string, titleArg: string | undefined, options: AddOptions): Promise<void> {
  const config = loadConfig()
  const hasTitleArg = Boolean(titleArg && titleArg.trim())

  let title = titleArg?.trim() ?? ''
  if (!title) {
    ensureTTY('标题')
    const answer = await prompts(
      {
        type: 'text',
        name: 'title',
        message: '标题',
        validate: (value) => (String(value ?? '').trim() ? true : '标题不能为空'),
      },
      { onCancel },
    )
    title = String(answer.title).trim()
  }

  let slug = options.slug?.trim() ?? ''
  if (!slug && hasTitleArg) slug = slugify(title)
  if (!slug) {
    ensureTTY('slug')
    const answer = await prompts(
      {
        type: 'text',
        name: 'slug',
        message: 'slug',
        initial: slugify(title),
        validate: (value) => (slugify(String(value ?? '')) ? true : 'slug 不能为空'),
      },
      { onCancel },
    )
    slug = slugify(String(answer.slug).trim())
  }
  if (!slug) throw new Error('slug 不能为空')

  const category = options.category?.trim() || (await promptCategory(root, config))
  if (!category) throw new Error('分类不能为空')

  const tags = options.tags !== undefined ? parseTags(options.tags) : await promptTags()
  if (!options.description) ensureTTY('摘要')
  const description =
    options.description?.trim() ||
    (await prompts({ type: 'text', name: 'description', message: '摘要' }, { onCancel })).description

  if (options.featured === undefined) ensureTTY('是否精选')
  const featured =
    options.featured ??
    (
      await prompts(
        {
          type: 'toggle',
          name: 'featured',
          message: '是否精选',
          initial: false,
          active: 'yes',
          inactive: 'no',
        },
        { onCancel },
      )
    ).featured

  const body = options.content ?? (await promptContent(title, config))

  const frontmatter: ArticleFrontmatter = {
    title,
    description: String(description ?? '').trim(),
    category,
    tags,
    date: today(),
    updated: today(),
    featured: Boolean(featured),
  }

  const categoryDir = categoryDirFor(root, category)
  const relPath = `${categoryDir}/${slug}.md`
  createArticle(root, { relPath, frontmatter, body })
  success(`Created: content/${relPath}`)

  if (options.publish || config.autoPush) {
    await autoPublish(root, relPath, `content: add ${title}`)
  }
}
