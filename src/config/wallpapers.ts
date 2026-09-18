export interface BuiltinWallpaper {
  id: string
  name: string
  /** 相对站点 base 的路径，文件位于 public/ 下 */
  file: string
}

/** 内置壁纸清单：往 public/wallpapers/ 添加图片后在这里登记即可扩充。 */
export const builtinWallpapers: BuiltinWallpaper[] = [
  { id: 'default', name: '默认', file: 'wallpapers/default.jpg' },
  { id: 'aurora', name: '极光', file: 'wallpapers/aurora.jpg' },
  { id: 'dusk', name: '暮色', file: 'wallpapers/dusk.jpg' },
  { id: 'wolf', name: '狼', file: 'wallpapers/wolf.webp' },
]

export const defaultWallpaperId = 'default'

export function builtinWallpaperSrc(file: string): string {
  return `${import.meta.env.BASE_URL}${file}`
}
