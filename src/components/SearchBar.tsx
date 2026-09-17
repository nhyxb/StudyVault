import { Search, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMagnetic } from '../lib/hooks'
import { cn } from '../lib/utils'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  size?: 'md' | 'lg'
  autoFocus?: boolean
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = '搜索标题、标签或正文内容…',
  size = 'md',
  autoFocus = false,
  className,
}: SearchBarProps) {
  const magnetic = useMagnetic<HTMLButtonElement>(5)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      role="search"
      className={cn('liquid-glass', styles.form, size === 'lg' ? styles.lg : styles.md, className)}
      onSubmit={handleSubmit}
    >
      <Search className={styles.icon} size={size === 'lg' ? 22 : 18} aria-hidden="true" />
      <input
        className={styles.input}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="搜索学习内容"
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="清空搜索"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
      <button
        ref={magnetic.ref}
        type="submit"
        className={styles.submit}
        onMouseMove={magnetic.onMouseMove}
        onMouseLeave={magnetic.onMouseLeave}
        aria-label="执行搜索"
      >
        搜索
      </button>
    </form>
  )
}
