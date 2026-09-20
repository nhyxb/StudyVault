import prompts from 'prompts'
import { listCategories } from './content.js'
import { ensureTTY } from './ui.js'

const onCancel = () => {
  throw new Error('已取消')
}

/**
 * 解析标签字符串（支持逗号或中文逗号分隔）
 */
export function parseTags(input: string): string[] {
  return input
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
}

/**
 * 交互式选择或创建分类
 */
export async function promptCategory(
  root: string,
  options: { current?: string; defaultCategory?: string } = {},
): Promise<string> {
  ensureTTY('分类')
  const categories = listCategories(root)
  const choices = [
    ...categories.map((name) => ({ title: name, value: name })),
    { title: '＋ 新建分类', value: '__new__' },
  ]

  let initialIndex = 0
  if (options.current) {
    initialIndex = Math.max(0, categories.indexOf(options.current))
  } else if (options.defaultCategory) {
    initialIndex = Math.max(0, categories.indexOf(options.defaultCategory))
  }

  const answer = await prompts(
    {
      type: 'select',
      name: 'category',
      message: '分类',
      choices,
      initial: initialIndex,
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

/**
 * 交互式输入标签列表
 */
export async function promptTags(initial?: string[]): Promise<string[]> {
  ensureTTY('标签')
  const answer = await prompts(
    {
      type: 'list',
      name: 'tags',
      message: '标签（逗号分隔）',
      initial: initial?.join(', '),
      separator: ',',
    },
    { onCancel },
  )
  const tags = Array.isArray(answer.tags) ? answer.tags.map((tag) => String(tag)) : []
  return tags.flatMap((tag) => parseTags(tag))
}

/**
 * 交互式输入文本
 */
export async function promptText(message: string, initial?: string, validate?: (value: string) => boolean | string): Promise<string> {
  ensureTTY(message)
  const answer = await prompts(
    {
      type: 'text',
      name: 'value',
      message,
      initial,
      validate,
    },
    { onCancel },
  )
  return String(answer.value ?? '').trim()
}

/**
 * 交互式确认
 */
export async function promptConfirm(message: string, initial = false): Promise<boolean> {
  ensureTTY(message)
  const answer = await prompts(
    {
      type: 'confirm',
      name: 'value',
      message,
      initial,
    },
    { onCancel },
  )
  return Boolean(answer.value)
}

/**
 * 从列表中选择一项
 */
export async function promptSelect<T extends string>(
  message: string,
  choices: Array<{ title: string; value: T }>,
  initial?: number,
): Promise<T> {
  ensureTTY(message)
  const answer = await prompts(
    {
      type: 'select',
      name: 'value',
      message,
      choices,
      initial,
    },
    { onCancel },
  )
  return answer.value as T
}
