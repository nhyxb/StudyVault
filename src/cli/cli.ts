#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'
import { runAdd } from './commands/add.js'
import { runConfig } from './commands/config.js'
import { runDelete } from './commands/delete.js'
import { runEdit } from './commands/edit.js'
import { runInit } from './commands/init.js'
import { runList } from './commands/list.js'
import { runPublish } from './commands/publish.js'
import { runSearch } from './commands/search.js'
import { runStatus } from './commands/status.js'

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(moduleDir, '..')
const pkg = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8')) as { version: string }

const program = new Command()
program
  .name('study')
  .description('study — Personal Learning Knowledge Base CLI')
  .version(pkg.version)

program
  .command('init')
  .description('检查当前项目并创建缺失目录')
  .action(async () => {
    await runInit(process.cwd())
  })

program
  .command('add')
  .description('创建文章')
  .argument('[title]', '文章标题（提供后自动生成 slug）')
  .option('--slug <slug>', '自定义 slug')
  .option('--category <category>', '分类')
  .option('--tags <tags>', '标签（逗号分隔）')
  .option('--description <description>', '摘要')
  .option('--featured', '是否精选')
  .option('--content <content>', '正文内容（非交互模式）')
  .option('--publish', '创建后自动提交并推送')
  .action(async (title: string | undefined, options) => {
    await runAdd(process.cwd(), title, options)
  })

program
  .command('edit')
  .description('编辑文章')
  .argument('[ref]', '文章路径，例如 javascript/event-loop')
  .option('--title <title>', '新标题')
  .option('--description <description>', '新摘要')
  .option('--category <category>', '新分类')
  .option('--tags <tags>', '新标签（逗号分隔）')
  .option('--featured', '设为精选')
  .option('--unfeatured', '取消精选')
  .option('--content <content>', '新正文（非交互模式）')
  .action(async (ref: string | undefined, options) => {
    await runEdit(process.cwd(), ref, options)
  })

program
  .command('delete')
  .description('删除文章（需二次确认）')
  .argument('[ref]', '文章路径或 slug，例如 javascript/event-loop')
  .option('--yes', '跳过交互确认')
  .action(async (ref: string | undefined, options) => {
    await runDelete(process.cwd(), ref, options)
  })

program
  .command('list')
  .description('查看文章列表')
  .option('--category <category>', '按分类筛选')
  .option('--tag <tag>', '按标签筛选')
  .action(async (options) => {
    await runList(process.cwd(), options)
  })

program
  .command('search')
  .description('搜索文章')
  .argument('<query>', '搜索关键词')
  .action(async (query: string) => {
    await runSearch(process.cwd(), query)
  })

program
  .command('status')
  .description('查看 Git 状态')
  .action(async () => {
    await runStatus(process.cwd())
  })

program
  .command('publish')
  .description('提交并推送 content/ 目录')
  .option('--yes', '跳过确认')
  .option('--dry-run', '只显示将要提交的内容，不真正提交或推送')
  .action(async (options) => {
    await runPublish(process.cwd(), options)
  })

program
  .command('config')
  .description('查看或修改配置')
  .argument('[action]', 'show 或 set')
  .argument('[key]', '配置项')
  .argument('[value]', '配置值')
  .action(async (action: string | undefined, key: string | undefined, value: string | undefined) => {
    await runConfig(action, key, value)
  })

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(`✗ ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
})
