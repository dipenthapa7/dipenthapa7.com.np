import { useEffect, useRef } from 'react'

/**
 * Site-wide signature interaction: a soft particle ribbon that trails the
 * cursor. Each pointer move spawns short-lived violet embers that drift and
 * fade, drawn on a single full-viewport canvas with additive blending.
 * Desktop-only (skipped on coarse pointers) and disabled for reduced-motion.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    type P = {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      max: number
      size: number
      hue: number
    }
    const parts: P[] = []
    const last = { x: 0, y: 0, has: false }
    const COLORS = ['196,181,253', '167,139,250', '129,140,248']

    const onMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      if (last.has) {
        const dx = x - last.x
        const dy = y - last.y
        const dist = Math.hypot(dx, dy)
        // Emit proportionally to speed, capped so fast flicks stay cheap.
        const count = Math.min(4, Math.floor(dist / 8))
        for (let i = 0; i < count; i++) {
          const t = i / Math.max(1, count)
          parts.push({
            x: last.x + dx * t + (Math.random() - 0.5) * 4,
            y: last.y + dy * t + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12 - 6,
            life: 0,
            max: 0.5 + Math.random() * 0.5,
            size: 1 + Math.random() * 2.2,
            hue: Math.floor(Math.random() * COLORS.length),
          })
        }
      }
      last.x = x
      last.y = y
      last.has = true
    }

    let raf = 0
    let prev = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life += dt
        if (p.life >= p.max) {
          parts.splice(i, 1)
          continue
        }
        p.vy += 14 * dt // gentle downward drift
        p.vx *= 0.94
        p.vy *= 0.96
        p.x += p.vx
        p.y += p.vy
        const k = 1 - p.life / p.max
        ctx.globalAlpha = k * 0.7
        ctx.fillStyle = `rgba(${COLORS[p.hue]},1)`
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(${COLORS[p.hue]},0.8)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * k + 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  )
}
