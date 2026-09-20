import {
  categoryDirFor,
  createArticle,
  type ArticleFrontmatter,
} from '../lib/content.js'
import { loadConfig, type StudyConfig } from '../lib/config.js'
import { today } from '../lib/date.js'
import { resolveEditor, editText } from '../lib/editor.js'
import { getBranch, getRemote, gitAdd, gitCommit, gitPush, isGitRepo } from '../lib/git.js'
import { slugify } from '../lib/slug.js'
import { error, info, success } from '../lib/ui.js'
import {
  parseTags,
  promptCategory,
  promptConfirm,
  promptTags,
  promptText,
} from '../lib/prompts.js'

export interface AddOptions {
  slug?: string
  category?: string
  tags?: string
  description?: string
  featured?: boolean
  content?: string
  publish?: boolean
}

async function promptContent(title: string, config: StudyConfig): Promise<string> {
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
  return promptText('正文内容（未找到编辑器，仅支持单行输入）')
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

  const title = titleArg?.trim() || (await promptText('标题', '', (value) => value.trim() ? true : '标题不能为空'))

  let slug = options.slug?.trim() ?? ''
  if (!slug && hasTitleArg) slug = slugify(title)
  if (!slug) {
    slug = slugify(await promptText('slug', slugify(title), (value) => slugify(value) ? true : 'slug 不能为空'))
  }
  if (!slug) throw new Error('slug 不能为空')

  const category = options.category?.trim() || (await promptCategory(root, { defaultCategory: config.defaultCategory }))
  if (!category) throw new Error('分类不能为空')

  const tags = options.tags !== undefined ? parseTags(options.tags) : await promptTags()
  const description = options.description?.trim() || (await promptText('摘要'))

  const featured = options.featured ?? (await promptConfirm('是否精选', false))

  const body = options.content ?? (await promptContent(title, config))

  const frontmatter: ArticleFrontmatter = {
    title,
    description,
    category,
    tags,
    date: today(),
    updated: today(),
    featured,
  }

  const categoryDir = categoryDirFor(root, category)
  const relPath = `${categoryDir}/${slug}.md`
  createArticle(root, { relPath, frontmatter, body })
  success(`Created: content/${relPath}`)

  if (options.publish || config.autoPush) {
    await autoPublish(root, relPath, `content: add ${title}`)
  }
}
