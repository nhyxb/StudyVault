import prompts from 'prompts'
import {
  CONFIG_KEYS,
  isConfigKey,
  loadConfig,
  setConfigValue,
  type ConfigKey,
} from '../lib/config.js'
import { color, ensureTTY, error, info, success } from '../lib/ui.js'

const onCancel = () => {
  throw new Error('已取消')
}

const LABELS: Record<ConfigKey, string> = {
  defaultCategory: '默认分类',
  defaultEditor: '默认编辑器',
  defaultBranch: '默认分支',
  autoPush: '自动 push',
  confirmBeforeCommit: 'Git commit 前确认',
}

function printConfig(): void {
  const config = loadConfig()
  console.log(color.bold('当前配置：'))
  for (const key of CONFIG_KEYS) {
    console.log(`  ${LABELS[key].padEnd(20)} ${String(config[key])}`)
  }
}

async function promptValue(key: ConfigKey): Promise<string | boolean> {
  ensureTTY(LABELS[key])
  if (key === 'autoPush' || key === 'confirmBeforeCommit') {
    const answer = await prompts(
      {
        type: 'toggle',
        name: 'value',
        message: LABELS[key],
        initial: Boolean(loadConfig()[key]),
        active: 'yes',
        inactive: 'no',
      },
      { onCancel },
    )
    return Boolean(answer.value)
  }
  const answer = await prompts(
    { type: 'text', name: 'value', message: LABELS[key], initial: String(loadConfig()[key]) },
    { onCancel },
  )
  return String(answer.value ?? '')
}

async function runInteractiveConfig(): Promise<void> {
  ensureTTY('配置修改')
  const { keys } = await prompts(
    {
      type: 'multiselect',
      name: 'keys',
      message: '选择要修改的配置（空格选择，回车确认）',
      choices: CONFIG_KEYS.map((key) => ({ title: LABELS[key], value: key })),
      min: 1,
    },
    { onCancel },
  )
  const selected = (Array.isArray(keys) ? keys : []).map(String) as ConfigKey[]
  for (const key of selected) {
    setConfigValue(key, await promptValue(key))
  }
  success(`配置已保存到 ${process.env.STUDY_CLI_CONFIG || '~/.study-cli/config.json'}`)
}

function runShow(): void {
  printConfig()
}

function runSet(key: string, value: string): void {
  if (!isConfigKey(key)) {
    error(`未知配置项：${key}（可用：${CONFIG_KEYS.join(', ')}）`)
    process.exitCode = 1
    return
  }
  if (!value) {
    error(`请提供配置值：study config set ${key} <value>`)
    process.exitCode = 1
    return
  }
  const updated = setConfigValue(key, value)
  success(`${LABELS[key]} → ${String(updated[key])}`)
}

export async function runConfig(action: string | undefined, key: string | undefined, value: string | undefined): Promise<void> {
  try {
    if (action === 'show') {
      runShow()
      return
    }
    if (action === 'set') {
      if (key) runSet(key, value ?? '')
      else {
        error('用法：study config set <key> <value>')
        process.exitCode = 1
      }
      return
    }
    if (action) {
      info(`未知操作：${action}（可用：show、set；不带参数进入交互模式）`)
      return
    }
    await runInteractiveConfig()
  } catch (err) {
    if (err instanceof Error && err.message === '已取消') {
      info('已取消')
      return
    }
    error(err instanceof Error ? err.message : String(err))
    process.exitCode = 1
  }
}
