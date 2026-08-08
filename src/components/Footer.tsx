export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative py-12 px-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: Monogram + name */}
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg leading-none" style={{ letterSpacing: '-0.02em' }}>
              <span style={{ color: 'var(--text-1)' }}>D</span>
              <span style={{ color: 'var(--accent)' }}>T</span>
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: 'var(--text-3)',
              }}
            >
              Dipen Thapa
            </span>
          </div>

          {/* Center: tagline */}
          <p
            className="font-mono text-center"
            style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em' }}
          >
            DESIGNED & BUILT WITH CURIOSITY + CODE
          </p>

          {/* Right: social links */}
          <div className="flex items-center gap-4">
            {[
              { label: 'GitHub', href: 'https://github.com/dipenthapa7' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dipen-thapa-34073432b' },
              { label: 'Email', href: 'mailto:tretime865@gmail.com' },
              { label: 'CV', href: '/Dipen-Thapa-CV.pdf', download: 'Dipen-Thapa-CV.pdf' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== 'Email' && !link.download ? '_blank' : undefined}
                rel={link.label !== 'Email' && !link.download ? 'noopener noreferrer' : undefined}
                download={link.download}
                className="transition-colors duration-200"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  color: 'var(--text-3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p
            className="font-mono"
            style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}
          >
            © {year} Dipen Thapa · Nepal
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 transition-colors duration-200"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: 'var(--text-3)',
              letterSpacing: '0.1em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}
          >
            BACK TO TOP
            <svg
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M6 10V2M6 2L2.5 5.5M6 2L9.5 5.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
