import { Moon, Sun } from 'lucide-react'
import { useMagnetic } from '../lib/hooks'
import { useTheme } from '../lib/theme-context'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const magnetic = useMagnetic<HTMLButtonElement>(5)

  return (
    <button
      ref={magnetic.ref}
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
      title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
    >
      <span className={styles.track}>
        {theme === 'dark' ? (
          <Moon size={15} aria-hidden="true" />
        ) : (
          <Sun size={15} aria-hidden="true" />
        )}
      </span>
      <span className={styles.label}>{theme === 'dark' ? '深色' : '浅色'}</span>
    </button>
  )
}
