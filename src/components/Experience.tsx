import { useInView } from '../hooks/useInView'
import CountUp from './CountUp'
import WordReveal from './WordReveal'

interface ExperienceEntry {
  role: string
  context: string
  period?: string // optional — hidden when unverified
  description: string
  tech: string[]
  outcomes: { stat: string; label: string }[]
}

const ENTRY: ExperienceEntry = {
  role: 'Data Science Project — Nepal Air Quality',
  context: 'Independent Project · Data Science',
  // period intentionally omitted — no verified project date available
  description:
    "Analyzed Nepal's PM2.5 exposure data from 1990–2023 using World Bank indicators and built a reproducible Python data-analysis pipeline with an interactive Streamlit dashboard.",
  tech: ['Python', 'Pandas', 'Plotly', 'Streamlit', 'Jupyter', 'Git'],
  outcomes: [
    { stat: '33 YEARS', label: 'Data analyzed' },
    { stat: 'INTERACTIVE', label: 'Streamlit dashboard' },
    { stat: '~25% INCREASE', label: 'PM2.5 exposure over the study period' },
  ],
}

export default function Experience() {
  const { ref, inView } = useInView()

  return (
    <section id="experience" className="relative py-28 lg:py-36" ref={ref}>
      <div className="relative max-w-[1280px] mx-auto px-6">
        {/* Header — asymmetric, single-line with split-color word */}
        <div className="mb-16 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <WordReveal
            inView={inView}
            className="font-display font-bold leading-[1.0] tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)', color: 'var(--text-1)' }}
            words={[
              { text: 'Applied' },
              { text: 'in' },
              { text: 'practice', className: 'gradient-text' },
            ]}
          />
          <div className={`section-label reveal ${inView ? 'visible' : ''} reveal-delay-1`}>
            03 / Technical Experience
          </div>
        </div>

        {/* Single featured technical experience */}
        <div
          className={`reveal reveal-scale ${inView ? 'visible' : ''} reveal-delay-2`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Left accent — timeline-inspired spine */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(124,58,237,0.5) 15%, rgba(124,58,237,0.35) 85%, transparent)',
              }}
            />
            <div
              className="absolute left-0 top-10 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 0 10px rgba(124,58,237,0.6)',
              }}
            />

            <div className="p-8 lg:p-12">
              {/* Header row */}
              <div className="flex flex-col gap-2 mb-6">
                <h3
                  className="font-display font-semibold"
                  style={{
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                    color: 'var(--text-1)',
                    lineHeight: 1.2,
                  }}
                >
                  {ENTRY.role}
                </h3>
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      color: '#a78bfa',
                      fontWeight: 500,
                    }}
                  >
                    {ENTRY.context}
                  </span>
                  {ENTRY.period && (
                    <>
                      <span style={{ color: 'var(--text-3)' }}>·</span>
                      <span
                        className="font-mono"
                        style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.06em' }}
                      >
                        {ENTRY.period}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p
                className="max-w-2xl"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 15,
                  color: 'var(--text-2)',
                  lineHeight: 1.75,
                }}
              >
                {ENTRY.description}
              </p>

              {/* Outcomes row */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {ENTRY.outcomes.map((o) => (
                  <div key={o.stat} className="flex flex-col gap-1">
                    <CountUp
                      value={o.stat}
                      className="font-display font-bold"
                      style={{
                        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                        color: '#a78bfa',
                        lineHeight: 1.1,
                        display: 'block',
                      }}
                    />
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 13,
                        color: 'var(--text-2)',
                        lineHeight: 1.4,
                      }}
                    >
                      {o.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Technology tags */}
              <div className="flex flex-wrap gap-2 mt-8">
                {ENTRY.tech.map((t) => (
                  <span key={t} className="tech-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
