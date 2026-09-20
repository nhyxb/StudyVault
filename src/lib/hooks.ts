import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReduced(query.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return reduced
}

/**
 * 磁吸交互：按钮轻微跟随鼠标移动，离开后平滑回弹。
 * 直接返回 ref 与事件处理器，既可挂在 <button> 上，也可挂在 <a> 上。
 */
export function useMagnetic<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T>(null)
  const reduced = usePrefersReducedMotion()

  const onMouseMove = useCallback((event: ReactMouseEvent<T>) => {
    const el = ref.current
    if (!el || reduced) return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * strength
    const y = ((event.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * strength
    el.style.transition = 'transform 80ms ease-out'
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
  }, [reduced, strength])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = 'translate(0px, 0px)'
  }, [])

  return useMemo(() => ({ ref, onMouseMove, onMouseLeave }), [onMouseMove, onMouseLeave])
}
