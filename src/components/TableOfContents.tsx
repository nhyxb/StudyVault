import { useEffect, useState } from 'react'
import { ListTree } from 'lucide-react'
import type { Heading } from '../types'
import { usePrefersReducedMotion } from '../lib/hooks'
import { cn } from '../lib/utils'
import styles from './TableOfContents.module.css'

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-90px 0px -70% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <nav className={`${styles.toc} liquid-glass`} aria-label="文章目录">
      <p className={styles.title}>
        <ListTree size={15} aria-hidden="true" /> 目录
      </p>
      <ul className={styles.list}>
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? styles.sub : undefined}>
            <button
              type="button"
              className={cn(styles.item, activeId === heading.id && styles.active)}
              onClick={() => handleClick(heading.id)}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
