import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'
import WordReveal from './WordReveal'

interface Project {
  number: string
  title: string
  tagline: string
  description: string
  process: string
  tech: string[]
  githubUrl: string
  liveUrl?: string
  accentColor: string
  preview: 'air-quality' | 'portfolio'
}

const PROJECTS: Project[] = [
  {
    number: '01',
    title: 'Nepal Air Quality Analysis',
    tagline: 'Tracking 33 years of PM2.5 pollution exposure across Nepal using open data and Python.',
    description:
      "An end-to-end data science project examining Nepal's estimated mean annual PM2.5 air pollution exposure from 1990 to 2023. Built a reproducible Python pipeline with Pandas and Plotly, sourcing data from the World Bank Indicators API. Key finding: PM2.5 exposure rose ~25% (10.64 µg/m³) over the study period, with volatility increasing after the mid-2000s. Deployed as an interactive Streamlit web app.",
    process:
      'Key decision: keep the World Bank API as the source of truth and make every cleaning step reproducible, rather than freezing a one-off dataset inside the dashboard.',
    tech: ['Python', 'Pandas', 'Plotly', 'Streamlit', 'Matplotlib', 'Seaborn', 'Jupyter'],
    githubUrl: 'https://github.com/dipenthapa7/Nepal-Air-Quality-Analysis',
    liveUrl: 'https://nepal-air-quality-dipenthapa7.streamlit.app',
    accentColor: 'rgba(124,58,237,',
    preview: 'air-quality',
  },
  {
    number: '02',
    title: 'Personal Portfolio Website',
    tagline: 'A personal portfolio built with React and Tailwind CSS, with SEO configuration and automated testing.',
    description:
      'Designed and developed this personal portfolio website from scratch. Built with a React frontend and Tailwind CSS, organized with a clear frontend/backend separation for maintainability. Includes automated testing, SEO configuration with sitemap and robots.txt, and is deployed at dipenthapa7.com.np.',
    process:
      'Key challenge: preserve a cinematic technical atmosphere while keeping navigation, responsive behavior, accessibility, and content clarity dependable.',
    tech: ['React', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS'],
    githubUrl: 'https://github.com/dipenthapa7/DIPEN-WEB',
    liveUrl: 'https://www.dipenthapa7.com.np/',
    accentColor: 'rgba(99,102,241,',
    preview: 'portfolio',
  },
]

export default function Projects() {
  const { ref, inView } = useInView()
  const [expanded, setExpanded] = useState<Project | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!expanded) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(null)
      if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      window.requestAnimationFrame(() => previousFocusRef.current?.focus())
    }
  }, [expanded])

  return (
    <section id="projects" className="relative py-28 lg:py-36" ref={ref}>
      {/* Oversized background word */}
      <div
        className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden pb-0"
        aria-hidden
      >
        <span
          className="font-display font-bold select-none leading-none"
          style={{
            fontSize: 'clamp(6rem, 18vw, 15rem)',
            color: 'rgba(255,255,255,0.015)',
            letterSpacing: '-0.04em',
          }}
        >
          WORK
        </span>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        {/* Label + heading */}
        <div className="mb-20">
          <div className={`reveal ${inView ? 'visible' : ''}`}>
            <div className="section-label mb-8">04 / Selected Work</div>
          </div>
          <WordReveal
            inView={inView}
            className="font-display font-bold leading-[1.02] tracking-tight"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              color: 'var(--text-1)',
            }}
            words={[
              { text: 'Projects' },
              { text: 'that' },
              { text: 'define', className: 'gradient-text-subtle' },
              { text: 'my' },
              { text: 'work.' },
            ]}
          />
        </div>

        {/* Projects — two verified projects */}
        <div className="flex flex-col gap-24">
          {PROJECTS.map((project, i) => (
            <ProjectShowcase
              key={project.number}
              project={project}
              index={i}
              flip={i % 2 === 1}
              inView={inView}
              onExpand={() => {
                previousFocusRef.current = document.activeElement as HTMLElement
                setExpanded(project)
              }}
            />
          ))}
        </div>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-[20000] flex items-center justify-center p-4 sm:p-8"
          style={{ background: 'rgba(6,6,9,0.94)', backdropFilter: 'blur(18px)' }}
          role="dialog"
          aria-modal="true"
          aria-label={`${expanded.title} preview`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setExpanded(null)
          }}
        >
          <div className="relative w-full max-w-[1100px]">
            <button
              ref={closeRef}
              type="button"
              className="absolute -top-12 right-0 rounded-lg px-3 py-2 text-xs font-medium"
              style={{
                color: 'var(--text-1)',
                border: '1px solid var(--border-2)',
                background: 'rgba(255,255,255,0.04)',
              }}
              onClick={() => setExpanded(null)}
              aria-label="Close project preview"
            >
              Close ×
            </button>
            <BrowserFrame
              accentColor={expanded.accentColor}
              preview={expanded.preview}
            />
          </div>
        </div>
      )}
    </section>
  )
}

// ── Styled SVG previews for each real project ───────────────────

function AirQualityPreview() {
  // Abstract PM2.5 trend line chart rising from 1990 to 2023
  const years = [1990, 1995, 2000, 2005, 2010, 2015, 2018, 2023]
  const values = [43, 40, 44, 47, 50, 53, 59, 53]
  const minV = 36
  const maxV = 64
  const W = 100
  const H = 60
  const padX = 8
  const padY = 6

  const toX = (i: number) => padX + (i / (years.length - 1)) * (W - padX * 2)
  const toY = (v: number) => H - padY - ((v - minV) / (maxV - minV)) * (H - padY * 2)

  const points = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPoints = `${toX(0)},${H - padY} ${points} ${toX(values.length - 1)},${H - padY}`

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(255,255,255,0.02)' }}
      >
        <span className="font-mono" style={{ fontSize: 9, color: 'rgba(167,139,250,0.7)', letterSpacing: '0.08em' }}>
          nepal-air-quality-dipenthapa7.streamlit.app
        </span>
        <span className="font-mono" style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
          Streamlit ·  Python
        </span>
      </div>

      {/* Chart area */}
      <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr_auto] p-4">
        {/* Chart label */}
        <p className="font-mono mb-2" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
          NEPAL PM2.5 EXPOSURE (µg/m³) · 1990 – 2023
        </p>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          className="min-h-0"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(124,58,237,0.35)" />
              <stop offset="100%" stopColor="rgba(124,58,237,0)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={padX}
              y1={padY + t * (H - padY * 2)}
              x2={W - padX}
              y2={padY + t * (H - padY * 2)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#chartArea)" />

          {/* Trend line */}
          <polyline
            points={points}
            fill="none"
            stroke="rgba(167,139,250,0.8)"
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {values.map((v, i) => (
            <circle
              key={i}
              cx={toX(i)}
              cy={toY(v)}
              r="1.2"
              fill="#a78bfa"
            />
          ))}

          {/* Peak annotation */}
          <circle cx={toX(6)} cy={toY(59)} r="2" fill="none" stroke="rgba(167,139,250,0.6)" strokeWidth="0.6" />
          <text x={toX(6) + 2} y={toY(59) - 2} fontSize="4" fill="rgba(167,139,250,0.7)" fontFamily="monospace">
            59.53 µg/m³
          </text>
        </svg>

        {/* Stats row */}
        <div className="flex gap-4 mt-2">
          {[
            { label: 'PEAK', value: '59.53 µg/m³', year: '2018' },
            { label: 'RISE', value: '+25%', year: '1990–2023' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-mono" style={{ fontSize: 7, color: 'var(--text-3)', letterSpacing: '0.08em' }}>
                {s.label}
              </p>
              <p className="font-display font-semibold" style={{ fontSize: 11, color: '#a78bfa' }}>
                {s.value}
              </p>
              <p className="font-mono" style={{ fontSize: 7, color: 'var(--text-3)' }}>
                {s.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PortfolioPreview() {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(99,102,241,0.12)', background: 'rgba(255,255,255,0.02)' }}
      >
        <span className="font-mono" style={{ fontSize: 9, color: 'rgba(129,140,248,0.7)', letterSpacing: '0.08em' }}>
          dipenthapa7.com.np
        </span>
        <span className="font-mono" style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
          React · Tailwind
        </span>
      </div>

      {/* Mockup layout */}
      <div className="flex-1 p-4 flex flex-col gap-2" style={{ background: 'rgba(6,6,9,0.6)' }}>
        {/* Nav bar mockup */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-1.5 w-6 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <div className="flex gap-2">
            {[16, 14, 14, 16, 12].map((w, i) => (
              <div key={i} className="h-1 rounded-full" style={{ width: w, background: 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
          <div className="h-4 w-12 rounded-md" style={{ background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.3)' }} />
        </div>

        {/* Hero text mockup */}
        <div className="flex-1 flex flex-col justify-center gap-1.5 py-2">
          <div className="h-1.5 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-5 w-48 rounded-md" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="h-5 w-40 rounded-md" style={{ background: 'rgba(99,102,241,0.35)', marginTop: -2 }} />
          <div className="h-1.5 w-56 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-1.5 w-44 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="flex gap-2 mt-2">
            <div className="h-5 w-20 rounded-lg" style={{ background: 'rgba(99,102,241,0.5)' }} />
            <div className="h-5 w-20 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </div>

        {/* Footer dots */}
        <div className="flex justify-center gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ background: i === 1 ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function BrowserFrame({
  accentColor,
  preview,
}: {
  accentColor: string
  preview: Project['preview']
}) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_28px_70px_rgba(124,58,237,0.22)]"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${accentColor}0.2)`,
        boxShadow: `0 4px 32px rgba(0,0,0,0.4)`,
      }}
      data-cursor="project"
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderBottom: `1px solid ${accentColor}0.12)`,
        }}
      >
        <div className="flex gap-1.5">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.6 }} />
          ))}
        </div>
        <div
          className="flex-1 mx-3 h-5 rounded-md flex items-center px-2"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <span className="font-mono" style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
            {preview === 'air-quality' ? 'nepal-air-quality-dipenthapa7.streamlit.app' : 'dipenthapa7.com.np'}
          </span>
        </div>
      </div>

      {/* Project-specific preview */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
          {preview === 'air-quality' ? <AirQualityPreview /> : <PortfolioPreview />}
        </div>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-grid pointer-events-none" style={{ opacity: 0.15 }} />
        {/* Accent wash that blooms in on hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 100%, rgba(124,58,237,0.16) 0%, transparent 60%)',
          }}
        />
      </div>
    </div>
  )
}

function ProjectShowcase({
  project,
  index,
  flip,
  inView,
  onExpand,
}: {
  project: Project
  index: number
  flip: boolean
  inView: boolean
  onExpand: () => void
}) {
  return (
    <div
      className={`group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center reveal reveal-scale ${inView ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      {/* Image side */}
      <div className={flip ? 'lg:order-last' : ''}>
        <div
          className="relative transition-all duration-500"
          style={{
            transform: flip
              ? 'perspective(800px) rotateY(2deg)'
              : 'perspective(800px) rotateY(-2deg)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = flip
              ? 'perspective(800px) rotateY(4deg) translateY(-4px)'
              : 'perspective(800px) rotateY(-4deg) translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = flip
              ? 'perspective(800px) rotateY(2deg)'
              : 'perspective(800px) rotateY(-2deg)'
          }}
        >
          <button
            type="button"
            className="block w-full text-left"
            onClick={onExpand}
            aria-label={`Expand ${project.title} preview`}
          >
            <BrowserFrame accentColor={project.accentColor} preview={project.preview} />
          </button>
        </div>
      </div>

      {/* Info side */}
      <div className={`flex flex-col gap-5 ${flip ? 'lg:order-first' : ''}`}>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.12em' }}
        >
          PROJECT {project.number}
        </span>

        <h3
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: 'var(--text-1)',
            lineHeight: 1.15,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: '#a78bfa',
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {project.tagline}
        </p>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: 'var(--text-2)',
            lineHeight: 1.75,
          }}
        >
          {project.description}
        </p>

        <div
          className="rounded-xl px-4 py-3"
          style={{
            borderLeft: '2px solid rgba(167,139,250,0.55)',
            background: 'rgba(124,58,237,0.06)',
          }}
        >
          <p
            className="font-mono mb-1"
            style={{ fontSize: 9, color: '#a78bfa', letterSpacing: '0.12em' }}
          >
            PROCESS
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              color: 'var(--text-2-strong)',
              lineHeight: 1.6,
            }}
          >
            {project.process}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="tech-tag">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-1">
          <ProjectLink href={project.githubUrl} label="Source Code" />
          {project.liveUrl && (
            <ProjectLink href={project.liveUrl} label="View Live" primary />
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectLink({
  href,
  label,
  primary,
}: {
  href: string
  label: string
  primary?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-2 text-sm font-medium transition-all duration-200"
      style={{
        fontFamily: 'Inter, sans-serif',
        color: primary ? '#a78bfa' : 'var(--text-2)',
        padding: '6px 0',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = primary ? '#c4b5fd' : 'var(--text-1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = primary ? '#a78bfa' : 'var(--text-2)'
      }}
    >
      {label}
      <svg
        className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M2 10L10 2M10 2H5M10 2V7"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}
