import { createContext, useContext } from 'react'

export interface HashLocation {
  pathname: string
  search: string
}

export interface RouteMatch {
  params: Record<string, string>
}

const LocationContext = createContext<HashLocation>({ pathname: '/', search: '' })

export function parseLocation(): HashLocation {
  if (typeof window === 'undefined') return { pathname: '/', search: '' }
  const raw = window.location.hash.replace(/^#/, '')
  const queryIndex = raw.indexOf('?')
  if (queryIndex === -1) return { pathname: raw || '/', search: '' }
  return {
    pathname: raw.slice(0, queryIndex) || '/',
    search: raw.slice(queryIndex),
  }
}

export function useHashLocation(): HashLocation {
  return useContext(LocationContext)
}

export function useLocationContext() {
  return LocationContext
}

export function navigate(to: string): void {
  window.location.hash = to
}

export function matchPath(pattern: string, pathname: string): RouteMatch | null {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)
  if (patternParts.length !== pathParts.length) return null

  const params: Record<string, string> = {}
  for (let i = 0; i < patternParts.length; i += 1) {
    const part = patternParts[i]
    if (part.startsWith(':')) {
      params[part.slice(1)] = decodeURIComponent(pathParts[i])
    } else if (part !== pathParts[i]) {
      return null
    }
  }
  return { params }
}
