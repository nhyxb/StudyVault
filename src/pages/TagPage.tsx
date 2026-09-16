import { ArrowLeft, Hash } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PostGrid from '../components/PostGrid'
import { getPostsByTag, getTagInfo } from '../data'
import { Link } from '../lib/router'
import styles from './FilteredPage.module.css'

export default function TagPage({ tag }: { tag: string }) {
  const info = getTagInfo(tag)
  const posts = getPostsByTag(tag)

  return (
    <div className="container">
      <Link to="/tags" className={styles.back}>
        <ArrowLeft size={16} aria-hidden="true" />
        全部标签
      </Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Tag</p>
        <h1 className={styles.title}>
          <Hash size={26} aria-hidden="true" className={styles.titleIcon} />
          {tag}
        </h1>
        <p className={styles.subtitle}>共有 {posts.length} 篇内容带有这个标签</p>
      </header>

      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <EmptyState
          title="这个标签还没有内容"
          description="在任意文章的 frontmatter 的 tags 中加入该标签即可出现在这里。"
          action={
            <Link to="/posts" className={styles.actionLink}>
              返回学习内容
            </Link>
          }
        />
      )}

      {info && posts.length > 0 && (
        <p className={styles.hint}>“{info.name}” 标签下最近更新优先展示。</p>
      )}
    </div>
  )
}
