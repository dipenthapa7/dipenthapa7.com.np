import { useEffect, useState } from 'react'

export default function IntroLoader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const alreadySeen = sessionStorage.getItem('dt-intro-seen') === 'true'
    if (reduced || alreadySeen) return

    setVisible(true)
    const timer = window.setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('dt-intro-seen', 'true')
    }, 1450)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('dt-intro-seen', 'true')
  }

  return (
    <div
      className="intro-loader"
      role="dialog"
      aria-modal="true"
      aria-label="Opening Dipen Thapa portfolio"
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault()
          event.currentTarget.querySelector('button')?.focus()
        }
      }}
    >
      <div className="intro-loader__mark" aria-hidden>
        <span>D</span>
        <span>T</span>
      </div>
      <div className="intro-loader__rail" aria-hidden>
        <span />
      </div>
      <button type="button" onClick={dismiss} autoFocus>
        Skip intro
      </button>
    </div>
  )
}
