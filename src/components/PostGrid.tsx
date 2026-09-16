import type { Post } from '../types'
import PostCard from './PostCard'
import styles from './PostGrid.module.css'

export default function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null
  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
