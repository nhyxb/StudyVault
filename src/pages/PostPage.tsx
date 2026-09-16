import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FolderOpen,
  Hash,
  RefreshCw,
} from 'lucide-react'
import EmptyState from '../components/EmptyState'
import MarkdownView from '../components/MarkdownView'
import ReadingProgress from '../components/ReadingProgress'
import TableOfContents from '../components/TableOfContents'
import { getAdjacentPosts, getPost } from '../data'
import { Link } from '../lib/router'
import { formatDate } from '../lib/utils'
import styles from './PostPage.module.css'

export default function PostPage({ slug }: { slug: string }) {
  const post = getPost(slug)

  if (!post) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <EmptyState
            title="文章不存在"
            description="它可能被移动或重命名了。去看看其他学习内容吧。"
            action={
              <Link to="/posts" className={styles.notFoundAction}>
                返回学习内容
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  const { prev, next } = getAdjacentPosts(slug)

  return (
    <div className="container">
      <ReadingProgress />

      <div className={styles.layout}>
        <article className={styles.article}>
          <Link to="/posts" className={styles.back}>
            <ArrowLeft size={16} aria-hidden="true" />
            返回学习内容
          </Link>

          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.description}>{post.description}</p>

            <div className={styles.meta}>
              <Link
                to={`/category/${encodeURIComponent(post.category)}`}
                className={styles.metaItem}
              >
                <FolderOpen size={14} aria-hidden="true" />
                {post.category}
              </Link>
              <span className={styles.metaItem}>
                <CalendarDays size={14} aria-hidden="true" />
                更新于 {formatDate(post.updated)}
              </span>
              <span className={styles.metaItem}>
                <Clock3 size={14} aria-hidden="true" />
                {post.readingTime} 分钟
              </span>
              <span className={styles.metaItem}>
                <RefreshCw size={14} aria-hidden="true" />
                创建于 {formatDate(post.date)}
              </span>
            </div>

            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`} className={styles.tag}>
                  <Hash size={12} aria-hidden="true" />
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          {/* 移动端折叠目录 */}
          <details className={styles.mobileToc}>
            <summary>目录</summary>
            <TableOfContents headings={post.headings} />
          </details>

          <MarkdownView html={post.html} />

          <nav className={styles.pagination} aria-label="文章导航">
            {prev ? (
              <Link to={`/post/${prev.slug}`} className={styles.paginationItem}>
                <span className={styles.paginationLabel}>
                  <ArrowLeft size={13} aria-hidden="true" /> 上一篇
                </span>
                <span className={styles.paginationTitle}>{prev.title}</span>
              </Link>
            ) : (
              <span className={styles.paginationSpacer} />
            )}
            {next ? (
              <Link to={`/post/${next.slug}`} className={styles.paginationItemRight}>
                <span className={styles.paginationLabel}>
                  下一篇 <ArrowRight size={13} aria-hidden="true" />
                </span>
                <span className={styles.paginationTitle}>{next.title}</span>
              </Link>
            ) : (
              <span className={styles.paginationSpacer} />
            )}
          </nav>
        </article>

        <aside className={styles.aside}>
          <div className={styles.tocSticky}>
            <TableOfContents headings={post.headings} />
          </div>
        </aside>
      </div>
    </div>
  )
}
