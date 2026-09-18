import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { builtinWallpapers, defaultWallpaperId } from '../config/wallpapers'
import {
  WallpaperContext,
  isValidWallpaperUrl,
  wallpaperSelectionSrc,
  type WallpaperSelection,
} from './wallpaper-context'

const STORAGE_KEY = 'sv-wallpaper'

const defaultSelection: WallpaperSelection = { type: 'builtin', id: defaultWallpaperId }

function parseSelection(raw: string | null): WallpaperSelection {
  if (!raw) return defaultSelection
  try {
    const value = JSON.parse(raw) as { type?: unknown; id?: unknown; url?: unknown }
    if (value.type === 'none') return { type: 'none' }
    if (value.type === 'custom' && typeof value.url === 'string' && isValidWallpaperUrl(value.url)) {
      return { type: 'custom', url: value.url }
    }
    if (
      value.type === 'builtin' &&
      typeof value.id === 'string' &&
      builtinWallpapers.some((item) => item.id === value.id)
    ) {
      return { type: 'builtin', id: value.id }
    }
  } catch {
    // 数据损坏时回退默认壁纸
  }
  return defaultSelection
}

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<WallpaperSelection>(() => {
    if (typeof window === 'undefined') return defaultSelection
    return parseSelection(window.localStorage.getItem(STORAGE_KEY))
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
    } catch {
      // localStorage 不可用时静默降级
    }
  }, [selection])

  const select = useCallback((next: WallpaperSelection) => {
    setSelection(next)
  }, [])

  const src = useMemo(() => wallpaperSelectionSrc(selection), [selection])
  const value = useMemo(() => ({ selection, src, select }), [selection, src, select])

  return <WallpaperContext.Provider value={value}>{children}</WallpaperContext.Provider>
}
