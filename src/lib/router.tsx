import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { parseLocation, useLocationContext } from './router-core'

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(parseLocation)
  const LocationContext = useLocationContext()

  useEffect(() => {
    const handleChange = () => setLocation(parseLocation())
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  return (
    <LocationContext.Provider value={location}>{children}</LocationContext.Provider>
  )
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
}

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  )
}
