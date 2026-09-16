import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import styles from './ReadingProgress.module.css'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = requestAnimationFrame(() => {
        const root = document.documentElement
        const max = root.scrollHeight - root.clientHeight
        setProgress(max > 0 ? root.scrollTop / max : 0)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (reduced) return null

  return (
    <div
      className={styles.progress}
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  )
}
