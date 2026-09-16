import prompts from 'prompts'
import { loadConfig } from '../lib/config.js'
import {
  getBranch,
  getChangedFiles,
  getRemote,
  getStatusShort,
  gitAdd,
  gitCommit,
  gitPush,
  hasUncommittedChanges,
  isGitRepo,
} from '../lib/git.js'
import { color, ensureTTY, error, info, success } from '../lib/ui.js'

export interface PublishOptions {
  yes?: boolean
  dryRun?: boolean
}

const onCancel = () => {
  throw new Error('已取消')
}

export async function runPublish(root: string, options: PublishOptions): Promise<void> {
  if (!isGitRepo(root)) {
    error('No Git repository found')
    process.exitCode = 1
    return
  }

  if (!hasUncommittedChanges(root)) {
    info('没有需要发布的内容')
    return
  }

  const contentChanges = getChangedFiles(root).filter((file) => file === 'content' || file.startsWith('content/'))
  if (contentChanges.length === 0) {
    info('没有需要发布的内容（content/ 目录无修改）')
    return
  }

  console.log(color.bold('即将提交以下文件：'))
  console.log(getStatusShort(root))

  const config = loadConfig()
  const branch = getBranch(root) || config.defaultBranch
  const remote = getRemote(root)
  info(`目标：${remote || '(未配置 remote)'} / ${branch}`)

  if (options.dryRun) {
    info('dry-run：未执行提交与推送')
    return
  }

  if (config.confirmBeforeCommit && !options.yes) {
    ensureTTY('提交确认')
    const answer = await prompts(
      { type: 'confirm', name: 'ok', message: '确认提交并推送？', initial: true },
      { onCancel },
    )
    if (!answer.ok) {
      info('已取消')
      return
    }
  }

  const add = gitAdd(root, ['content/'])
  if (add.status !== 0) {
    error(`git add 失败：${add.stderr || add.stdout}`)
    process.exitCode = 1
    return
  }
  const commit = gitCommit(root, 'content: update learning notes')
  if (commit.status !== 0) {
    error(`git commit 失败：${commit.stderr || commit.stdout}`)
    process.exitCode = 1
    return
  }

  info(`推送目标：${remote || '(未配置 remote)'} / ${branch}`)
  const push = gitPush(root, 'origin', branch)
  if (push.status !== 0) {
    error('推送失败，请检查 remote 配置与网络权限')
    process.exitCode = 1
    return
  }
  success(`Published to origin/${branch}`)
}
