import { useEffect, useState, type CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import styles from './Background.module.css'

interface BlobStyle extends CSSProperties {
  '--drift': string
  '--parallax': string
}

/**
 * 壁纸约定：直接替换 public/wallpaper.jpg 即可换图，页面代码无需改动。
 * 文件名固定，格式必须为 jpg；建议 2400×1500 以上、横向、体积 < 1MB。
 * 想恢复纯渐变背景，删除该文件即可（加载失败时自动降级，不会出现破图）。
 */
const WALLPAPER_SRC = `${import.meta.env.BASE_URL}wallpaper.jpg`

export default function Background() {
  const reduced = usePrefersReducedMotion()
  const [hasWallpaper, setHasWallpaper] = useState(true)

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
      {hasWallpaper && (
        <div className={styles.wallpaper}>
          <img
            className={styles.wallpaperImg}
            src={WALLPAPER_SRC}
            alt=""
            decoding="async"
            fetchPriority="high"
            onError={() => setHasWallpaper(false)}
          />
          <div className={styles.wallpaperScrim} />
        </div>
      )}
      <div className={styles.lightVeil} />
      <div className={`${styles.blob} ${styles.blob1}`} style={{ '--drift': '30px', '--parallax': '0.6' } as BlobStyle} />
      <div className={`${styles.blob} ${styles.blob2}`} style={{ '--drift': '58px', '--parallax': '1' } as BlobStyle} />
      <div className={`${styles.blob} ${styles.blob3}`} style={{ '--drift': '88px', '--parallax': '1.4' } as BlobStyle} />
      <div className={`${styles.blob} ${styles.blob4}`} style={{ '--drift': '120px', '--parallax': '1.8' } as BlobStyle} />
      <div className={styles.noise} />
      <div className={styles.vignette} />
    </div>
  )
}
