export interface Heading {
  id: string
  text: string
  level: number
}

export interface Post {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  updated: string
  featured: boolean
  readingTime: number
  headings: Heading[]
  plainText: string
  html: string
}

export interface CategoryInfo {
  name: string
  count: number
}

export interface TagInfo {
  name: string
  count: number
}

export type SortOrder = 'newest' | 'oldest'

export interface PostFilters {
  query?: string
  category?: string
  tag?: string
  sort?: SortOrder
}
