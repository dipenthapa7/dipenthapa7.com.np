import { useEffect, useRef, useState } from 'react'

/**
 * Animates the first number found inside `value` from 0 up to its target when
 * the element scrolls into view. Any surrounding text (prefixes like "~",
 * suffixes like "%" or " YEARS") is preserved. Non-numeric values render as-is.
 * Respects prefers-reduced-motion by showing the final value immediately.
 */
export default function CountUp({
  value,
  duration = 1400,
  className,
  style,
}: {
  value: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const match = value.match(/-?\d[\d,]*\.?\d*/)
  const target = match ? parseFloat(match[0].replace(/,/g, '')) : null
  const decimals = match && match[0].includes('.') ? (match[0].split('.')[1]?.length ?? 0) : 0

  const [display, setDisplay] = useState<number>(target ?? 0)
  const started = useRef(false)

  useEffect(() => {
    if (target === null) return
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(target)
      return
    }

    setDisplay(0)
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        obs.disconnect()
        const start = performance.now()
        const ease = (t: number) => 1 - Math.pow(1 - t, 3) // ease-out cubic
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setDisplay(target * ease(t))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  if (target === null) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    )
  }

  const shown = display.toFixed(decimals)
  const rendered = value.replace(match![0], shown)

  return (
    <span ref={ref} className={className} style={style}>
      {rendered}
    </span>
  )
}
