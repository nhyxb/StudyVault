import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../lib/hooks'
import { cn } from '../lib/utils'
import styles from './TiltCard.module.css'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
}

/**
 * 玻璃卡片：鼠标靠近时产生轻微 3D tilt 与跟随高光，离开后平滑恢复。
 */
export default function TiltCard({ children, className, style, maxTilt = 4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || reduced) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rotateX = (0.5 - py) * maxTilt
    const rotateY = (px - 0.5) * maxTilt
    el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`)
    el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`)
    el.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`)
    el.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`)
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      className={cn(styles.card, className)}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
