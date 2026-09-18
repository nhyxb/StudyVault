import { Check, Image as ImageIcon, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { builtinWallpaperSrc, builtinWallpapers } from '../config/wallpapers'
import { useMagnetic } from '../lib/hooks'
import { cn } from '../lib/utils'
import {
  isValidWallpaperUrl,
  useWallpaper,
  type WallpaperSelection,
} from '../lib/wallpaper-context'
import styles from './WallpaperPicker.module.css'

export default function WallpaperPicker() {
  const { selection, select } = useWallpaper()
  const [open, setOpen] = useState(false)
  const [customUrl, setCustomUrl] = useState(selection.type === 'custom' ? selection.url : '')
  const [error, setError] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const magnetic = useMagnetic<HTMLButtonElement>(5)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const choose = (next: WallpaperSelection) => {
    select(next)
    setError('')
    setOpen(false)
  }

  const applyCustom = () => {
    const url = customUrl.trim()
    if (!isValidWallpaperUrl(url)) {
      setError('请输入以 http:// 或 https:// 开头的图片链接')
      return
    }
    choose({ type: 'custom', url })
  }

  const isNone = selection.type === 'none'

  return (
    <div className={styles.wrapper} ref={rootRef}>
      <button
        ref={magnetic.ref}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        onMouseMove={magnetic.onMouseMove}
        onMouseLeave={magnetic.onMouseLeave}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="切换壁纸"
        title="切换壁纸"
      >
        <span className={styles.triggerIcon}>
          <ImageIcon size={15} aria-hidden="true" />
        </span>
        <span className={styles.triggerLabel}>壁纸</span>
      </button>

      {open && (
        <div
          className={cn('liquid-glass', 'liquid-glass--dense', styles.panel)}
          role="dialog"
          aria-label="选择壁纸"
        >
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>选择壁纸</span>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              aria-label="关闭壁纸面板"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.grid}>
            {builtinWallpapers.map((wallpaper) => {
              const active = selection.type === 'builtin' && selection.id === wallpaper.id
              return (
                <button
                  key={wallpaper.id}
                  type="button"
                  className={cn(styles.option, active && styles.optionActive)}
                  onClick={() => choose({ type: 'builtin', id: wallpaper.id })}
                  aria-pressed={active}
                >
                  <img
                    src={builtinWallpaperSrc(wallpaper.file)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.optionName}>{wallpaper.name}</span>
                  {active && <Check className={styles.optionCheck} size={13} aria-hidden="true" />}
                </button>
              )
            })}
            <button
              type="button"
              className={cn(styles.option, isNone && styles.optionActive)}
              onClick={() => choose({ type: 'none' })}
              aria-pressed={isNone}
            >
              <span className={styles.gradientSwatch} />
              <span className={styles.optionName}>纯渐变</span>
              {isNone && <Check className={styles.optionCheck} size={13} aria-hidden="true" />}
            </button>
          </div>

          <div className={styles.custom}>
            <label className={styles.customLabel} htmlFor="wallpaper-url">
              自定义图片 URL
            </label>
            <div className={styles.customRow}>
              <input
                id="wallpaper-url"
                className={styles.input}
                type="url"
                value={customUrl}
                placeholder="https://example.com/photo.jpg"
                onChange={(event) => {
                  setCustomUrl(event.target.value)
                  setError('')
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    applyCustom()
                  }
                }}
              />
              <button type="button" className={styles.applyButton} onClick={applyCustom}>
                应用
              </button>
            </div>
            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : (
              <p className={styles.hint}>支持 http(s) 图片直链，仅保存在当前浏览器</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
