import { useInView } from '../hooks/useInView'
import WordReveal from './WordReveal'

interface EducationEntry {
  institution?: string // optional — hidden when unknown
  institutionUrl?: string
  degree: string
  period: string
  location: string
  programMeta?: string
  pathway?: string
  detail?: string
}

interface CertEntry {
  title: string
  issuer: string
  year?: string // optional — omitted when unknown
  credentialId?: string
  verifyUrl?: string
  verifyLabel?: string // visible link text, e.g. "Verify Credential"
  ariaLabel?: string // descriptive, per-credential accessible label
}

const EDUCATION: EducationEntry[] = [
  {
    institution: 'Model Institute of Technology College (MIT)',
    institutionUrl: 'https://mitnepal.edu.np/',
    degree: 'Bachelor of Information Technology (BIT)',
    period: 'Currently Enrolled',
    location: 'Kamaladi, Kathmandu, Nepal',
    programMeta: '4-Year · 129-Credit Undergraduate Program',
    pathway:
      'American degree pathway in collaboration with International American University (IAU), USA',
    detail:
      'Currently pursuing a Bachelor of Information Technology while building practical experience in data science, machine learning, web development, and modern computing technologies.',
  },
]

// Strongest, most relevant credential — shown at full visual weight.
const CERTIFICATIONS: CertEntry[] = [
  {
    title: 'Python (Basic)',
    issuer: 'HackerRank',
    // year/credentialId unknown — omitted (not inventing)
    verifyUrl: 'https://www.hackerrank.com/certificates/c1f9e6ac26fe',
    verifyLabel: 'Verify Credential',
    ariaLabel: 'Verify Python Basic credential on HackerRank',
  },
  {
    title: 'Ethical Hacker',
    issuer: 'Cisco',
    year: '2025',
    verifyUrl: 'https://www.credly.com/badges/b287a8a0-2c03-421b-ad85-b367963a62ee/public_url',
    verifyLabel: 'Verify on Credly',
    ariaLabel: 'Verify Ethical Hacker badge issued by Cisco to Dipen Thapa on Credly',
  },
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco',
    year: '2025',
    verifyUrl: 'https://www.credly.com/badges/cc36bebb-f903-4703-8b0b-576f02dc13cf/public_url',
    verifyLabel: 'Verify on Credly',
    ariaLabel: 'Verify Introduction to Cybersecurity badge issued by Cisco to Dipen Thapa on Credly',
  },
  {
    title: 'Introduction to IoT',
    issuer: 'Cisco',
    year: '2025',
    verifyUrl: 'https://www.credly.com/badges/a8cf046e-2bcd-413d-ac88-a40422455762/public_url',
    verifyLabel: 'Verify on Credly',
    ariaLabel: 'Verify Introduction to IoT badge issued by Cisco to Dipen Thapa on Credly',
  },
  {
    title: 'Networking Basics',
    issuer: 'Cisco',
    year: '2025',
    verifyUrl: 'https://www.credly.com/badges/84153280-5f7b-476b-8b34-ba207df3b35c/public_url',
    verifyLabel: 'Verify on Credly',
    ariaLabel: 'Verify Networking Basics badge issued by Cisco to Dipen Thapa on Credly',
  },
]

// Supporting / soft-skill credentials — demoted to a compact secondary row.
const ADDITIONAL_CERTS: CertEntry[] = [
  {
    title: 'Time Management',
    issuer: 'Skill Lab',
    verifyUrl: 'https://courses.careerservicelab.com/mod/customcert/view.php?id=3207&downloadown=1',
    verifyLabel: 'View Certificate',
    ariaLabel: 'View Time Management certificate from Skill Lab',
  },
]

export default function EducationCerts() {
  const { ref, inView } = useInView()

  return (
    <section id="education" className="relative py-28 lg:py-36" ref={ref}>
      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24">
          {/* Education */}
          <div>
            <div className={`reveal ${inView ? 'visible' : ''}`}>
              <div className="section-label mb-8">06 / Education</div>
            </div>

            <WordReveal
              inView={inView}
              className="font-display font-bold leading-[1.05] tracking-tight mb-12"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--text-1)' }}
              words={[
                { text: 'Academic' },
                {
                  text: 'foundation.',
                  style: {
                    WebkitTextStroke: '1px rgba(167,139,250,0.7)',
                    WebkitTextFillColor: 'transparent',
                  },
                },
              ]}
            />

            <div className="flex flex-col gap-8">
              {EDUCATION.map((edu, i) => (
                <div
                  key={i}
                  className={`reveal reveal-scale ${inView ? 'visible' : ''}`}
                  style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
                >
                  <div
                    className="p-6 rounded-2xl"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3
                        className="font-display font-semibold"
                        style={{ fontSize: 16, color: 'var(--text-1)', lineHeight: 1.3 }}
                      >
                        {edu.degree}
                      </h3>
                      <span
                        className="font-mono flex-shrink-0"
                        style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', paddingTop: 2 }}
                      >
                        {edu.period}
                      </span>
                    </div>

                    {edu.institution && (
                      edu.institutionUrl ? (
                        <a
                          href={edu.institutionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/inst inline-flex items-center gap-1.5 transition-colors duration-200"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 13,
                            color: '#a78bfa',
                            fontWeight: 500,
                            marginBottom: 6,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#c4b5fd' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#a78bfa' }}
                        >
                          {edu.institution}
                          <svg
                            className="transition-transform duration-200 group-hover/inst:translate-x-0.5 group-hover/inst:-translate-y-0.5"
                            width="11"
                            height="11"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      ) : (
                        <p
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 13,
                            color: 'var(--accent)',
                            opacity: 0.8,
                            fontWeight: 500,
                            marginBottom: 6,
                          }}
                        >
                          {edu.institution}
                        </p>
                      )
                    )}

                    <p
                      className="font-mono"
                      style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: edu.programMeta ? 8 : (edu.detail ? 10 : 0) }}
                    >
                      {edu.location}
                    </p>

                    {edu.programMeta && (
                      <span
                        className="inline-block font-mono"
                        style={{
                          fontSize: 10,
                          color: '#a78bfa',
                          letterSpacing: '0.06em',
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: 'rgba(124,58,237,0.1)',
                          border: '1px solid rgba(124,58,237,0.2)',
                        }}
                      >
                        {edu.programMeta}
                      </span>
                    )}

                    {edu.detail && (
                      <p
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 13,
                          color: 'var(--text-2)',
                          lineHeight: 1.6,
                          marginTop: 8,
                          paddingTop: 10,
                          borderTop: '1px solid var(--border)',
                        }}
                      >
                        {edu.detail}
                      </p>
                    )}

                    {edu.pathway && (
                      <p
                        className="flex items-start gap-2"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: 12,
                          color: 'var(--text-3)',
                          lineHeight: 1.55,
                          marginTop: 10,
                        }}
                      >
                        <span
                          className="mt-1 w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: 'var(--accent)' }}
                        />
                        {edu.pathway}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className={`reveal ${inView ? 'visible' : ''} reveal-delay-1`}>
              <div className="section-label mb-8">07 / Certifications</div>
            </div>

            <WordReveal
              inView={inView}
              className="font-display font-bold leading-[1.05] tracking-tight mb-12"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: 'var(--text-1)' }}
              words={[
                { text: 'Verified', style: { fontWeight: 400 } },
                { text: 'credentials.', className: 'gradient-text-subtle' },
              ]}
            />

            <div className="flex flex-col gap-3">
              {CERTIFICATIONS.map((cert, i) => (
                <CertCard
                  key={i}
                  cert={cert}
                  index={i}
                  inView={inView}
                />
              ))}
            </div>

            {/* Additional / supporting credentials — demoted visual weight */}
            {ADDITIONAL_CERTS.length > 0 && (
              <div className={`mt-8 reveal ${inView ? 'visible' : ''} reveal-delay-3`}>
                <p
                  className="font-mono mb-3"
                  style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.14em' }}
                >
                  ALSO COMPLETED
                </p>
                <div className="flex flex-wrap gap-2">
                  {ADDITIONAL_CERTS.map((cert, i) => (
                    <a
                      key={i}
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-colors duration-200"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 12,
                        color: 'var(--text-2)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-1)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                      aria-label={cert.ariaLabel}
                    >
                      {cert.title}
                      <span style={{ color: 'var(--text-3)' }}>· {cert.issuer}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

function CertCard({ cert, index, inView }: { cert: CertEntry; index: number; inView: boolean }) {
  return (
    <div
      className={`group flex items-center justify-between gap-4 p-5 rounded-2xl transition-all duration-300 reveal ${inView ? 'visible' : ''}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        transitionDelay: `${0.25 + index * 0.08}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(124,58,237,0.06)'
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'
        e.currentTarget.style.transform = 'translateX(4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--surface)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      <div className="flex items-start gap-4 min-w-0">
        {/* Issuer icon */}
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <span className="font-display font-bold" style={{ fontSize: 13, color: '#a78bfa' }}>
            {cert.issuer.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="min-w-0">
          <p
            className="font-display font-semibold"
            style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.3 }}
          >
            {cert.title}
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              color: 'var(--text-2)',
              marginTop: 3,
            }}
          >
            {cert.issuer}
            {cert.credentialId && cert.credentialId !== '[CREDENTIAL ID]' && (
              <span style={{ color: 'var(--text-3)' }}> · {cert.credentialId}</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {cert.year && (
          <span
            className="font-mono"
            style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.06em' }}
          >
            {cert.year}
          </span>
        )}

        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-200 whitespace-nowrap"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: 'var(--text-3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a78bfa' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-3)' }}
            aria-label={cert.ariaLabel ?? `${cert.verifyLabel ?? 'Verify'} — ${cert.title}, ${cert.issuer}`}
          >
            <span className="hidden sm:inline">{cert.verifyLabel ?? 'Verify Credential'}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 2M12 2H6M12 2V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
