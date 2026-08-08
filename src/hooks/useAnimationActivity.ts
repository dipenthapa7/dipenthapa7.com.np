import { type RefObject, useEffect, useState } from 'react'

/**
 * Keeps decorative animation work active only while its section is visible
 * and the document is in the foreground.
 */
export default function useAnimationActivity<T extends Element>(
  ref: RefObject<T | null>,
  rootMargin = '160px',
) {
  const [inView, setInView] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'hidden',
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  useEffect(() => {
    const onVisibilityChange = () =>
      setDocumentVisible(document.visibilityState !== 'hidden')

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return inView && documentVisible
}
