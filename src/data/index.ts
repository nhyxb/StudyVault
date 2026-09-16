import type { CategoryInfo, Post, PostFilters, SortOrder, TagInfo } from '../types'
import { categories, posts, tags } from './content.generated'

export { categories, tags }

export const allPosts: Post[] = [...posts].sort((a, b) =>
  (b.updated || b.date).localeCompare(a.updated || a.date),
)

export function getPost(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug)
}

export function getStats(): { posts: number; categories: number; tags: number } {
  return {
    posts: allPosts.length,
    categories: categories.length,
    tags: tags.length,
  }
}

export function getRecentPosts(limit = 4): Post[] {
  return allPosts.slice(0, limit)
}

export function getFeaturedPosts(): Post[] {
  return allPosts.filter((post) => post.featured)
}

export function getPostsByCategory(category: string): Post[] {
  return allPosts.filter((post) => post.category === category)
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((post) => post.tags.includes(tag))
}

export function getCategoryInfo(category: string): CategoryInfo | undefined {
  return categories.find((item) => item.name === category)
}

export function getTagInfo(tag: string): TagInfo | undefined {
  return tags.find((item) => item.name === tag)
}

export function filterPosts(filters: PostFilters): Post[] {
  const query = filters.query?.trim().toLowerCase() ?? ''
  const sort: SortOrder = filters.sort ?? 'newest'

  let result = [...allPosts]

  if (query) {
    result = result.filter((post) =>
      `${post.title}\n${post.description}\n${post.category}\n${post.tags.join(' ')}\n${post.plainText}`
        .toLowerCase()
        .includes(query),
    )
  }
  const category = filters.category
  const tag = filters.tag
  if (category) {
    result = result.filter((post) => post.category === category)
  }
  if (tag) {
    result = result.filter((post) => post.tags.includes(tag))
  }

  result.sort((a, b) =>
    sort === 'oldest'
      ? (a.updated || a.date).localeCompare(b.updated || b.date)
      : (b.updated || b.date).localeCompare(a.updated || a.date),
  )

  return result
}

export function getAdjacentPosts(slug: string): { prev?: Post; next?: Post } {
  const index = allPosts.findIndex((post) => post.slug === slug)
  if (index === -1) return {}
  return {
    prev: index > 0 ? allPosts[index - 1] : undefined,
    next: index < allPosts.length - 1 ? allPosts[index + 1] : undefined,
  }
}
