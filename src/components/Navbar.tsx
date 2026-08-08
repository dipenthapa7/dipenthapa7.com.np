import { useEffect, useRef, useState } from 'react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const menu = menuRef.current
    const focusable = menu?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    focusable?.[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    const sections = links.map((l) => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ animation: 'slide-down 0.6s ease 0.2s both' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 pt-4">
          <nav
            className="relative overflow-hidden flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500"
            style={{
              background: scrolled
                ? 'rgba(6,6,9,0.85)'
                : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              boxShadow: scrolled
                ? '0 4px 30px rgba(0,0,0,0.4)'
                : 'none',
            }}
          >
            {/* Scroll progress rail */}
            <div
              className="absolute left-0 bottom-0 h-px rounded-full transition-opacity duration-500"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-2), var(--accent))',
                opacity: scrolled ? 0.9 : 0,
                boxShadow: '0 0 8px rgba(124,58,237,0.6)',
              }}
            />
            {/* DT Monogram */}
            <a
              href="#"
              className="flex items-center gap-0 select-none"
              aria-label="Dipen Thapa — home"
            >
              <span
                className="font-display font-bold text-xl leading-none"
                style={{ color: 'var(--text-1)', letterSpacing: '-0.02em' }}
              >
                D
              </span>
              <span
                className="font-display font-bold text-xl leading-none"
                style={{ color: 'var(--accent)', letterSpacing: '-0.02em' }}
              >
                T
              </span>
            </a>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const id = link.href.slice(1)
                const isActive = active === id
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="relative px-3 py-1.5 text-sm transition-colors duration-200 rounded-lg"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                      }}
                    >
                      {isActive && (
                        <span
                          className="absolute inset-0 rounded-lg"
                          style={{ background: 'var(--accent-dim)' }}
                        />
                      )}
                      <span className="relative">{link.label}</span>
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ background: 'var(--accent)' }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* Resume CTA + hamburger */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/dipenthapa7"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: '#a78bfa',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.2)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-dim)'
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                }}
              >
                GitHub
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Hamburger */}
              <button
                ref={menuButtonRef}
                type="button"
                className="md:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
              >
                <span
                  className="block w-5 h-px transition-all duration-300"
                  style={{
                    background: 'var(--text-1)',
                    transform: menuOpen
                      ? 'rotate(45deg) translate(3px, 3px)'
                      : 'none',
                  }}
                />
                <span
                  className="block w-5 h-px transition-all duration-300"
                  style={{
                    background: 'var(--text-1)',
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  className="block w-5 h-px transition-all duration-300"
                  style={{
                    background: 'var(--text-1)',
                    transform: menuOpen
                      ? 'rotate(-45deg) translate(3px, -3px)'
                      : 'none',
                  }}
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="fixed inset-0 z-40 pt-24 px-6"
          style={{ background: 'rgba(6,6,9,0.97)', backdropFilter: 'blur(20px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setMenuOpen(false)
          }}
        >
          <ul className="flex flex-col gap-1">
            {links.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex items-center justify-between py-4 border-b text-xl font-display font-medium transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-1)',
                    animation: `fade-up 0.4s ease ${i * 0.06}s both`,
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 16L16 4M16 4H8M16 4V12"
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a
                href="https://github.com/dipenthapa7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: 'var(--accent-dim)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: '#a78bfa',
                  animation: `fade-up 0.4s ease ${links.length * 0.06}s both`,
                }}
                onClick={() => setMenuOpen(false)}
              >
                GitHub ↗
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
