import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { StudyConfig } from './config.js'

function commandExists(command: string): boolean {
  const result = spawnSync('sh', ['-c', `command -v -- "${command}"`], {
    stdio: 'pipe',
    encoding: 'utf8',
  })
  return result.status === 0 && result.stdout.trim().length > 0
}

function splitCommand(value: string): string[] {
  return value.trim().split(/\s+/)
}

/**
 * 编辑器优先级：config.defaultEditor → $VISUAL → $EDITOR → code --wait → nano
 */
export function resolveEditor(config: StudyConfig): string | null {
  const candidates = [config.defaultEditor, process.env.VISUAL, process.env.EDITOR].filter(
    (value): value is string => Boolean(value),
  )
  for (const candidate of candidates) {
    const [command] = splitCommand(candidate)
    if (command && commandExists(command)) return candidate
  }
  if (commandExists('code')) return 'code --wait'
  if (commandExists('nano')) return 'nano'
  return null
}

export interface EditorResult {
  ok: boolean
  error?: string
}

export function openInEditor(editor: string, filePath: string): EditorResult {
  const [command, ...args] = splitCommand(editor)
  const result = spawnSync(command, [...args, filePath], { stdio: 'inherit' })
  if (result.error) return { ok: false, error: result.error.message }
  if (result.status !== 0) return { ok: false, error: `编辑器退出码 ${result.status}` }
  return { ok: true }
}

export interface EditTextResult {
  ok: boolean
  text?: string
  error?: string
}

export function editText(initial: string, editor: string): EditTextResult {
  const file = path.join(
    os.tmpdir(),
    `study-cli-${Date.now()}-${Math.random().toString(36).slice(2)}.md`,
  )
  fs.writeFileSync(file, initial, 'utf8')
  const result = openInEditor(editor, file)
  if (!result.ok) {
    fs.rmSync(file, { force: true })
    return { ok: false, error: result.error ?? '编辑器执行失败' }
  }
  const text = fs.readFileSync(file, 'utf8')
  fs.rmSync(file, { force: true })
  return { ok: true, text }
}
