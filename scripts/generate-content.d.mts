export interface GenerateContentOptions {
  root?: string
  outDir?: string
  siteUrl?: string
  writeSitemap?: boolean
}

export declare function generateContent(options?: GenerateContentOptions): Promise<void>
