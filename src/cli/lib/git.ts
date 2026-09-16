import { spawnSync } from 'node:child_process'

export interface GitResult {
  status: number
  stdout: string
  stderr: string
}

function runGit(root: string, args: string[], inherit = false): GitResult {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
  })
  // 某些受限环境（如沙箱）下 spawnSync 会同时给出 error 与有效 status，
  // 此时以 status 为准；仅当无法启动进程（status 为 null）时视为失败。
  if (result.error && result.status === null) {
    return {
      status: 1,
      stdout: '',
      stderr: `无法执行 git ${args.join(' ')}：${result.error.message}`,
    }
  }
  return {
    status: result.status ?? 1,
    stdout: typeof result.stdout === 'string' ? result.stdout : '',
    stderr: typeof result.stderr === 'string' ? result.stderr : '',
  }
}

export function isGitRepo(root: string): boolean {
  return runGit(root, ['rev-parse', '--is-inside-work-tree']).status === 0
}

export function getBranch(root: string): string {
  const result = runGit(root, ['branch', '--show-current'])
  return result.status === 0 ? result.stdout.trim() : ''
}

export function getRemote(root: string, name = 'origin'): string {
  const result = runGit(root, ['remote', 'get-url', name])
  return result.status === 0 ? result.stdout.trim() : ''
}

export function getStatusPorcelain(root: string): string {
  const result = runGit(root, ['status', '--porcelain'])
  return result.status === 0 ? result.stdout : result.stderr || result.stdout
}

export function getStatusShort(root: string): string {
  const result = runGit(root, ['status', '--short', '--branch'])
  return result.status === 0 ? result.stdout.trimEnd() : result.stderr || result.stdout
}

function parseChangedFile(line: string): string {
  const raw = line.slice(3).trim()
  if (!raw) return ''
  if (raw.includes(' -> ')) return raw.split(' -> ').pop() ?? ''
  return raw.replace(/^"|"$/g, '')
}

export function getStatusLines(root: string): string[] {
  const output = getStatusPorcelain(root)
  if (!output.trim()) return []
  return output
    .split('\n')
    .map((line) => line)
    .filter((line) => line.length > 0)
}

export function getChangedFiles(root: string): string[] {
  const output = getStatusPorcelain(root)
  if (!output.trim()) return []
  return output
    .split('\n')
    .map((line) => parseChangedFile(line))
    .filter(Boolean)
}

export function hasUncommittedChanges(root: string): boolean {
  return getStatusPorcelain(root).trim().length > 0
}

export function getLastCommit(root: string): string {
  const result = runGit(root, ['log', '-1', '--oneline', '--decorate=short'])
  return result.status === 0 ? result.stdout.trim() : ''
}

export function isTracked(root: string, relPath: string): boolean {
  return runGit(root, ['ls-files', '--error-unmatch', '--', relPath]).status === 0
}

export function gitAdd(root: string, paths: string[]): GitResult {
  return runGit(root, ['add', '--', ...paths])
}

export function gitCommit(root: string, message: string): GitResult {
  return runGit(root, ['commit', '-m', message])
}

/** 使用 inherit 输出，保证 Git 的错误信息直接显示给用户。 */
export function gitPush(root: string, remote: string, branch: string): GitResult {
  return runGit(root, ['push', remote, branch], true)
}
