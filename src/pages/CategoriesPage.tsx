import { FolderOpen } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import TiltCard from '../components/TiltCard'
import { categories } from '../data'
import { Link } from '../lib/router'
import styles from './CategoriesPage.module.css'

export default function CategoriesPage() {
  return (
    <div className="container">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Categories</p>
        <h1 className={styles.title}>分类</h1>
        <p className={styles.subtitle}>按主题浏览所有学习内容，共 {categories.length} 个分类</p>
      </header>

      {categories.length > 0 ? (
        <div className={styles.grid}>
          {categories.map((item) => (
            <TiltCard key={item.name} className={`${styles.card} liquid-glass`}>
              <FolderOpen size={22} aria-hidden="true" className={styles.icon} />
              <div className={styles.text}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.count}>{item.count} 篇内容</span>
              </div>
              <Link
                to={`/category/${encodeURIComponent(item.name)}`}
                className={styles.stretchedLink}
                aria-label={`查看分类：${item.name}`}
              />
            </TiltCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="还没有分类"
          description="在 content/ 下创建目录并写入 Markdown，构建时会自动生成分类。"
        />
      )}
    </div>
  )
}
