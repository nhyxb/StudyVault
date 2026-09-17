import type { ReactNode } from 'react'
import Background from './components/Background'
import LiquidGlassDefs from './components/LiquidGlassDefs'
import ScrollToTop from './components/ScrollToTop'
import MainLayout from './layouts/MainLayout'
import { RouterProvider } from './lib/router'
import { matchPath, useHashLocation } from './lib/router-core'
import { ThemeProvider } from './lib/theme'
import CategoriesPage from './pages/CategoriesPage'
import CategoryPage from './pages/CategoryPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PostPage from './pages/PostPage'
import PostsPage from './pages/PostsPage'
import TagPage from './pages/TagPage'
import TagsPage from './pages/TagsPage'

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

  return <MainLayout>{page}</MainLayout>
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <Background />
        <LiquidGlassDefs />
        <AppRoutes />
        <ScrollToTop />
      </RouterProvider>
    </ThemeProvider>
  )
}
