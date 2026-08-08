import { useEffect, useMemo, useRef, useState } from 'react'
import useAnimationActivity from '../hooks/useAnimationActivity'
import WebGLOrb from './WebGLOrb'

type Plane = 'bg' | 'mid' | 'fg'

interface Node {
  label: string
  icon: string
  x: number // % within the square stage
  y: number
  plane: Plane
  phase: number // drift phase seed
}

// Genuine, verified technologies only — intentionally asymmetric constellation.
// Upper-left is deliberately left as negative space.
const NODES: Node[] = [
  { label: 'Python', icon: 'Py', x: 79, y: 19, plane: 'fg', phase: 0.0 },
  { label: 'scikit-learn', icon: 'SK', x: 65, y: 31, plane: 'mid', phase: 1.1 },
  { label: 'Pandas', icon: 'Pd', x: 84, y: 57, plane: 'fg', phase: 2.3 },
  { label: 'Git', icon: '⑃', x: 73, y: 75, plane: 'mid', phase: 3.0 },
  { label: 'Streamlit', icon: '▶', x: 50, y: 87, plane: 'mid', phase: 4.2 },
  { label: 'React', icon: '⚛', x: 19, y: 41, plane: 'mid', phase: 5.0 },
  { label: 'JavaScript', icon: 'JS', x: 13, y: 63, plane: 'bg', phase: 1.7 },
  { label: 'Linux', icon: '△', x: 25, y: 79, plane: 'bg', phase: 3.6 },
]

// On mobile, keep only the most important nodes.
const MOBILE_KEEP = new Set(['Python', 'scikit-learn', 'Pandas', 'React', 'Streamlit', 'Git'])

const PLANE: Record<Plane, { scale: number; opacity: number; blur: number; parallax: number; border: string }> = {
  bg: { scale: 0.9, opacity: 0.66, blur: 1.1, parallax: 0.55, border: 'rgba(255,255,255,0.07)' },
  mid: { scale: 1.0, opacity: 0.96, blur: 0, parallax: 1.0, border: 'rgba(255,255,255,0.1)' },
  fg: { scale: 1.06, opacity: 1, blur: 0, parallax: 1.55, border: 'rgba(167,139,250,0.3)' },
}

const CX = 50
const CY = 52

// Build a full-ellipse path plus the "front" arc (screen-below the core center)
// so orbits correctly pass behind and in front of the sphere.
function genOrbit(rx: number, ry: number, rotDeg: number) {
  const steps = 72
  const rot = (rotDeg * Math.PI) / 180
  const cs = Math.cos(rot)
  const sn = Math.sin(rot)
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const ex = rx * Math.cos(t)
    const ey = ry * Math.sin(t)
    pts.push({ x: CX + ex * cs - ey * sn, y: CY + ex * sn + ey * cs })
  }
  const full = 'M' + pts.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ') + ' Z'
  const below = pts.map((p) => p.y > CY)
  let start = -1
  for (let i = 0; i < steps; i++) {
    if (below[i] && !below[(i - 1 + steps) % steps]) {
      start = i
      break
    }
  }
  let front = ''
  if (start >= 0) {
    const seg: { x: number; y: number }[] = []
    for (let k = 0; k < steps; k++) {
      const idx = (start + k) % steps
      if (below[idx]) seg.push(pts[idx])
      else break
    }
    front = 'M' + seg.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ')
  }
  return { full, front, rx, ry, rot: rotDeg }
}

function ellipsePoint(rx: number, ry: number, rotDeg: number, t: number) {
  const rot = (rotDeg * Math.PI) / 180
  const ex = rx * Math.cos(t)
  const ey = ry * Math.sin(t)
  return {
    x: CX + ex * Math.cos(rot) - ey * Math.sin(rot),
    y: CY + ex * Math.sin(rot) + ey * Math.cos(rot),
  }
}

// Minimalist geometric DT monogram — architectural, embedded, favicon-legible.
function DTMark({ size }: { size: string }) {
  return (
    <svg
      viewBox="6.75 0 48 48"
      style={{ width: size, height: size, display: 'block', overflow: 'visible' }}
      aria-hidden
    >
      {/* D — near-white, geometric with straight stem + squared bowl */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 9 H23 C31.3 9 36 15.4 36 24 C36 32.6 31.3 39 23 39 H13 Z
           M18 14.4 H23 C27.9 14.4 30.6 18.6 30.6 24 C30.6 29.4 27.9 33.6 23 33.6 H18 Z"
        fill="rgba(248,247,255,0.98)"
      />
      {/* T — light violet, interlocked; stem sits inside D's counter, bar crosses over */}
      <path
        d="M35.5 10.8 H48.5 M42 10.8 V37.2"
        stroke="#c4b5fd"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default function InfraCore() {
  const rootRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const coreOuterRef = useRef<HTMLDivElement>(null)
  const gridLayerRef = useRef<HTMLDivElement>(null)
  const farLayerRef = useRef<HTMLDivElement>(null)
  const chipsLayerRef = useRef<HTMLDivElement>(null)
  const nearLayerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const packetRefs = useRef<(SVGCircleElement | null)[]>([])
  const eventPacketRef = useRef<SVGCircleElement | null>(null)
  const eventLineRef = useRef<SVGLineElement | null>(null)
  const animationActive = useAnimationActivity(rootRef)

  const [reduced, setReduced] = useState(false)
  const [coreHover, setCoreHover] = useState(false)
  const [hoverNode, setHoverNode] = useState<number | null>(null)
  const [activeNode, setActiveNode] = useState<number | null>(null)
  const [charged, setCharged] = useState(false)

  const hoverRef = useRef<number | null>(null)
  const activeRef = useRef<number | null>(null)
  hoverRef.current = hoverNode
  activeRef.current = activeNode

  const orbits = useMemo(
    () => [genOrbit(38, 11, 0), genOrbit(16, 34, -20), genOrbit(34, 15, 42)],
    [],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Single rAF drives camera, node drift, orbit packets, and the energy events.
  useEffect(() => {
    if (reduced || !animationActive) return
    const scene = sceneRef.current
    const root = rootRef.current
    if (!scene || !root) return

    const fine = !window.matchMedia('(pointer: coarse)').matches

    let mx = 0
    let my = 0
    let cRX = 0
    let cRY = 0
    let ox = 0
    let oy = 0

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      my = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const onLeave = () => {
      mx = 0
      my = 0
    }
    const cameraTarget = root.closest('[data-hero]') as HTMLElement | null
    if (fine && cameraTarget) {
      cameraTarget.addEventListener('pointermove', onMove)
      cameraTarget.addEventListener('pointerleave', onLeave)
    }

    // Energy-event state machine
    let nextEvent = performance.now() + 1600
    let ev: { node: number; inbound: boolean; t0: number; dur: number } | null = null

    let raf = 0
    let start = performance.now()
    const tick = (now: number) => {
      const time = (now - start) / 1000

      // Camera (virtual): rotateX ±2, rotateY ±3, smooth lerp
      cRX += (-my * 2 - cRX) * 0.06
      cRY += (mx * 3 - cRY) * 0.06
      ox += (mx - ox) * 0.06
      oy += (my - oy) * 0.06
      scene.style.transform = `rotateX(${cRX.toFixed(3)}deg) rotateY(${cRY.toFixed(3)}deg)`
      if (gridLayerRef.current)
        gridLayerRef.current.style.transform = `translateZ(-130px) translate3d(${ox * 5}px, ${oy * 5}px, 0)`
      if (farLayerRef.current)
        farLayerRef.current.style.transform = `translateZ(-70px) translate3d(${ox * 9}px, ${oy * 9}px, 0)`
      if (chipsLayerRef.current)
        chipsLayerRef.current.style.transform = `translateZ(40px) translate3d(${ox * 16}px, ${oy * 16}px, 0)`
      if (nearLayerRef.current)
        nearLayerRef.current.style.transform = `translateZ(80px) translate3d(${ox * 26}px, ${oy * 26}px, 0)`

      // Node drift — slow, independent
      const hov = hoverRef.current
      const act = activeRef.current
      for (let i = 0; i < NODES.length; i++) {
        const el = nodeRefs.current[i]
        if (!el) continue
        const n = NODES[i]
        const p = PLANE[n.plane]
        const dx = Math.sin(time * 0.22 + n.phase) * (3.2 * p.parallax)
        const dy = Math.cos(time * 0.17 + n.phase * 1.3) * (2.6 * p.parallax)
        const lift = i === hov ? 1 : 0
        const s = p.scale + lift * 0.06
        const z = lift * 22
        el.style.transform = `translate(-50%, -50%) translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, ${z}px) scale(${s.toFixed(3)})`
      }

      // Orbit packets — one small, mostly-dim packet per orbit
      for (let i = 0; i < orbits.length; i++) {
        const c = packetRefs.current[i]
        if (!c) continue
        const o = orbits[i]
        const t = time * (0.16 + i * 0.05) + i * 2.1
        const pt = ellipsePoint(o.rx, o.ry, o.rot, t)
        const front = pt.y > CY
        c.setAttribute('cx', pt.x.toFixed(2))
        c.setAttribute('cy', pt.y.toFixed(2))
        c.setAttribute('r', front ? '0.75' : '0.5')
        c.style.opacity = front ? '0.85' : '0.28'
      }

      // Energy events: tech → DT (mostly) or DT → tech
      if (!ev && now >= nextEvent) {
        const node = Math.floor(Math.random() * NODES.length)
        ev = { node, inbound: Math.random() < 0.7, t0: now, dur: 950 }
        setActiveNode(node)
        if (eventLineRef.current) {
          const n = NODES[node]
          eventLineRef.current.setAttribute('x1', String(n.x))
          eventLineRef.current.setAttribute('y1', String(n.y))
          eventLineRef.current.setAttribute('x2', String(CX))
          eventLineRef.current.setAttribute('y2', String(CY))
        }
      }
      if (ev) {
        const p = Math.min(1, (now - ev.t0) / ev.dur)
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
        const from = ev.inbound ? NODES[ev.node] : { x: CX, y: CY }
        const to = ev.inbound ? { x: CX, y: CY } : NODES[ev.node]
        const px = from.x + (to.x - from.x) * eased
        const py = from.y + (to.y - from.y) * eased
        if (eventPacketRef.current) {
          eventPacketRef.current.setAttribute('cx', px.toFixed(2))
          eventPacketRef.current.setAttribute('cy', py.toFixed(2))
          eventPacketRef.current.style.opacity = String(0.9 * Math.sin(p * Math.PI))
        }
        if (eventLineRef.current) {
          eventLineRef.current.style.opacity = String(0.5 * Math.sin(p * Math.PI))
        }
        if (p >= 1) {
          if (ev.inbound) {
            setCharged(true)
            window.setTimeout(() => setCharged(false), 650)
          }
          window.setTimeout(() => setActiveNode(null), 500)
          ev = null
          nextEvent = now + 1800 + Math.random() * 1400
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      if (cameraTarget) {
        cameraTarget.removeEventListener('pointermove', onMove)
        cameraTarget.removeEventListener('pointerleave', onLeave)
      }
    }
  }, [animationActive, reduced, orbits])

  const dimOthers = hoverNode != null
  const coreLit = coreHover || charged || activeNode != null

  return (
    <div
      ref={rootRef}
      className="relative select-none"
      style={{ width: '100%', aspectRatio: '1', maxWidth: 480, perspective: 1200, perspectiveOrigin: '50% 45%' }}
      role="img"
      aria-label="Dipen Thapa's technology system: a luminous DT core connected to Python, Pandas, scikit-learn, Streamlit, React, Git, JavaScript, and Linux."
    >
      <div ref={sceneRef} style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
        {/* ── Environment: depth grid + ambient volumetric light ── */}
        <div
          ref={gridLayerRef}
          className="absolute inset-0"
          style={{ transform: 'translateZ(-130px)', animation: reduced ? 'none' : 'fade-in 0.6s ease both' }}
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-grid"
            style={{
              opacity: 0.6,
              maskImage: 'radial-gradient(circle at 50% 52%, transparent 11%, #000 32%, #000 60%, transparent 92%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 52%, transparent 11%, #000 32%, #000 60%, transparent 92%)',
            }}
          />
          {/* offset ambient volumetric glow */}
          <div
            className="absolute rounded-full"
            style={{
              left: '42%',
              top: '44%',
              width: '70%',
              height: '70%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, rgba(79,70,229,0.06) 40%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
        </div>

        {/* ── Far particles + micro data fragments ── */}
        <div
          ref={farLayerRef}
          className="absolute inset-0 pointer-events-none"
          style={{ transform: 'translateZ(-70px)', animation: reduced ? 'none' : 'fade-in 1s ease 1.3s both' }}
          aria-hidden
        >
          {[
            [16, 20, 1.6, 0.28], [86, 30, 1.4, 0.24], [8, 84, 1.8, 0.3], [90, 70, 1.5, 0.22],
            [30, 12, 1.4, 0.26], [70, 92, 1.6, 0.28], [94, 50, 1.3, 0.2], [6, 44, 1.5, 0.24],
          ].map(([x, y, s, o], i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: s,
                height: s,
                background: i % 2 ? 'rgba(129,140,248,1)' : 'rgba(167,139,250,1)',
                opacity: o as number,
                animation: reduced ? 'none' : `float ${5 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
          {[
            { c: '01', x: 12, y: 34 },
            { c: '{ }', x: 88, y: 18 },
            { c: 'ML', x: 82, y: 88 },
          ].map((f, i) => (
            <span
              key={f.c}
              className="font-mono absolute"
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                fontSize: 9,
                color: 'rgba(167,139,250,0.14)',
                filter: 'blur(0.4px)',
                animation: reduced ? 'none' : `float-slow ${9 + i * 2}s ease-in-out ${i * 1.5}s infinite`,
              }}
            >
              {f.c}
            </span>
          ))}
        </div>

        {/* ── Orbits (behind core) ── */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible', animation: reduced ? 'none' : 'fade-in 0.8s ease 0.7s both' }}
          aria-hidden
        >
          {orbits.map((o, i) => (
            <path
              key={`back-${i}`}
              d={o.full}
              fill="none"
              stroke={coreLit ? 'rgba(124,58,237,0.16)' : 'rgba(124,58,237,0.1)'}
              strokeWidth="0.35"
              style={{ transition: 'stroke 0.5s', filter: 'blur(0.25px)' }}
            />
          ))}
        </svg>

        {/* ── The DT core ── */}
        <div
          ref={coreOuterRef}
          className="absolute"
          style={{
            left: '50%',
            top: '52%',
            width: '34%',
            aspectRatio: '1',
            transform: `translate(-50%, -50%) translateZ(${coreHover ? 18 : 0}px)`,
            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setCoreHover(true)}
          onMouseLeave={() => setCoreHover(false)}
        >
          {/* Layered depth shadow (dark violet + black) */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: '50%',
              top: '62%',
              width: '96%',
              height: '96%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 34px 60px -18px rgba(0,0,0,0.85), 0 26px 60px -12px rgba(52,22,120,0.5)',
              borderRadius: '50%',
            }}
          />

          {/* WebGL depth layer — the existing glass visual remains above it. */}
          <WebGLOrb active={animationActive} reduced={reduced} />

          {/* Inner luminous core (breathing) */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              width: '52%',
              height: '52%',
              background:
                'radial-gradient(circle at 44% 40%, #f3efff 0%, #b39dff 26%, #6d28d9 62%, rgba(76,29,149,0) 100%)',
              boxShadow: coreLit
                ? '0 0 26px 6px rgba(139,92,246,0.55)'
                : '0 0 18px 3px rgba(124,58,237,0.35)',
              transition: 'box-shadow 0.5s',
              animation: reduced ? 'none' : 'dt-breathe 6.5s ease-in-out infinite',
            }}
          />

          {/* Outer shell — dark optical glass */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 33% 28%, rgba(228,220,255,0.5) 0%, rgba(150,116,246,0.16) 20%, transparent 42%),' +
                'radial-gradient(circle at 70% 76%, rgba(79,70,229,0.32) 0%, transparent 46%),' +
                'radial-gradient(circle at 50% 50%, rgba(38,22,74,0.55) 52%, rgba(10,7,22,0.9) 100%)',
              border: `1px solid ${coreLit ? 'rgba(196,181,253,0.55)' : 'rgba(167,139,250,0.32)'}`,
              boxShadow:
                'inset 7px 9px 22px rgba(255,255,255,0.07), inset -10px -14px 30px rgba(8,5,20,0.72)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              transition: 'border-color 0.5s',
              animation: reduced ? 'none' : 'dt-fade-scale 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both',
            }}
          >
            {/* slow environmental reflection sweep */}
            {!reduced && (
              <div
                className="absolute"
                style={{
                  top: '-30%',
                  left: 0,
                  width: '55%',
                  height: '160%',
                  background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.10), transparent)',
                  animation: 'dt-reflect 12s ease-in-out infinite',
                }}
              />
            )}
          </div>

          {/* Rim thin illumination (front) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: 'inset 0 0 8px rgba(196,181,253,0.25)' }}
          />

          {/* DT monogram — embedded between shell and inner core */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: '50%',
              top: '50%',
              width: '46%',
              height: '46%',
              transform: 'translate(-50%, -50%)',
              filter: coreLit
                ? 'drop-shadow(0 0 2px rgba(196,181,253,0.9))'
                : 'drop-shadow(0 0 1px rgba(167,139,250,0.6))',
              transition: 'filter 0.5s',
              animation: reduced ? 'none' : 'dt-mark-reveal 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s both',
            }}
          >
            <DTMark size="100%" />
            {/* edge light sweep across the monogram at reveal */}
            {!reduced && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                  animation: 'dt-mark-sweep 1s ease-in-out 1.1s both',
                }}
              />
            )}
          </div>
        </div>

        {/* ── Orbits (front arcs) + packets + event overlay ── */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible', animation: reduced ? 'none' : 'fade-in 0.8s ease 0.7s both' }}
          aria-hidden
        >
          {orbits.map((o, i) => (
            <path
              key={`front-${i}`}
              d={o.front}
              fill="none"
              stroke={coreLit ? 'rgba(196,181,253,0.5)' : 'rgba(167,139,250,0.34)'}
              strokeWidth="0.4"
              strokeLinecap="round"
              style={{ transition: 'stroke 0.5s' }}
            />
          ))}

          {/* Hover / active connection lines */}
          {NODES.map((n, i) => {
            const on = hoverNode === i || activeNode === i
            return (
              <line
                key={`link-${n.label}`}
                x1={n.x}
                y1={n.y}
                x2={CX}
                y2={CY}
                stroke="rgba(167,139,250,0.5)"
                strokeWidth="0.3"
                strokeDasharray="1.4 2.2"
                style={{ opacity: on ? 1 : 0, transition: 'opacity 0.4s' }}
              />
            )
          })}

          {/* Orbit energy packets */}
          {orbits.map((_, i) => (
            <circle
              key={`pkt-${i}`}
              ref={(el) => {
                packetRefs.current[i] = el
              }}
              r="0.6"
              fill="#e9e2ff"
              style={{ filter: 'drop-shadow(0 0 1.4px rgba(196,181,253,0.9))', opacity: 0 }}
            />
          ))}

          {/* Energy-event line + packet (tech ↔ DT) */}
          <line
            ref={eventLineRef}
            stroke="rgba(196,181,253,0.6)"
            strokeWidth="0.35"
            style={{ opacity: 0 }}
          />
          <circle
            ref={eventPacketRef}
            r="0.9"
            fill="#f4f0ff"
            style={{ filter: 'drop-shadow(0 0 2px rgba(196,181,253,1))', opacity: 0 }}
          />
        </svg>

        {/* ── Technology constellation ── */}
        <div ref={chipsLayerRef} className="absolute inset-0" style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
          {NODES.map((node, i) => {
            const p = PLANE[node.plane]
            const hidden = !MOBILE_KEEP.has(node.label)
            const on = hoverNode === i || activeNode === i
            return (
              <div
                key={node.label}
                ref={(el) => {
                  nodeRefs.current[i] = el
                }}
                className={`absolute ${hidden ? 'hidden sm:block' : ''}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: reduced ? 'none' : `fade-in 0.5s ease ${0.9 + i * 0.06}s both`,
                }}
              >
                <div
                  className="flex items-center gap-1.5 rounded-lg"
                  style={{
                    padding: '5px 9px',
                    background: on ? 'rgba(26,20,44,0.9)' : 'rgba(10,10,16,0.72)',
                    border: `1px solid ${on ? 'rgba(196,181,253,0.55)' : p.border}`,
                    boxShadow: on
                      ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 22px rgba(50,25,110,0.4)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 6px 16px rgba(0,0,0,0.5)',
                    opacity: (dimOthers && !on ? 0.9 : 1) * p.opacity,
                    filter: p.blur ? `blur(${p.blur}px)` : 'none',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    whiteSpace: 'nowrap',
                    cursor: 'default',
                    transition: 'background 0.35s, border-color 0.35s, box-shadow 0.35s, opacity 0.35s',
                  }}
                  onMouseEnter={() => setHoverNode(i)}
                  onMouseLeave={() => setHoverNode(null)}
                >
                  <span
                    className="font-mono flex-shrink-0"
                    style={{ fontSize: 8.5, color: on ? '#e9e2ff' : 'rgba(167,139,250,0.75)', transition: 'color 0.35s' }}
                  >
                    {node.icon}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      color: on ? 'var(--text-1)' : 'rgba(200,195,220,0.85)',
                      transition: 'color 0.35s',
                    }}
                  >
                    {node.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Near particles (largest parallax) ── */}
        <div
          ref={nearLayerRef}
          className="absolute inset-0 pointer-events-none"
          style={{ transform: 'translateZ(80px)', animation: reduced ? 'none' : 'fade-in 1s ease 1.4s both' }}
          aria-hidden
        >
          {[
            [28, 66, 2.4], [74, 40, 2.2], [58, 22, 2.6],
          ].map(([x, y, s], i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: s,
                height: s,
                background: 'rgba(196,181,253,0.5)',
                filter: 'blur(0.7px)',
                animation: reduced ? 'none' : `float ${3.5 + i}s ease-in-out ${i * 0.6}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
