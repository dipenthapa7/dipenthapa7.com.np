export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-grid px-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(124,58,237,0.16), transparent 48%)',
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-[900px] flex-col items-center justify-center text-center">
        <p className="section-label mb-8">SIGNAL LOST / 404</p>
        <p
          className="font-display font-bold gradient-text"
          style={{ fontSize: 'clamp(7rem, 24vw, 15rem)', lineHeight: 0.8 }}
          aria-hidden
        >
          404
        </p>
        <h1
          className="mt-8 font-display font-bold tracking-tight"
          style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
        >
          This route left the pipeline.
        </h1>
        <p className="mt-5 max-w-[560px]" style={{ color: 'var(--text-2-strong)' }}>
          The page does not exist, but the system is still running.
        </p>
        <a
          href="/"
          className="mt-9 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            boxShadow: '0 0 24px rgba(124,58,237,0.28)',
          }}
        >
          Return to the portfolio
          <span aria-hidden>↗</span>
        </a>
      </div>
    </main>
  )
}
