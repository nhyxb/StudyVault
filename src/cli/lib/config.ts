import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export interface StudyConfig {
  /** 默认分类 */
  defaultCategory: string
  /** 默认编辑器 */
  defaultEditor: string
  /** 默认分支 */
  defaultBranch: string
  /** 创建/发布时是否自动 push */
  autoPush: boolean
  /** Git commit 前是否确认 */
  confirmBeforeCommit: boolean
}

export const DEFAULT_CONFIG: StudyConfig = {
  defaultCategory: '',
  defaultEditor: '',
  defaultBranch: 'main',
  autoPush: false,
  confirmBeforeCommit: true,
}

export const CONFIG_KEYS = [
  'defaultCategory',
  'defaultEditor',
  'defaultBranch',
  'autoPush',
  'confirmBeforeCommit',
] as const

export type ConfigKey = (typeof CONFIG_KEYS)[number]

export function configPath(): string {
  return process.env.STUDY_CLI_CONFIG || path.join(os.homedir(), '.study-cli', 'config.json')
}

export function isConfigKey(key: string): key is ConfigKey {
  return (CONFIG_KEYS as readonly string[]).includes(key)
}

export function loadConfig(): StudyConfig {
  const file = configPath()
  if (!fs.existsSync(file)) return { ...DEFAULT_CONFIG }
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<StudyConfig>
    return {
      defaultCategory:
        typeof raw.defaultCategory === 'string' ? raw.defaultCategory : DEFAULT_CONFIG.defaultCategory,
      defaultEditor:
        typeof raw.defaultEditor === 'string' ? raw.defaultEditor : DEFAULT_CONFIG.defaultEditor,
      defaultBranch:
        typeof raw.defaultBranch === 'string' ? raw.defaultBranch : DEFAULT_CONFIG.defaultBranch,
      autoPush: typeof raw.autoPush === 'boolean' ? raw.autoPush : DEFAULT_CONFIG.autoPush,
      confirmBeforeCommit:
        typeof raw.confirmBeforeCommit === 'boolean'
          ? raw.confirmBeforeCommit
          : DEFAULT_CONFIG.confirmBeforeCommit,
    }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export function saveConfig(config: StudyConfig): void {
  const file = configPath()
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
}

function parseBoolean(value: string): boolean {
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
}

export function setConfigValue(key: ConfigKey, value: string | boolean): StudyConfig {
  const config = loadConfig()
  if (key === 'autoPush' || key === 'confirmBeforeCommit') {
    config[key] = typeof value === 'boolean' ? value : parseBoolean(String(value))
  } else {
    config[key] = String(value)
  }
  saveConfig(config)
  return config
}
