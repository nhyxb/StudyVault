import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { generateContent } from './scripts/generate-content.mjs'

/**
 * 在构建收尾阶段生成 sitemap.xml 与 robots.txt。
 * 使用 hash 路由，站点始终由 dist/index.html 承载，
 * 因此资源与路由都兼容 GitHub Pages 的项目子路径。
 */
function sitemapPlugin(siteUrl: string): Plugin {
  let outDir = 'dist'
  return {
    name: 'study-vault-sitemap',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    async closeBundle() {
      await generateContent({
        root: process.cwd(),
        outDir,
        siteUrl,
        writeSitemap: true,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = env.VITE_SITE_URL || 'https://YOUR_USERNAME.github.io/study-vault'

  return {
    // 相对 base：无论仓库名是什么，部署到 GitHub Pages 项目路径都能直接访问
    base: './',
    plugins: [react(), sitemapPlugin(siteUrl)],
    server: {
      host: true,
    },
    build: {
      target: 'es2020',
      sourcemap: false,
    },
  }
})
