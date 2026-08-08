import { useEffect, useRef, useState } from "react"
import { useInView } from "../hooks/useInView"
import dipenPortrait from "../imports/dipen-portrait.webp"
import WordReveal from "./WordReveal"

const INFO_ITEMS = [
  { label: "Location", value: "Bhaktapur, Nepal" },
  { label: "Education", value: "BIT Undergraduate" },
  { label: "Focus", value: "Data Science · ML · Web Development" },
  { label: "Status", value: "Open to Opportunities" },
]

/**
 * Extremely subtle mouse-based parallax for the identity portrait.
 * Desktop pointers only — disabled on touch devices and when the
 * user prefers reduced motion.
 */
function usePortraitParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!finePointer.matches || reducedMotion.matches) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      // Max ~6px drift — a whisper of depth, no dramatic tilt.
      setOffset({ x: px * -12, y: py * -8 })
    }
    const onLeave = () => setOffset({ x: 0, y: 0 })

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return { ref, offset }
}

export default function About() {
  const { ref, inView } = useInView()
  const { ref: cardRef, offset } = usePortraitParallax()

  return (
    <section id="about" className="relative py-28 lg:py-36" ref={ref}>
      {/* Oversized background word */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-start overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-bold select-none leading-none"
          style={{
            fontSize: "clamp(8rem, 22vw, 18rem)",
            color: "rgba(255,255,255,0.018)",
            letterSpacing: "-0.04em",
            marginLeft: "-2vw",
            userSelect: "none",
          }}
        >
          ABOUT
        </span>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        {/* Section label */}
        <div className={`reveal ${inView ? "visible" : ""}`}>
          <div className="section-label mb-8">01 / About</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Text content */}
          <div className="flex flex-col gap-8">
            <WordReveal
              inView={inView}
              className="font-display font-bold leading-[1.05] tracking-tight"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                color: "var(--text-1)",
              }}
              words={[
                { text: "Engineering" },
                { text: "ideas" },
                { text: "into", className: "gradient-text-subtle" },
                { text: "experiences.", className: "gradient-text-subtle" },
              ]}
            />

            <div
              className={`flex flex-col gap-5 reveal ${
                inView ? "visible" : ""
              } reveal-delay-2`}
            >
              <p
                className="leading-relaxed"
                style={{
                  color: "var(--text-2)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  lineHeight: 1.75,
                }}
              >
                I&apos;m Dipen Thapa — a BIT student from Bhaktapur, Nepal,
                focused on Data Science and Machine Learning. I work with
                Python, Pandas, and scikit-learn on real-world datasets, turning
                raw data into meaningful insights.
              </p>
              <p
                className="leading-relaxed"
                style={{
                  color: "var(--text-2)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  lineHeight: 1.75,
                }}
              >
                Beyond data, I build web experiences with React and JavaScript,
                and I&apos;m comfortable working in Linux environments. I care
                about solving real problems with well-crafted, reproducible
                code.
              </p>
            </div>

            {/* Info items */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-px reveal ${
                inView ? "visible" : ""
              } reveal-delay-3`}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {INFO_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="px-5 py-4"
                  style={{ background: "var(--surface)" }}
                >
                  <p
                    className="font-mono mb-1"
                    style={{
                      fontSize: 10,
                      color: "var(--text-3)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      color: "var(--text-1)",
                      fontWeight: 500,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className={`flex flex-col gap-6 reveal reveal-scale ${
              inView ? "visible" : ""
            } reveal-delay-2`}
          >
            {/* Identity card — portrait as the primary human visual */}
            <div
              ref={cardRef}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                aspectRatio: "3/4",
                maxHeight: 480,
              }}
            >
              {/* Abstract gradient composition */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(79,70,229,0.1) 0%, transparent 50%)",
                }}
              />

              {/* Grid overlay */}
              <div
                className="absolute inset-0 bg-grid"
                style={{ opacity: 0.6 }}
              />

              {/* Purple atmospheric glow behind the subject — depth separation */}
              <div
                className="pointer-events-none absolute"
                style={{
                  left: "50%",
                  bottom: "2%",
                  width: "80%",
                  height: "72%",
                  transform: `translateX(calc(-50% + ${offset.x * 0.4}px))`,
                  background:
                    "radial-gradient(ellipse at 50% 45%, rgba(124,58,237,0.34) 0%, rgba(79,70,229,0.15) 45%, transparent 72%)",
                  filter: "blur(14px)",
                }}
              />

              {/* Portrait — full head-to-torso, face as focal point, soft bottom fade */}
              <div
                className="pointer-events-none absolute inset-0 flex items-end justify-center"
                style={{
                  paddingTop: "9%",
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                  transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                  willChange: "transform",
                }}
              >
                <img
                  src={dipenPortrait}
                  alt="Dipen Thapa in a cream formal suit"
                  width={677}
                  height={1413}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="select-none"
                  style={{
                    height: "100%",
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    objectPosition: "bottom center",
                    transform: "translateX(7%)",
                    filter:
                      "drop-shadow(0 0 16px rgba(124,58,237,0.32)) drop-shadow(0 10px 22px rgba(0,0,0,0.55))",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 66%, rgba(0,0,0,0.35) 87%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, #000 66%, rgba(0,0,0,0.35) 87%, transparent 100%)",
                  }}
                />
              </div>

              {/* Readability scrim for the name/title */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0"
                style={{
                  height: "42%",
                  background:
                    "linear-gradient(to top, rgba(6,6,9,0.92) 8%, rgba(6,6,9,0.5) 45%, transparent 100%)",
                }}
              />

              {/* Corner: location (top-left) */}
              <div
                className="absolute top-4 left-4 font-mono"
                style={{
                  fontSize: 9,
                  color: "var(--text-3)",
                  letterSpacing: "0.1em",
                }}
              >
                BHAKTAPUR, NEPAL
              </div>

              {/* Corner: green availability indicator (top-right) */}
              <div
                className="absolute top-4 right-4 w-2 h-2 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.7)",
                  boxShadow: "0 0 6px rgba(34,197,94,0.4)",
                  animation: "pulse-dot 2.5s ease-in-out infinite",
                }}
              />

              {/* Name + subtitle (bottom-left) with small DT brand badge */}
              <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
                <div>
                  <p
                    className="font-display font-semibold"
                    style={{ fontSize: 20, color: "var(--text-1)" }}
                  >
                    Dipen Thapa
                  </p>
                  <p
                    className="font-mono mt-1"
                    style={{
                      fontSize: 11,
                      color: "var(--text-3)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Data Science · ML · Web
                  </p>
                </div>

                {/* Small DT brand detail — no longer the primary visual */}
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    width: 30,
                    height: 30,
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(79,70,229,0.12))",
                    border: "1px solid rgba(124,58,237,0.3)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span
                    className="font-display font-bold"
                    style={{ fontSize: 14, letterSpacing: "-0.02em" }}
                  >
                    <span style={{ color: "var(--text-1)" }}>D</span>
                    <span style={{ color: "var(--accent)" }}>T</span>
                  </span>
                </div>
              </div>

              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
