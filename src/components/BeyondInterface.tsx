import { useEffect, useRef, useState } from 'react'
import useAnimationActivity from '../hooks/useAnimationActivity'

interface FlowNode {
  id: string
  label: string
  sublabel: string
  icon: string
}

interface SideNode {
  label: string
  icon: string
  side: 'left' | 'right'
  connectTo: number // index of main node
}

interface StageDetail {
  num: string
  title: string
  desc: string
  tags: string[]
  metric: { value: string; label: string }
}

const FLOW_NODES: FlowNode[] = [
  { id: 'data', label: 'Raw Data', sublabel: 'World Bank API · CSV', icon: '◎' },
  { id: 'pipeline', label: 'Data Pipeline', sublabel: 'Pandas · NumPy · Wrangling', icon: '⇄' },
  { id: 'analysis', label: 'Analysis & ML', sublabel: 'scikit-learn · EDA', icon: '⟨/⟩' },
  { id: 'viz', label: 'Visualization', sublabel: 'Plotly · Matplotlib · Seaborn', icon: '☁' },
  { id: 'deploy', label: 'Deployment', sublabel: 'Streamlit · Git · Web', icon: '⬡' },
]

const STAGE_DETAIL: StageDetail[] = [
  {
    num: '01',
    title: 'Raw Data',
    desc: 'Every project starts at the source. I pull decades of environmental indicators straight from the World Bank API and raw CSV exports — unglamorous, messy, and exactly where the real work begins.',
    tags: ['World Bank API', 'CSV', 'Requests'],
    metric: { value: '33 yrs', label: 'of PM2.5 records ingested' },
  },
  {
    num: '02',
    title: 'Data Pipeline',
    desc: 'Raw numbers become trustworthy data. Pandas and NumPy handle cleaning, reshaping and validation inside a reproducible pipeline — so the same input always yields the same result.',
    tags: ['Pandas', 'NumPy', 'Wrangling'],
    metric: { value: '100%', label: 'reproducible transforms' },
  },
  {
    num: '03',
    title: 'Analysis & ML',
    desc: 'This is where the story surfaces. Exploratory analysis and scikit-learn modelling reveal the trend behind the noise: Nepal’s mean PM2.5 exposure climbed steadily across the study window.',
    tags: ['scikit-learn', 'EDA', 'Statistics'],
    metric: { value: '+25%', label: 'exposure rise uncovered' },
  },
  {
    num: '04',
    title: 'Visualization',
    desc: 'Insight nobody can see is insight wasted. Plotly, Matplotlib and Seaborn turn the findings into interactive, legible charts that make three decades of change readable at a glance.',
    tags: ['Plotly', 'Matplotlib', 'Seaborn'],
    metric: { value: '8+', label: 'interactive figures' },
  },
  {
    num: '05',
    title: 'Deployment',
    desc: 'A notebook helps no one on its own. I ship the whole analysis as a live Streamlit app, version-controlled with Git and deployed to the web — the full journey, end to end.',
    tags: ['Streamlit', 'Git', 'Web'],
    metric: { value: 'Live', label: 'deployed & public' },
  },
]

const SIDE_NODES: SideNode[] = [
  { label: 'World Bank API', icon: 'API', side: 'left', connectTo: 0 },
  { label: 'CSV', icon: 'CSV', side: 'right', connectTo: 0 },
  { label: 'Pandas', icon: 'Pd', side: 'left', connectTo: 1 },
  { label: 'NumPy', icon: 'Np', side: 'right', connectTo: 1 },
  { label: 'scikit-learn', icon: 'SK', side: 'left', connectTo: 2 },
  { label: 'EDA', icon: '△', side: 'right', connectTo: 2 },
  { label: 'Plotly', icon: '◔', side: 'left', connectTo: 3 },
  { label: 'Matplotlib', icon: '▤', side: 'right', connectTo: 3 },
  { label: 'Streamlit', icon: '▶', side: 'left', connectTo: 4 },
  { label: 'Git', icon: '⑃', side: 'right', connectTo: 4 },
]

// ── Scene geometry (SVG/DOM coordinate space) ──
const NODE_W = 220
const NODE_H = 64
const GAP = 32
const TOP = 26
const SCENE_W = 480
const STEP = NODE_H + GAP
const N = FLOW_NODES.length
const SCENE_H = TOP + N * STEP - GAP + TOP
const nodeTop = (i: number) => TOP + i * STEP
const nodeCenterY = (i: number) => nodeTop(i) + NODE_H / 2
const SPINE_TOP = nodeCenterY(0)
const SPINE_BOTTOM = nodeCenterY(N - 1)

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export default function BeyondInterface() {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const [activeStage, setActiveStage] = useState(0)
  const [entered, setEntered] = useState(false)

  // ── Scroll drives the entire sequence ──
  useEffect(() => {
    if (reduced) {
      setEntered(true)
      return
    }
    const section = sectionRef.current
    if (!section) return

    let raf = 0
    const update = () => {
      raf = 0
      const total = section.offsetHeight - window.innerHeight
      const p = total > 0 ? clamp(-section.getBoundingClientRect().top / total, 0, 1) : 0
      progressRef.current = p
      setEntered(true)
      const stage = clamp(Math.round(p * (N - 1)), 0, N - 1)
      setActiveStage((prev) => (prev === stage ? prev : stage))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  const detail = STAGE_DETAIL[activeStage]

  // Reduced-motion / static fallback: no pinning, everything shown at once.
  if (reduced) {
    return (
      <section id="infrastructure" className="relative py-28 lg:py-36 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="section-label mb-8">05 / Beyond the Interface</div>
          <h2
            className="font-display font-bold leading-[1.02] tracking-tight mb-12"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', color: 'var(--text-1)' }}
          >
            Not just the numbers — <span className="gradient-text-subtle">the full stack.</span>
          </h2>
          <div className="flex flex-col gap-6">
            {STAGE_DETAIL.map((s) => (
              <div
                key={s.num}
                className="p-6 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-display font-bold" style={{ fontSize: 22, color: 'var(--accent)' }}>
                    {s.num}
                  </span>
                  <h3 className="font-display font-semibold" style={{ fontSize: 20, color: 'var(--text-1)' }}>
                    {s.title}
                  </h3>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="infrastructure"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100vh + ${(N - 1) * 22}vh)` }}
      aria-label="The full-stack data pipeline"
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(124,58,237,0.08) 0%, transparent 62%)',
          }}
        />

        <div className="relative w-full max-w-[1280px] mx-auto px-6">
          {/* Section eyebrow — pinned above the sequence */}
          <div className="section-label mb-4 lg:mb-10">05 / From Signal to System · Scroll to trace the flow</div>

          <ol className="sr-only">
            {STAGE_DETAIL.map((stage) => (
              <li key={stage.num}>
                Stage {stage.num}: {stage.title}. {stage.desc} Result: {stage.metric.value},{' '}
                {stage.metric.label}.
              </li>
            ))}
          </ol>

          <div className="hidden lg:grid lg:grid-cols-[1fr_500px] gap-16 items-center">
            {/* Left: dynamic stage detail */}
            <div className="relative">
              {/* Progress rail */}
              <div className="flex items-center gap-3 mb-8">
                {FLOW_NODES.map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="rounded-full transition-all duration-500"
                      style={{
                        width: i === activeStage ? 26 : 8,
                        height: 8,
                        background:
                          i <= activeStage ? 'var(--accent)' : 'rgba(255,255,255,0.14)',
                        boxShadow: i === activeStage ? '0 0 12px rgba(124,58,237,0.7)' : 'none',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Oversized stage numeral as graphic element */}
              <div className="relative" style={{ minHeight: 380 }}>
                <span
                  key={`num-${activeStage}`}
                  className="font-display font-bold select-none pointer-events-none absolute"
                  style={{
                    top: -70,
                    left: -8,
                    fontSize: 'clamp(9rem, 16vw, 15rem)',
                    lineHeight: 0.8,
                    color: 'rgba(124,58,237,0.09)',
                    animation: 'fade-in 0.6s var(--ease-out) both',
                  }}
                  aria-hidden
                >
                  {detail.num}
                </span>

                <div key={`detail-${activeStage}`} className="relative pt-16">
                  <p
                    className="font-mono mb-3"
                    style={{ fontSize: 11, letterSpacing: '0.18em', color: '#a78bfa', animation: 'fade-up 0.5s var(--ease-out) both' }}
                  >
                    STAGE {detail.num} / 05
                  </p>
                  <h2
                    className="font-display font-bold tracking-tight mb-5"
                    style={{
                      fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                      lineHeight: 1.02,
                      color: 'var(--text-1)',
                      animation: 'fade-up 0.5s var(--ease-out) 0.05s both',
                    }}
                  >
                    {detail.title}
                  </h2>
                  <p
                    className="max-w-[480px] mb-6"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 15.5,
                      color: 'var(--text-2-strong)',
                      lineHeight: 1.75,
                      animation: 'fade-up 0.5s var(--ease-out) 0.1s both',
                    }}
                  >
                    {detail.desc}
                  </p>

                  <div
                    className="flex items-center gap-6 flex-wrap"
                    style={{ animation: 'fade-up 0.5s var(--ease-out) 0.15s both' }}
                  >
                    <div>
                      <p className="font-display font-bold gradient-text" style={{ fontSize: 30, lineHeight: 1 }}>
                        {detail.metric.value}
                      </p>
                      <p className="font-mono mt-1" style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.06em' }}>
                        {detail.metric.label}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detail.tags.map((t) => (
                        <span key={t} className="tech-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: the live pipeline diagram */}
            <div className="hidden lg:block">
              <InfraDiagram
                activeStage={activeStage}
                progressRef={progressRef}
                entered={entered}
                reduced={reduced}
              />
            </div>
          </div>

          {/* Touch layout: the complete five-stage reference remains visible. */}
          <div className="lg:hidden">
            <div className="mb-3 flex items-center gap-2" aria-hidden>
              {FLOW_NODES.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-transform duration-300"
                  style={{
                    width: i === activeStage ? 24 : 7,
                    background:
                      i <= activeStage ? 'var(--accent)' : 'rgba(255,255,255,0.14)',
                    boxShadow:
                      i === activeStage ? '0 0 10px rgba(124,58,237,0.7)' : 'none',
                  }}
                />
              ))}
            </div>

            <div
              key={`mobile-detail-${activeStage}`}
              className="mb-3 grid grid-cols-[auto_1fr] items-baseline gap-x-3"
              style={{ animation: 'fade-up 0.42s var(--ease-out) both' }}
            >
              <span className="font-mono text-[10px]" style={{ color: '#a78bfa' }}>
                {detail.num} / 05
              </span>
              <h2
                className="font-display text-2xl font-bold"
                style={{ color: 'var(--text-1)' }}
              >
                {detail.title}
              </h2>
              <p
                className="col-span-2 mt-1 line-clamp-2 text-[13px] leading-relaxed"
                style={{ color: 'var(--text-2-strong)' }}
              >
                {detail.desc}
              </p>
            </div>

            <ScaledInfraDiagram
              activeStage={activeStage}
              progressRef={progressRef}
              entered={entered}
              reduced={reduced}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function InfraDiagram({
  activeStage,
  progressRef,
  entered,
  reduced,
}: {
  activeStage: number
  progressRef: React.MutableRefObject<number>
  entered: boolean
  reduced: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const packetRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeYRef = useRef<number | null>(null)
  const animationActive = useAnimationActivity(rootRef)

  // ── Packet position driven by scroll progress ──
  useEffect(() => {
    if (reduced || !animationActive) return
    let raf = 0
    const tick = () => {
      const p = progressRef.current
      const stageFloat = p * (N - 1)
      if (packetRef.current) {
        const y = TOP + stageFloat * STEP + NODE_H / 2
        packetRef.current.style.transform = `translate(-50%, ${y}px)`
        packetRef.current.style.opacity = '1'
      }
      if (progressLineRef.current) {
        progressLineRef.current.style.transform = `scaleY(${p})`
      }
      const nn = Math.round(stageFloat)
      activeYRef.current = nodeCenterY(nn)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animationActive, progressRef, reduced])

  // ── Layered mouse parallax + cursor lighting (desktop only) ──
  useEffect(() => {
    const root = rootRef.current
    const scene = sceneRef.current
    if (!root || !scene || reduced || !animationActive) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        scene.style.setProperty('--bi-mx', String(mx))
        scene.style.setProperty('--bi-my', String(my))
        scene.style.setProperty('--bi-lx', `${e.clientX - r.left}px`)
        scene.style.setProperty('--bi-ly', `${e.clientY - r.top}px`)
        scene.style.setProperty('--bi-lo', '1')
      })
    }
    const onLeave = () => {
      scene.style.setProperty('--bi-mx', '0')
      scene.style.setProperty('--bi-my', '0')
      scene.style.setProperty('--bi-lo', '0')
    }
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [animationActive, reduced])

  // ── Particle field ──
  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent || reduced || !animationActive) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const COLS = ['167,139,250', '129,140,248', '226,232,240']
    const SYMS = ['01', '{}', '[]', '→', 'λ', 'Py', 'CSV', 'ML']

    type P = { x: number; y: number; vy: number; size: number; a: number; col: string; g: number }
    type Sym = { x: number; y: number; vy: number; a: number; ch: string }
    let ps: P[] = []
    let syms: Sym[] = []

    const build = () => {
      const count = w >= 1024 ? 22 : 12
      ps = Array.from({ length: count }, (_, i) => {
        const g = i % 3
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vy: (g === 2 ? 22 : g === 1 ? 13 : 7) + Math.random() * 6,
          size: g === 2 ? (Math.random() < 0.15 ? 3 : 1.6) : g === 0 ? 1 : 1.4,
          a: (g === 0 ? 0.16 : g === 1 ? 0.3 : 0.4) + Math.random() * 0.08,
          col: COLS[Math.random() < 0.15 ? 2 : Math.random() < 0.5 ? 0 : 1],
          g,
        }
      })
      syms = Array.from({ length: w >= 1024 ? 4 : 2 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: 5 + Math.random() * 4,
        a: 0.05 + Math.random() * 0.05,
        ch: SYMS[(Math.random() * SYMS.length) | 0],
      }))
    }

    const resize = () => {
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    let last = performance.now()
    let raf = 0

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, w, h)
      const ay = activeYRef.current

      for (const p of ps) {
        p.y += p.vy * dt
        if (ay != null) {
          const d = Math.abs(p.y - ay)
          if (d < 90) p.x += (w / 2 - p.x) * (1 - d / 90) * 0.4 * dt
        }
        if (p.y > h + 4) {
          p.y = -4
          p.x = Math.random() * w
        }
        const tw = 0.85 + 0.15 * Math.sin(now * 0.002 + p.x)
        ctx.globalAlpha = p.a * tw
        if (p.g === 2) {
          ctx.shadowBlur = 6
          ctx.shadowColor = `rgba(${p.col},0.6)`
        } else ctx.shadowBlur = 0
        ctx.fillStyle = `rgba(${p.col},1)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      ctx.font = '9px "JetBrains Mono", monospace'
      for (const s of syms) {
        s.y += s.vy * dt
        if (s.y > h + 10) {
          s.y = -10
          s.x = Math.random() * w
          s.ch = SYMS[(Math.random() * SYMS.length) | 0]
        }
        ctx.globalAlpha = s.a
        ctx.fillStyle = 'rgba(167,139,250,1)'
        ctx.fillText(s.ch, s.x, s.y)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    resize()
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [animationActive, reduced])

  const isMainHot = (i: number) => activeStage === i
  const isSideHot = (idx: number) => SIDE_NODES[idx].connectTo === activeStage

  const parallax = (f: number, z: number) =>
    `translate3d(calc(var(--bi-mx,0) * ${f}px), calc(var(--bi-my,0) * ${f}px), ${z}px)`

  return (
    <div
      ref={rootRef}
      className="relative mx-auto"
      style={{ maxWidth: SCENE_W, height: SCENE_H, perspective: 1300, perspectiveOrigin: '50% 42%' }}
    >
      <div
        ref={sceneRef}
        className={reduced ? '' : 'bi-scene'}
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          // @ts-expect-error custom props
          '--bi-mx': 0,
          '--bi-my': 0,
          '--bi-lo': 0,
          animation: reduced ? 'none' : 'bi-scene-idle 14s ease-in-out infinite',
        }}
      >
        {/* Ambient environment */}
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl"
          style={{ transform: parallax(3, -220), transformOrigin: 'center' }}
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-grid"
            style={{ opacity: 0.5, maskImage: 'radial-gradient(ellipse at 50% 45%, #000 30%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, #000 30%, transparent 78%)' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(124,58,237,0.10) 0%, transparent 62%)' }}
          />
        </div>

        {/* Particle field */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: parallax(6, -60) }} aria-hidden>
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>

        {/* Connectors + spine */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: parallax(3, -14) }} aria-hidden>
          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} style={{ overflow: 'visible' }}>
            <g>
              {SIDE_NODES.map((sn, i) => {
                const cy = nodeCenterY(sn.connectTo)
                const x1 = sn.side === 'left' ? 240 - NODE_W / 2 : 240 + NODE_W / 2
                const x2 = sn.side === 'left' ? 116 : SCENE_W - 116
                const hot = isSideHot(i)
                return (
                  <path
                    key={i}
                    d={`M ${x1} ${cy} L ${x2} ${cy}`}
                    fill="none"
                    stroke={hot ? 'rgba(167,139,250,0.6)' : 'rgba(129,140,248,0.14)'}
                    strokeWidth={hot ? 1.1 : 0.75}
                    strokeDasharray="3 4"
                    style={{
                      transition: 'stroke 0.4s, stroke-width 0.4s',
                      animation: hot && !reduced ? 'data-flow 1.2s linear infinite' : 'none',
                    }}
                  />
                )
              })}
            </g>
          </svg>

          {/* Central data spine + filled progress */}
          <div
            ref={progressLineRef}
            style={{
              position: 'absolute',
              left: '50%',
              marginLeft: -0.5,
              top: SPINE_TOP,
              width: 1,
              height: SPINE_BOTTOM - SPINE_TOP,
              background: 'rgba(124,58,237,0.14)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              marginLeft: -1,
              top: SPINE_TOP,
              width: 2,
              height: SPINE_BOTTOM - SPINE_TOP,
              background: 'linear-gradient(to bottom, rgba(196,181,253,0.9), rgba(124,58,237,0.5))',
              boxShadow: '0 0 10px rgba(124,58,237,0.6)',
              transform: reduced ? `scaleY(${activeStage / (N - 1)})` : 'scaleY(0)',
              transformOrigin: 'top',
              willChange: 'transform',
            }}
          />
        </div>

        {/* Side technology modules */}
        <div className="absolute inset-0" style={{ transform: parallax(8, 18), transformStyle: 'preserve-3d' }}>
          {SIDE_NODES.map((sn, i) => {
            const isLeft = sn.side === 'left'
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  top: nodeCenterY(sn.connectTo) - 17,
                  left: isLeft ? 8 : 'auto',
                  right: isLeft ? 'auto' : 8,
                   width: 108,
                  // @ts-expect-error custom prop
                  '--bi-from': isLeft ? '-16px' : '16px',
                  animation: entered && !reduced ? `bi-side-in 0.5s ease ${0.3 + i * 0.05}s both` : 'none',
                }}
              >
                <SideNodeEl node={sn} hot={isSideHot(i)} />
              </div>
            )
          })}
        </div>

        {/* Main pipeline modules */}
        <div className="absolute inset-0" style={{ transform: parallax(4, 42), transformStyle: 'preserve-3d' }}>
          {FLOW_NODES.map((node, i) => (
            <div
              key={node.id}
              className="absolute left-1/2"
              style={{ top: nodeTop(i), width: NODE_W, marginLeft: -NODE_W / 2, transformStyle: 'preserve-3d' }}
            >
              <div
                style={{
                  transformStyle: 'preserve-3d',
                  animation: entered ? `bi-node-in 0.6s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.1}s both` : 'none',
                }}
              >
                <MainFlowNode
                  node={node}
                  index={i}
                  isFirst={i === 0}
                  isLast={i === N - 1}
                  hot={isMainHot(i)}
                  reduced={reduced}
                />
              </div>
            </div>
          ))}

          {/* Traveling data packet */}
          <div
            ref={packetRef}
            className="absolute pointer-events-none"
            style={{ left: '50%', top: 0, opacity: 0, willChange: 'transform', transform: 'translate(-50%, 0)' }}
            aria-hidden
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: -20,
                width: 2,
                height: 20,
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to top, rgba(196,181,253,0.7), transparent)',
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 8,
                height: 8,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #f4f0ff 0%, #a78bfa 55%, rgba(124,58,237,0) 100%)',
                boxShadow: '0 0 12px 3px rgba(167,139,250,0.8)',
              }}
            />
          </div>
        </div>

        {/* Cursor-reactive soft light */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 'var(--bi-lx, 50%)',
            top: 'var(--bi-ly, 45%)',
            width: 260,
            height: 260,
            transform: 'translate(-50%, -50%) translateZ(60px)',
            opacity: 'var(--bi-lo, 0)' as unknown as number,
            transition: 'opacity 0.4s',
            background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)',
          }}
          aria-hidden
        />
      </div>
    </div>
  )
}

function ScaledInfraDiagram({
  activeStage,
  progressRef,
  entered,
  reduced,
}: {
  activeStage: number
  progressRef: React.MutableRefObject<number>
  entered: boolean
  reduced: boolean
}) {
  const holderRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.7)

  useEffect(() => {
    const holder = holderRef.current
    if (!holder) return
    const update = () => setScale(Math.min(0.72, holder.clientWidth / SCENE_W))
    const observer = new ResizeObserver(update)
    observer.observe(holder)
    update()
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={holderRef}
      className="relative w-full"
      style={{ height: SCENE_H * scale }}
    >
      <div
        style={{
          width: SCENE_W,
          height: SCENE_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <InfraDiagram
          activeStage={activeStage}
          progressRef={progressRef}
          entered={entered}
          reduced={reduced}
        />
      </div>
    </div>
  )
}

function MainFlowNode({
  node,
  index,
  isFirst,
  isLast,
  hot,
  reduced,
}: {
  node: FlowNode
  index: number
  isFirst: boolean
  isLast: boolean
  hot: boolean
  reduced: boolean
}) {
  const glowScale = 0.7 + (index / (N - 1)) * 0.5

  return (
    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: '135%',
          height: '260%',
          transform: `translate(-50%, -50%) scale(${hot ? glowScale : 0.6})`,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.35) 0%, rgba(79,70,229,0.12) 45%, transparent 72%)',
          opacity: hot ? 1 : 0,
          filter: 'blur(6px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      />

      <div
        className="relative flex items-center gap-3 px-4 rounded-2xl w-full overflow-hidden"
        style={{
          height: NODE_H,
          transformStyle: 'preserve-3d',
          background: hot
            ? 'linear-gradient(160deg, rgba(34,28,54,0.92), rgba(12,11,20,0.9))'
            : 'linear-gradient(160deg, rgba(20,18,30,0.86), rgba(9,9,14,0.82))',
          border: `1px solid ${hot ? 'rgba(167,139,250,0.5)' : isFirst || isLast ? 'rgba(124,58,237,0.28)' : 'rgba(255,255,255,0.09)'}`,
          boxShadow: hot
            ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 14px 34px rgba(60,30,120,0.4), 0 0 0 1px rgba(124,58,237,0.15)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px rgba(0,0,0,0.5)',
          transform: hot ? 'translateZ(16px) scale(1.03)' : 'translateZ(0) scale(1)',
          transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s, transform 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {hot && !reduced && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: '-40%',
              width: '50%',
              height: '100%',
              background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.08), transparent)',
              animation: 'bi-shimmer 1.6s ease-in-out',
            }}
          />
        )}

        <span
          className="font-mono flex-shrink-0"
          style={{ fontSize: 15, color: hot ? '#e9e2ff' : '#a78bfa', transition: 'color 0.4s' }}
        >
          {node.icon}
        </span>
        <div className="min-w-0">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12.5, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3 }}>
            {node.label}
          </p>
          <p
            className="font-mono whitespace-nowrap"
            title={node.sublabel}
            style={{
              fontSize: node.id === 'viz' ? 8.1 : 8.7,
              color: hot ? 'rgba(196,181,253,0.9)' : 'var(--text-3)',
              letterSpacing: '0.035em',
              marginTop: 2,
              transition: 'color 0.4s',
            }}
          >
            {node.sublabel}
          </p>
        </div>
      </div>
    </div>
  )
}

function SideNodeEl({ node, hot }: { node: SideNode; hot: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-2 rounded-xl w-full"
      style={{
        background: hot ? 'rgba(99,102,241,0.12)' : 'rgba(14,13,20,0.7)',
        border: `1px solid ${hot ? 'rgba(167,139,250,0.45)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hot ? '0 6px 16px rgba(40,20,90,0.35)' : 'inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'background 0.35s, border-color 0.35s, box-shadow 0.35s, transform 0.35s',
        transform: hot ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      <span className="font-mono flex-shrink-0" style={{ fontSize: 10, color: hot ? '#c4b5fd' : 'rgba(167,139,250,0.7)', transition: 'color 0.35s' }}>
        {node.icon}
      </span>
      <p
        className="whitespace-nowrap"
        title={node.label}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 9.4,
          fontWeight: 500,
          color: hot ? 'var(--text-1)' : 'var(--text-2)',
          transition: 'color 0.35s',
        }}
      >
        {node.label}
      </p>
    </div>
  )
}
