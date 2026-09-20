import { ArrowRight, Clock3, Sparkles } from 'lucide-react'
import { memo } from 'react'
import type { Post } from '../types'
import { formatDate } from '../lib/utils'
import { Link } from '../lib/router'
import TiltCard from './TiltCard'
import styles from './PostCard.module.css'

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  return (
    <TiltCard className={`${styles.card} liquid-glass`}>
      <div className={styles.topRow}>
        <Link
          to={`/category/${encodeURIComponent(post.category)}`}
          className={styles.category}
        >
          {post.category}
        </Link>
        {post.featured && (
          <span className={styles.featured}>
            <Sparkles size={13} aria-hidden="true" /> 精选
          </span>
        )}
        <span className={styles.date}>{formatDate(post.updated)}</span>
      </div>

      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.description}>{post.description}</p>

      <div className={styles.tags}>
        {post.tags.map((tag) => (
          <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`} className={styles.tag}>
            #{tag}
          </Link>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.readingTime}>
          <Clock3 size={14} aria-hidden="true" />
          {post.readingTime} 分钟
        </span>
        <span className={styles.readMore}>
          阅读全文 <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>

      <Link
        to={`/post/${post.slug}`}
        className={styles.stretchedLink}
        aria-label={`阅读全文：${post.title}`}
      />
    </TiltCard>
  )
}

export default memo(PostCard)
