import { ArrowLeft, FolderOpen } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import PostGrid from '../components/PostGrid'
import { getCategoryInfo, getPostsByCategory } from '../data'
import { Link } from '../lib/router'
import styles from './FilteredPage.module.css'

export default function CategoryPage({ category }: { category: string }) {
  const info = getCategoryInfo(category)
  const posts = getPostsByCategory(category)

  return (
    <div className="container">
      <Link to="/categories" className={styles.back}>
        <ArrowLeft size={16} aria-hidden="true" />
        全部分类
      </Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Category</p>
        <h1 className={styles.title}>
          <FolderOpen size={26} aria-hidden="true" className={styles.titleIcon} />
          {category}
        </h1>
        <p className={styles.subtitle}>该分类下共有 {posts.length} 篇学习内容</p>
      </header>

      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <EmptyState
          title="这个分类还没有内容"
          description="在 content/ 目录下为这个分类添加 Markdown 文件吧。"
          action={
            <Link to="/posts" className={styles.actionLink}>
              返回学习内容
            </Link>
          }
        />
      )}

      {info && posts.length > 0 && (
        <p className={styles.hint}>“{info.name}” 分类下最近更新优先展示。</p>
      )}
    </div>
  )
}
