import { useState } from 'react'
import { useInView } from '../hooks/useInView'
import WordReveal from './WordReveal'

interface Skill {
  name: string
  category: string
}

const CATEGORIES = ['All', 'Data Science', 'Machine Learning', 'Web', 'Visualization', 'Tools']

const SKILLS: Skill[] = [
  { name: 'Python', category: 'Data Science' },
  { name: 'Pandas', category: 'Data Science' },
  { name: 'NumPy', category: 'Data Science' },
  { name: 'scikit-learn', category: 'Machine Learning' },
  { name: 'Plotly', category: 'Visualization' },
  { name: 'Matplotlib', category: 'Visualization' },
  { name: 'Seaborn', category: 'Visualization' },
  { name: 'Streamlit', category: 'Visualization' },
  { name: 'HTML', category: 'Web' },
  { name: 'CSS', category: 'Web' },
  { name: 'JavaScript', category: 'Web' },
  { name: 'React', category: 'Web' },
  { name: 'Node.js', category: 'Web' },
  { name: 'Tailwind CSS', category: 'Web' },
  { name: 'Java', category: 'Tools' },
  { name: 'C++', category: 'Tools' },
  { name: 'Git', category: 'Tools' },
  { name: 'GitHub', category: 'Tools' },
  { name: 'Linux', category: 'Tools' },
  { name: 'VS Code', category: 'Tools' },
  { name: 'Jupyter', category: 'Tools' },
]

const SKILL_ICONS: Record<string, string> = {
  Python: 'Py',
  Pandas: 'Pd',
  NumPy: 'Np',
  'scikit-learn': 'SK',
  Plotly: '📊',
  Matplotlib: 'MPL',
  Seaborn: 'SB',
  Streamlit: 'ST',
  HTML: '⟨/⟩',
  CSS: '✦',
  JavaScript: 'JS',
  React: '⚛',
  'Node.js': 'N',
  'Tailwind CSS': 'TW',
  Java: '☕',
  'C++': 'C+',
  Git: '⑃',
  GitHub: '⊙',
  Linux: '🐧',
  'VS Code': '⊞',
  Jupyter: '⬡',
}

export default function Expertise() {
  const [active, setActive] = useState('All')
  const { ref, inView } = useInView()

  const filtered =
    active === 'All' ? SKILLS : SKILLS.filter((s) => s.category === active)

  return (
    <section id="expertise" className="relative py-28 lg:py-36" ref={ref}>
      {/* Oversized background word */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-bold select-none leading-none"
          style={{
            fontSize: 'clamp(6rem, 18vw, 15rem)',
            color: 'rgba(255,255,255,0.018)',
            letterSpacing: '-0.04em',
            marginRight: '-2vw',
          }}
        >
          SKILLS
        </span>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        {/* Header — oversized numeral as graphic element, split-color heading */}
        <div className="mb-14 flex items-end gap-6">
          <span
            className={`font-display font-bold leading-[0.8] select-none reveal ${inView ? 'visible' : ''}`}
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(124,58,237,0.35)',
            }}
            aria-hidden
          >
            02
          </span>
          <div>
            <div className={`section-label mb-4 reveal ${inView ? 'visible' : ''}`}>Expertise</div>
            <WordReveal
              inView={inView}
              className="font-display font-bold leading-[1.0] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: 'var(--text-1)' }}
              words={[
                { text: 'Technologies' },
                { text: 'I' },
                { text: 'build', className: 'gradient-text-subtle' },
                { text: 'with' },
              ]}
            />
          </div>
        </div>

        {/* Category filters */}
        <div
          className={`flex flex-wrap gap-2 mb-10 reveal ${inView ? 'visible' : ''} reveal-delay-2`}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: 'Inter, sans-serif',
                background:
                  active === cat ? 'var(--accent-dim)' : 'transparent',
                border:
                  active === cat
                    ? '1px solid rgba(124,58,237,0.35)'
                    : '1px solid var(--border)',
                color: active === cat ? '#a78bfa' : 'var(--text-2)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 reveal reveal-scale ${inView ? 'visible' : ''} reveal-delay-3`}
        >
          {filtered.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

const FEATURED = new Set(['Python', 'React', 'Pandas'])

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const featured = FEATURED.has(skill.name)
  return (
    <div
      className="group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300"
      style={{
        background: featured ? 'rgba(124,58,237,0.08)' : 'var(--surface)',
        border: `1px solid ${featured ? 'rgba(124,58,237,0.3)' : 'var(--border)'}`,
        boxShadow: featured ? '0 0 0 1px rgba(124,58,237,0.12), 0 10px 30px rgba(60,30,120,0.15)' : 'none',
        cursor: 'default',
        transitionDelay: `${index * 0.04}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,58,237,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = featured ? 'rgba(124,58,237,0.08)' : 'var(--surface)'
        e.currentTarget.style.borderColor = featured ? 'rgba(124,58,237,0.3)' : 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = featured ? '0 0 0 1px rgba(124,58,237,0.12), 0 10px 30px rgba(60,30,120,0.15)' : 'none'
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{
          width: featured ? 48 : 40,
          height: featured ? 48 : 40,
          background: featured ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.1)',
          border: `1px solid ${featured ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.15)'}`,
        }}
      >
        <span
          className="font-mono font-medium"
          style={{ fontSize: featured ? 16 : 13, color: featured ? '#c4b5fd' : '#a78bfa' }}
        >
          {SKILL_ICONS[skill.name] ?? skill.name.slice(0, 2)}
        </span>
      </div>

      {/* Name */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-1)',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {skill.name}
      </p>

      {/* Category label */}
      <p
        className="font-mono"
        style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em' }}
      >
        {skill.category.toUpperCase()}
      </p>
    </div>
  )
}
