import { Hash } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import { tags } from '../data'
import { Link } from '../lib/router'
import { cn } from '../lib/utils'
import styles from './TagsPage.module.css'

export default function TagsPage() {
  const maxCount = tags.length > 0 ? Math.max(...tags.map((item) => item.count)) : 0

  return (
    <div className="container">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Tags</p>
        <h1 className={styles.title}>标签</h1>
        <p className={styles.subtitle}>共 {tags.length} 个标签，字号越大代表内容越多</p>
      </header>

      {tags.length > 0 ? (
        <div className={`${styles.cloud} liquid-glass`}>
          {tags.map((item) => {
            const scale = item.count / maxCount
            const sizeClass = scale >= 0.75 ? styles.large : scale >= 0.4 ? styles.medium : styles.small
            return (
              <Link
                key={item.name}
                to={`/tag/${encodeURIComponent(item.name)}`}
                className={cn(styles.pill, sizeClass)}
              >
                <Hash size={12} aria-hidden="true" />
                {item.name}
                <span className={styles.count}>{item.count}</span>
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="还没有标签"
          description="在文章 frontmatter 的 tags 字段中添加标签，构建时会自动聚合。"
        />
      )}
    </div>
  )
}
