import prompts from 'prompts'
import { deleteArticle, findArticle, listArticles } from '../lib/content.js'
import { loadConfig } from '../lib/config.js'
import { getBranch, getRemote, getStatusShort, gitAdd, gitCommit, gitPush, isGitRepo, isTracked } from '../lib/git.js'
import { color, ensureTTY, error, info, success, warn } from '../lib/ui.js'

export interface DeleteOptions {
  yes?: boolean
}

const onCancel = () => {
  throw new Error('已取消')
}

async function selectArticle(root: string): Promise<string | null> {
  ensureTTY('文章选择')
  const articles = listArticles(root)
  if (articles.length === 0) {
    info('没有可删除的文章')
    return null
  }
  console.log(color.bold('选择要删除的文章：'))
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
  return String(answer.slug)
}

export async function runDelete(root: string, ref: string | undefined, options: DeleteOptions): Promise<void> {
  try {
    const slug = ref ? ref : await selectArticle(root)
    if (!slug) {
      if (ref) error(`Article not found: ${ref}`)
      return
    }

    const article = findArticle(root, slug)
    if (!article) {
      error(`Article not found: ${slug}`)
      return
    }

    console.log(color.bold(`将删除：${article.title}`))
    console.log(`路径：content/${article.relPath}`)

    if (!options.yes) {
      ensureTTY('删除确认')
      const first = await prompts(
        { type: 'confirm', name: 'ok', message: '确认删除这篇文章？', initial: false },
        { onCancel },
      )
      if (!first.ok) {
        info('已取消')
        return
      }
      const second = await prompts(
        {
          type: 'confirm',
          name: 'ok',
          message: '二次确认：删除后不可恢复，且会执行 Git 提交与推送。继续？',
          initial: false,
        },
        { onCancel },
      )
      if (!second.ok) {
        info('已取消')
        return
      }
    }

    const wasTracked = isGitRepo(root) && isTracked(root, `content/${article.relPath}`)
    deleteArticle(root, article.relPath)
    success(`Deleted: content/${article.relPath}`)

    if (!isGitRepo(root)) {
      warn('不是 Git 仓库，已删除文件但跳过提交与推送')
      return
    }
    if (!wasTracked) {
      info('该文件此前未被 Git 跟踪，无需提交')
      return
    }

    console.log(color.bold('git status：'))
    console.log(getStatusShort(root) || '(空)')

    const config = loadConfig()
    if (config.confirmBeforeCommit && !options.yes) {
      ensureTTY('提交确认')
      const commitNow = await prompts(
        { type: 'confirm', name: 'ok', message: '执行 git add / commit / push？', initial: true },
        { onCancel },
      )
      if (!commitNow.ok) {
        info('已删除文件，但未提交 Git')
        return
      }
    }

    const branch = getBranch(root) || config.defaultBranch
    const remote = getRemote(root)
    info(`推送目标：${remote || '(未配置 remote)'} / ${branch}`)

    const add = gitAdd(root, [`content/${article.relPath}`])
    if (add.status !== 0) {
      error(`git add 失败：${add.stderr || add.stdout}`)
      process.exitCode = 1
      return
    }
    const commit = gitCommit(root, `content: delete ${article.slug}`)
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
  } catch (err) {
    if (err instanceof Error && err.message === '已取消') {
      info('已取消')
      return
    }
    error(err instanceof Error ? err.message : String(err))
    process.exitCode = 1
  }
}
