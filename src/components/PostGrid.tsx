import { memo } from 'react'
import type { Post } from '../types'
import PostCard from './PostCard'
import styles from './PostGrid.module.css'

interface PostGridProps {
  posts: Post[]
}

function PostGrid({ posts }: PostGridProps) {
  if (posts.length === 0) return null
  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}

export default memo(PostGrid)
