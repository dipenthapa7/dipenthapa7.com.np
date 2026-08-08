export default function SectionBridge() {
  return (
    <div className="relative h-20 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-grid"
        style={{
          opacity: 0.42,
          maskImage:
            'linear-gradient(to bottom, transparent, #000 38%, #000 62%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, #000 38%, #000 62%, transparent)',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-px w-[min(72vw,760px)] -translate-x-1/2"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(124,58,237,0.42), transparent)',
          boxShadow: '0 0 18px rgba(124,58,237,0.2)',
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: '#c4b5fd',
          boxShadow: '0 0 12px rgba(167,139,250,0.9)',
        }}
      />
    </div>
  )
}
