import { useEffect, useRef } from 'react'
import InfraCore from './InfraCore'

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null)

  // Signature move: the name block reacts with a subtle magnetic parallax
  // to pointer movement across the hero — disabled for reduced-motion/touch.
  useEffect(() => {
    const el = nameRef.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const section = el.closest('section')
    if (!section) return

    let raf = 0
    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${px * 22}px, ${py * 14}px, 0)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.transform = 'translate3d(0, 0, 0)'
    }

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-grid"
      data-hero
      aria-label="Introduction"
    >
      {/* Radial ambient light top-right */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '-10%',
          right: '-5%',
          width: 700,
          height: 700,
          background:
            'radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Radial ambient light bottom-left */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: '-15%',
          left: '-10%',
          width: 500,
          height: 500,
          background:
            'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-12 lg:gap-6 items-center">
          {/* ── Left: Text content ──────────────────── */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Availability badge */}
            <div
              className="flex items-center gap-2 w-fit"
              style={{ animation: 'fade-up 0.6s ease 0.1s both' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#22c55e',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                  boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                }}
              />
              <span
                className="font-mono text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--text-3)', letterSpacing: '0.14em' }}
              >
                Open to opportunities
              </span>
            </div>

            {/* Eyebrow */}
            <div style={{ animation: 'fade-up 0.6s ease 0.2s both' }}>
              <span
                className="font-mono text-xs tracking-[0.22em] uppercase"
                style={{ color: 'var(--text-3)' }}
              >
                Hello, I&apos;m
              </span>
            </div>

            {/* Hero name — kinetic mask reveal + magnetic parallax */}
            <div ref={nameRef} className="hero-name flex flex-col">
              <h1
                className="font-display font-bold leading-[0.88] tracking-tight"
                aria-label="Dipen Thapa"
              >
                <span
                  className="hero-line"
                  style={{
                    fontSize: 'clamp(5rem, 11vw, 10.5rem)',
                    color: 'var(--text-1)',
                  }}
                  aria-hidden
                >
                  <span style={{ animationDelay: '0.25s' }}>DIPEN</span>
                </span>
                <span
                  className="hero-line"
                  style={{ fontSize: 'clamp(5rem, 11vw, 10.5rem)' }}
                  aria-hidden
                >
                  <span
                    className="gradient-text hero-shimmer"
                    style={{ animationDelay: '0.38s' }}
                  >
                    THAPA
                  </span>
                </span>
              </h1>
            </div>

            {/* Tagline */}
            <div
              className="flex flex-wrap items-center gap-2 mt-1"
              style={{ animation: 'fade-up 0.6s ease 0.45s both' }}
            >
              {[
                'Python & Data Science Developer',
                'Machine Learning',
                'Web Development',
              ].map((tag, i) => (
                <span key={tag}>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      color: i === 0 ? 'var(--text-1)' : 'var(--text-2)',
                      fontWeight: i === 0 ? 500 : 400,
                    }}
                  >
                    {tag}
                  </span>
                  {i < 2 && (
                    <span
                      className="ml-2"
                      style={{ color: 'var(--text-3)', fontSize: 12 }}
                    >
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p
              className="text-base leading-relaxed max-w-[480px]"
              style={{
                color: 'var(--text-2)',
                animation: 'fade-up 0.6s ease 0.55s both',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              BIT student from Bhaktapur, Nepal — focused on Data Science and
              Machine Learning, working with Python, Pandas, and scikit-learn
              on real-world datasets. I also build web experiences with React
              and JavaScript.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 mt-1"
              style={{ animation: 'fade-up 0.6s ease 0.65s both' }}
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 0 0 0 var(--accent-glow)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 0 var(--accent-glow)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Explore my work
                <svg
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-2)',
                  color: 'var(--text-1)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-2)'
                  e.currentTarget.style.borderColor = 'var(--border-2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--border-2)'
                }}
              >
                Let&apos;s connect
              </a>
            </div>

            {/* Social links */}
            <div
              className="flex items-center gap-4 mt-1"
              style={{ animation: 'fade-up 0.6s ease 0.75s both' }}
            >
              {[
                {
                  label: 'GitHub',
                  href: 'https://github.com/dipenthapa7',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/in/dipen-thapa-34073432b',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: 'Download CV',
                  href: '/Dipen-Thapa-CV.pdf',
                  download: 'Dipen-Thapa-CV.pdf',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 3.75h6.25L17 7.5v12.75H7V3.75Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path d="M13 3.75V8h4M12 10.75v5m0 0-2-2m2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.download ? undefined : '_blank'}
                  rel={social.download ? undefined : 'noopener noreferrer'}
                  download={social.download}
                  aria-label={social.download ? 'Download Dipen Thapa CV as PDF' : social.label}
                  className="flex items-center gap-2 text-sm transition-colors duration-200"
                  style={{ color: 'var(--text-3)', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-3)'
                  }}
                >
                  {social.icon}
                  <span className="hidden sm:inline">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: InfraCore visual ──────────────── */}
          <div
            className="flex items-center justify-center lg:justify-end"
            style={{ animation: 'fade-in 1s ease 0.5s both' }}
          >
            <InfraCore />
          </div>
        </div>

        {/* ── Scroll indicator ────────────────────── */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ animation: 'fade-in 1s ease 1.2s both' }}
        >
          <span
            className="font-mono text-[9px] tracking-[0.2em] uppercase"
            style={{ color: 'var(--text-3)' }}
          >
            Scroll to explore
          </span>
          <div
            className="w-px h-10 overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, var(--accent), transparent)',
                animation: 'scroll-line 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
