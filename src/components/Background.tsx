import { useEffect, useState, type CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import { useWallpaper } from '../lib/wallpaper-context'
import styles from './Background.module.css'

interface BlobStyle extends CSSProperties {
  '--drift': string
  '--parallax': string
}

/**
 * 壁纸由 WallpaperProvider 控制（内置清单 / 纯渐变 / 自定义 URL）。
 * 图片加载失败时自动降级为纯渐变，不会出现破图。
 */
export default function Background() {
  const reduced = usePrefersReducedMotion()
  const { src } = useWallpaper()
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

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
      {src && src !== failedSrc && (
        <div key={src} className={styles.wallpaper}>
          <img
            className={styles.wallpaperImg}
            src={src}
            alt=""
            decoding="async"
            fetchPriority="high"
            onError={() => setFailedSrc(src)}
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
