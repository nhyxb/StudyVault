import { BookOpen, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from '../lib/router'
import { useHashLocation } from '../lib/router-core'
import { cn } from '../lib/utils'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'

const navItems = [
  { to: '/', label: '首页', match: (pathname: string) => pathname === '/' },
  {
    to: '/posts',
    label: '学习内容',
    match: (pathname: string) => pathname === '/posts' || pathname.startsWith('/post/'),
  },
  { to: '/categories', label: '分类', match: (pathname: string) => pathname.startsWith('/categories') || pathname.startsWith('/category/') },
  { to: '/tags', label: '标签', match: (pathname: string) => pathname.startsWith('/tags') || pathname.startsWith('/tag/') },
]

export default function Navbar() {
  const { pathname } = useHashLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className={styles.header}>
      <div className={cn('container', styles.inner)}>
        <Link to="/" className={styles.brand} aria-label="Study Vault 首页">
          <span className={styles.logo}>
            <BookOpen size={19} aria-hidden="true" />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Study Vault</span>
            <span className={styles.brandTagline}>记录学习，沉淀知识</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(styles.navLink, item.match(pathname) && styles.active)}
              aria-current={item.match(pathname) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <nav aria-label="移动端导航">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(styles.mobileLink, item.match(pathname) && styles.active)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
