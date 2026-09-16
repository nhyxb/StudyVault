import { getBranch, getLastCommit, getRemote, getStatusLines, isGitRepo } from '../lib/git.js'
import { color, error, success, warn } from '../lib/ui.js'

export async function runStatus(root: string): Promise<void> {
  if (!isGitRepo(root)) {
    error('No Git repository found')
    process.exitCode = 1
    return
  }
  const branch = getBranch(root) || '(detached)'
  const remote = getRemote(root) || '(未配置)'
  const lastCommit = getLastCommit(root) || '(无提交)'
  const lines = getStatusLines(root)

  console.log(`${color.bold('Branch')}    ${branch}`)
  console.log(`${color.bold('Remote')}    ${remote}`)
  console.log(`${color.bold('最近提交')}  ${lastCommit}`)

  if (lines.length === 0) {
    success('工作区干净')
  } else {
    warn('工作区有未提交修改')
    for (const line of lines) {
      console.log(`  ${line}`)
    }
  }
}
