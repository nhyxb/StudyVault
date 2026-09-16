import { useEffect, type CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import styles from './Background.module.css'

interface BlobStyle extends CSSProperties {
  '--drift': string
  '--parallax': string
}

export default function Background() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    let raf = 0
    let targetX = 0.5
    let targetY = 0.42
    let currentX = targetX
    let currentY = targetY

    const handleMove = (event: MouseEvent) => {
      targetX = event.clientX / window.innerWidth
      targetY = event.clientY / window.innerHeight
    }

    const tick = () => {
      // 缓动插值，让光晕“缓慢跟随”鼠标，而不是生硬贴附
      currentX += (targetX - currentX) * 0.045
      currentY += (targetY - currentY) * 0.045
      const root = document.documentElement
      root.style.setProperty('--cursor-x', currentX.toFixed(4))
      root.style.setProperty('--cursor-y', currentY.toFixed(4))
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div className={styles.bg} aria-hidden="true">
      <div className={styles.base} />
      <div className={`${styles.blob} ${styles.blob1}`} style={{ '--drift': '30px', '--parallax': '0.6' } as BlobStyle} />
      <div className={`${styles.blob} ${styles.blob2}`} style={{ '--drift': '58px', '--parallax': '1' } as BlobStyle} />
      <div className={`${styles.blob} ${styles.blob3}`} style={{ '--drift': '88px', '--parallax': '1.4' } as BlobStyle} />
      <div className={`${styles.blob} ${styles.blob4}`} style={{ '--drift': '120px', '--parallax': '1.8' } as BlobStyle} />
      <div className={styles.noise} />
      <div className={styles.vignette} />
    </div>
  )
}
