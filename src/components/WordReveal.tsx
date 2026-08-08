import { Fragment, type CSSProperties } from 'react'

export interface RevealWord {
  text: string
  className?: string
  style?: CSSProperties
  breakAfter?: boolean
}

export default function WordReveal({
  words,
  inView,
  className = '',
  style,
  label,
}: {
  words: RevealWord[]
  inView: boolean
  className?: string
  style?: CSSProperties
  label?: string
}) {
  const accessibleLabel = label ?? words.map((word) => word.text).join(' ')

  return (
    <h2
      className={`word-reveal-heading ${inView ? 'visible' : ''} ${className}`}
      style={style}
      aria-label={accessibleLabel}
    >
      {words.map((word, index) => (
        <Fragment key={`${word.text}-${index}`}>
          <span className="word-reveal-mask" aria-hidden>
            <span
              className={`word-reveal-token ${word.className ?? ''}`}
              style={{
                transitionDelay: `${90 + index * 65}ms`,
                ...word.style,
              }}
            >
              {word.text}
            </span>
          </span>
          {word.breakAfter && <br aria-hidden />}
        </Fragment>
      ))}
    </h2>
  )
}
