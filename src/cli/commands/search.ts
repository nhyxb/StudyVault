import { searchArticles } from '../lib/content.js'
import { color, info } from '../lib/ui.js'

export async function runSearch(root: string, query: string): Promise<void> {
  const results = searchArticles(root, query)
  if (results.length === 0) {
    info(`没有找到匹配 "${query}" 的文章`)
    return
  }
  for (const { article, matchedIn, snippet } of results) {
    console.log(`${color.bold(article.title)}  ${color.gray(`[${article.category}]`)}  ${article.updated}`)
    console.log(`  content/${article.relPath}`)
    console.log(`  匹配字段：${matchedIn.join(', ')}`)
    if (snippet) console.log(`  ${color.gray(snippet)}`)
    console.log()
  }
}
