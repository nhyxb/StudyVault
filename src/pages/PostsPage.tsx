import { FilterX, Library } from 'lucide-react'
import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PostGrid from '../components/PostGrid'
import SearchBar from '../components/SearchBar'
import { filterPosts } from '../data'
import { categories, tags } from '../data'
import { navigate, useHashLocation } from '../lib/router-core'
import { cn } from '../lib/utils'
import styles from './PostsPage.module.css'

export default function PostsPage() {
  const { search } = useHashLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])

  const category = params.get('category') ?? ''
  const tag = params.get('tag') ?? ''
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest'
  const [query, setQuery] = useState(params.get('q') ?? '')

  const filtered = useMemo(
    () => filterPosts({ query, category, tag, sort }),
    [query, category, tag, sort],
  )

  const hasFilters = Boolean(query.trim() || category || tag || sort !== 'newest')

  const applyParams = (patch: { category?: string; tag?: string; sort?: string }) => {
    const next = new URLSearchParams(search)
    for (const [key, value] of Object.entries(patch)) {
      if (value && value !== '' && value !== 'newest') next.set(key, value)
      else next.delete(key)
    }
    const qs = next.toString()
    navigate(qs ? `/posts?${qs}` : '/posts')
  }

  const clearFilters = () => {
    setQuery('')
    navigate('/posts')
  }

  return (
    <div className="container">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Knowledge Base</p>
        <h1 className={styles.title}>
          <Library size={26} aria-hidden="true" className={styles.titleIcon} />
          学习内容
        </h1>
        <p className={styles.subtitle}>共 {filtered.length} 篇笔记，可搜索、筛选与排序</p>
      </header>

      <div className={styles.toolbar}>
        <SearchBar
          value={query}
          onChange={setQuery}
          className={styles.search}
          placeholder="搜索标题、标签或正文内容…"
        />
        <div className={styles.filters}>
          <label className={styles.selectWrap}>
            <span className={styles.selectLabel}>分类</span>
            <select
              className={styles.select}
              value={category}
              onChange={(event) => applyParams({ category: event.target.value })}
              aria-label="按分类筛选"
            >
              <option value="">全部分类</option>
              {categories.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}（{item.count}）
                </option>
              ))}
            </select>
          </label>

          <label className={styles.selectWrap}>
            <span className={styles.selectLabel}>标签</span>
            <select
              className={styles.select}
              value={tag}
              onChange={(event) => applyParams({ tag: event.target.value })}
              aria-label="按标签筛选"
            >
              <option value="">全部标签</option>
              {tags.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}（{item.count}）
                </option>
              ))}
            </select>
          </label>

          <label className={styles.selectWrap}>
            <span className={styles.selectLabel}>排序</span>
            <select
              className={styles.select}
              value={sort}
              onChange={(event) => applyParams({ sort: event.target.value })}
              aria-label="按更新时间排序"
            >
              <option value="newest">最近更新</option>
              <option value="oldest">最早更新</option>
            </select>
          </label>

          {hasFilters && (
            <button type="button" className={styles.clearButton} onClick={clearFilters}>
              <FilterX size={15} aria-hidden="true" />
              清除筛选
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <PostGrid posts={filtered} />
      ) : (
        <EmptyState
          title="没有找到匹配的内容"
          description="换一个关键词，或者清除分类、标签筛选后再试试。"
          action={
            <button
              type="button"
              className={cn(styles.clearButton, styles.emptyAction)}
              onClick={clearFilters}
            >
              清除所有筛选
            </button>
          }
        />
      )}
    </div>
  )
}
