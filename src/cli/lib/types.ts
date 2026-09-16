export interface ArticleFrontmatter {
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  updated: string
  featured: boolean
}

export interface Article extends ArticleFrontmatter {
  /** 相对 content/ 的路径，例如 javascript/event-loop.md */
  relPath: string
  /** 相对 content/ 的路径去掉 .md，例如 javascript/event-loop */
  slug: string
  /** 绝对文件路径 */
  filePath: string
  /** Markdown 正文 */
  body: string
}

export interface ArticleMatch {
  article: Article
  matchedIn: string[]
  snippet: string
}
