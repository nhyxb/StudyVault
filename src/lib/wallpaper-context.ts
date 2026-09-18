import { createContext, useContext } from 'react'
import { builtinWallpaperSrc, builtinWallpapers, defaultWallpaperId } from '../config/wallpapers'

export type WallpaperSelection =
  | { type: 'builtin'; id: string }
  | { type: 'none' }
  | { type: 'custom'; url: string }

export interface WallpaperContextValue {
  selection: WallpaperSelection
  /** 当前壁纸图片地址；选择「纯渐变」时为 null */
  src: string | null
  select: (selection: WallpaperSelection) => void
}

/** 自定义壁纸只接受 http(s) 直链，避免 javascript: 等危险协议。 */
export function isValidWallpaperUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function wallpaperSelectionSrc(selection: WallpaperSelection): string | null {
  if (selection.type === 'none') return null
  if (selection.type === 'custom') return selection.url
  const wallpaper = builtinWallpapers.find((item) => item.id === selection.id)
  return wallpaper ? builtinWallpaperSrc(wallpaper.file) : null
}

export const WallpaperContext = createContext<WallpaperContextValue>({
  selection: { type: 'builtin', id: defaultWallpaperId },
  src: null,
  select: () => undefined,
})

export function useWallpaper(): WallpaperContextValue {
  return useContext(WallpaperContext)
}
