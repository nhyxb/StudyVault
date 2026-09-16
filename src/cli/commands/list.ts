import { listArticles } from '../lib/content.js'
import { info, printTable } from '../lib/ui.js'

export interface ListOptions {
  category?: string
  tag?: string
}

export async function runList(root: string, options: ListOptions): Promise<void> {
  let articles = listArticles(root)
  const category = options.category
  const tag = options.tag
  if (category) {
    articles = articles.filter((article) => article.category === category)
  }
  if (tag) {
    articles = articles.filter((article) => article.tags.includes(tag))
  }
  if (articles.length === 0) {
    info('暂无匹配的文章')
    return
  }
  printTable(
    ['TITLE', 'CATEGORY', 'UPDATED'],
    articles.map((article) => [article.title, article.category, article.updated || article.date || '-']),
  )
}
