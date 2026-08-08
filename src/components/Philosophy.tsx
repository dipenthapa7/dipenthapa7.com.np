import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'

export default function Philosophy() {
  const { ref, inView } = useInView(0.2)

  return (
    <section
      className="relative py-28 lg:py-44 overflow-hidden"
      ref={ref}
      aria-label="Personal philosophy"
    >
      {/* Very subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 65%)',
        }}
      />

      {/* Connective faint grid — bleeds the section into its neighbours */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid"
        style={{
          opacity: 0.5,
          maskImage: 'radial-gradient(ellipse at 50% 50%, #000 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, #000 0%, transparent 70%)',
        }}
        aria-hidden
      />

      {/* Soft floating accent orbs to fill the negative space */}
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          top: '18%',
          left: '12%',
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          animation: 'float-slow 9s ease-in-out infinite',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          bottom: '14%',
          right: '10%',
          width: 260,
          height: 260,
          background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)',
          animation: 'float 11s ease-in-out infinite',
        }}
        aria-hidden
      />

      {/* Horizontal rule top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px"
        style={{
          height: 60,
          background: 'linear-gradient(to bottom, transparent, var(--border))',
        }}
      />

      <div className="relative max-w-[960px] mx-auto px-6 text-center">
        <p
          className={`font-mono mb-10 reveal ${inView ? 'visible' : ''}`}
          style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.2em' }}
        >
          — A PHILOSOPHY —
        </p>

        <div
          className={`font-display font-bold leading-[1.05] tracking-tight stagger ${inView ? 'visible' : ''}`}
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
            color: 'var(--text-1)',
          }}
        >
          <p style={{ '--i': 1 } as CSSProperties}>I don&apos;t just write code.</p>
          <p style={{ '--i': 2 } as CSSProperties}>
            I design{' '}
            <span className="gradient-text">systems</span>,
          </p>
          <p style={{ '--i': 3 } as CSSProperties}>
            solve{' '}
            <span className="gradient-text-subtle">problems</span>,
          </p>
          <p style={{ '--i': 4 } as CSSProperties}>and build experiences.</p>
        </div>

        <p
          className={`mt-10 max-w-lg mx-auto leading-relaxed reveal ${inView ? 'visible' : ''} reveal-delay-3`}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 15,
            color: 'var(--text-2)',
            lineHeight: 1.75,
          }}
        >
          Every layer matters — from the pixel on screen to the packet
          on the wire. That&apos;s how I approach every project.
        </p>
      </div>

      {/* Horizontal rule bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px"
        style={{
          height: 60,
          background: 'linear-gradient(to top, transparent, var(--border))',
        }}
      />
    </section>
  )
}
