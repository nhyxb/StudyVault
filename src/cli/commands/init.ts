import fs from 'node:fs'
import path from 'node:path'
import { getRemote, isGitRepo } from '../lib/git.js'
import { color, error, success, warn } from '../lib/ui.js'

export async function runInit(root: string): Promise<void> {
  const gitOk = isGitRepo(root)
  const contentOk = fs.existsSync(path.join(root, 'content'))
  const packageOk = fs.existsSync(path.join(root, 'package.json'))
  const remote = getRemote(root)
  const remoteOk = remote.length > 0
  const projectOk =
    packageOk &&
    contentOk &&
    fs.existsSync(path.join(root, 'src')) &&
    fs.existsSync(path.join(root, 'vite.config.ts'))

  console.log(color.bold('study-cli 初始化检查'))
  console.log(`${gitOk ? color.green('✓') : color.red('✗')} Git 仓库`)
  console.log(`${contentOk ? color.green('✓') : color.red('✗')} content/ 目录`)
  console.log(`${packageOk ? color.green('✓') : color.red('✗')} package.json`)
  console.log(`${remoteOk ? color.green('✓') : color.red('✗')} Git remote（origin）${remoteOk ? `：${remote}` : ''}`)
  console.log(`${projectOk ? color.green('✓') : color.red('✗')} 网站项目完整性`)

  if (!contentOk) {
    fs.mkdirSync(path.join(root, 'content'), { recursive: true })
    success('已创建 content/ 目录')
  }
  if (!gitOk) error('当前目录不是 Git 仓库，请在项目根目录运行，或先执行 git init')
  if (!remoteOk) warn('未配置 Git remote，发布前请先 git remote add origin <url>')
  if (!packageOk) warn('未找到 package.json，请确认你在网站项目根目录')
}
