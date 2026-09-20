import { lazy, Suspense, type ReactNode } from 'react'
import Background from './components/Background'
import LiquidGlassDefs from './components/LiquidGlassDefs'
import ScrollToTop from './components/ScrollToTop'
import MainLayout from './layouts/MainLayout'
import { RouterProvider } from './lib/router'
import { matchPath, useHashLocation } from './lib/router-core'
import { ThemeProvider } from './lib/theme'
import { WallpaperProvider } from './lib/wallpaper'
import HomePage from './pages/HomePage'

const PostsPage = lazy(() => import('./pages/PostsPage'))
const PostPage = lazy(() => import('./pages/PostPage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const TagsPage = lazy(() => import('./pages/TagsPage'))
const TagPage = lazy(() => import('./pages/TagPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function AppRoutes() {
  const { pathname } = useHashLocation()

  const postMatch = matchPath('/post/:slug', pathname)
  const categoryMatch = matchPath('/category/:name', pathname)
  const tagMatch = matchPath('/tag/:name', pathname)

  let page: ReactNode
  if (pathname === '/') {
    page = <HomePage />
  } else if (pathname === '/posts') {
    page = <PostsPage />
  } else if (pathname === '/categories') {
    page = <CategoriesPage />
  } else if (pathname === '/tags') {
    page = <TagsPage />
  } else if (postMatch) {
    page = <PostPage slug={postMatch.params.slug} />
  } else if (categoryMatch) {
    page = <CategoryPage category={categoryMatch.params.name} />
  } else if (tagMatch) {
    page = <TagPage tag={tagMatch.params.name} />
  } else {
    page = <NotFoundPage />
  }

  return (
    <MainLayout>
      <Suspense fallback={<div className="container" style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.6 }}>加载中…</div>}>
        {page}
      </Suspense>
    </MainLayout>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <RouterProvider>
          <Background />
          <LiquidGlassDefs />
          <AppRoutes />
          <ScrollToTop />
        </RouterProvider>
      </WallpaperProvider>
    </ThemeProvider>
  )
}
