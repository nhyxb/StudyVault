import { useEffect } from 'react'
import { useHashLocation } from '../lib/router-core'

export default function ScrollToTop() {
  const { pathname } = useHashLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
