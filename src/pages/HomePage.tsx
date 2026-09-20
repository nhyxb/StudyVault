import {
  ArrowRight,
  BookMarked,
  Flame,
  FolderOpen,
  Hash,
  Search,
  Sparkles,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PostGrid from '../components/PostGrid'
import SearchBar from '../components/SearchBar'
import TiltCard from '../components/TiltCard'
import { site } from '../config/site'
import { getFeaturedPosts, getRecentPosts, getStats } from '../data'
import { useMagnetic } from '../lib/hooks'
import { Link } from '../lib/router'
import { navigate } from '../lib/router-core'
import { useTheme } from '../lib/theme-context'
import { cn } from '../lib/utils'
import styles from './HomePage.module.css'

const HOT_TAGS = ['JavaScript', 'CSS', 'HTTP', 'Async', 'Browser', 'Network'] as const

export default function HomePage() {
  const stats = useMemo(() => getStats(), [])
  const recent = useMemo(() => getRecentPosts(4), [])
  const featured = useMemo(() => getFeaturedPosts().slice(0, 3), [])
  const [query, setQuery] = useState('')
  const { theme } = useTheme()
  const browseMagnetic = useMagnetic<HTMLAnchorElement>(7)

  const handleSearch = useCallback(() => {
    navigate(query.trim() ? `/posts?q=${encodeURIComponent(query.trim())}` : '/posts')
  }, [query])

  return (
    <div className="container">
      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.badge}>
          <Sparkles size={14} aria-hidden="true" />
          个人学习知识库
        </span>
        <h1 className={styles.title}>
          Study <span className={styles.gradient}>Vault</span>
        </h1>
        <p className={styles.heroDescription}>{site.description}</p>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          size="lg"
          className={styles.search}
          placeholder="搜索你想复习的知识点，比如：Event Loop"
        />

        <div className={styles.quickTags}>
          {HOT_TAGS.map((tag) => (
            <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`} className={styles.quickTag}>
              <Search size={12} aria-hidden="true" />
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* 统计 */}
      <section className={styles.stats} aria-label="学习统计">
        <TiltCard className={`${styles.statCard} liquid-glass`}>
          <BookMarked className={styles.statIcon} size={22} aria-hidden="true" />
          <span className={styles.statNumber}>{stats.posts}</span>
          <span className={styles.statLabel}>总文章数</span>
        </TiltCard>
        <TiltCard className={`${styles.statCard} liquid-glass`}>
          <FolderOpen className={styles.statIcon} size={22} aria-hidden="true" />
          <span className={styles.statNumber}>{stats.categories}</span>
          <span className={styles.statLabel}>分类数量</span>
        </TiltCard>
        <TiltCard className={`${styles.statCard} liquid-glass`}>
          <Hash className={styles.statIcon} size={22} aria-hidden="true" />
          <span className={styles.statNumber}>{stats.tags}</span>
          <span className={styles.statLabel}>标签数量</span>
        </TiltCard>
      </section>

      {/* 最近学习 */}
      <section className={styles.section} aria-labelledby="recent-heading">
        <div className={styles.sectionHeader}>
          <h2 id="recent-heading" className={styles.sectionTitle}>
            <Flame size={20} aria-hidden="true" className={styles.sectionIcon} />
            最近学习
          </h2>
          <a
            ref={browseMagnetic.ref}
            href="#/posts"
            className={styles.browseButton}
            onMouseMove={browseMagnetic.onMouseMove}
            onMouseLeave={browseMagnetic.onMouseLeave}
          >
            查看全部
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        {recent.length > 0 ? (
          <PostGrid posts={recent} />
        ) : (
          <EmptyState
            title="还没有学习内容"
            description="在 content/ 目录下添加 Markdown 文件，构建时会自动生成页面。"
          />
        )}
      </section>

      {/* 精选内容 */}
      {featured.length > 0 && (
        <section className={styles.section} aria-labelledby="featured-heading">
          <div className={styles.sectionHeader}>
            <h2 id="featured-heading" className={styles.sectionTitle}>
              <Sparkles size={20} aria-hidden="true" className={styles.sectionIcon} />
              精选内容
            </h2>
            <span className={styles.sectionHint}>值得反复阅读</span>
          </div>
          <div className={styles.featuredGrid}>
            {featured.map((post) => (
              <Link
                key={post.slug}
                to={`/post/${post.slug}`}
                className={cn('liquid-glass', styles.featuredCard)}
              >
                <span className={styles.featuredCategory}>{post.category}</span>
                <span className={styles.featuredTitle}>{post.title}</span>
                <span className={styles.featuredDescription}>{post.description}</span>
                <span className={styles.featuredFooter}>
                  {post.readingTime} 分钟 · {post.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className={styles.themeHint} aria-hidden="true">
        当前主题：{theme === 'dark' ? '深色液态玻璃' : '浅色液态玻璃'}
      </p>
    </div>
  )
}
