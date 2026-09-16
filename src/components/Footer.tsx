import { BookOpen } from 'lucide-react'
import { site } from '../config/site'
import { Link } from '../lib/router'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.brand}>
            <BookOpen size={18} aria-hidden="true" />
            <span>{site.name}</span>
          </div>
          <p className={styles.tagline}>{site.tagline}</p>
          <nav className={styles.links} aria-label="页脚导航">
            <Link to="/posts">学习内容</Link>
            <Link to="/categories">分类</Link>
            <Link to="/tags">标签</Link>
          </nav>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {site.name} · 用 Markdown 沉淀的长期知识库
          </p>
        </div>
      </div>
    </footer>
  )
}
