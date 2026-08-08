import { type FormEvent, useState } from "react"
import { useInView } from "../hooks/useInView"
import WordReveal from "./WordReveal"

const FORMSPREE_ENDPOINT = "https://formspree.io/f/meeybzpo"

type SubmitStatus = "idle" | "sending" | "sent" | "error"

export default function Contact() {
  const { ref, inView } = useInView(0.1)
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  })
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Bots commonly fill every input they find. Formspree also recognizes the
    // `_gotcha` field server-side, while real visitors never interact with it.
    if (form.website) {
      setForm({ name: "", email: "", message: "", website: "" })
      setSubmitStatus("sent")
      return
    }

    setSubmitStatus("sending")
    setSubmitError("")

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _gotcha: form.website,
          _subject: `Portfolio contact from ${form.name}`,
        }),
      })

      if (!response.ok) {
        setSubmitStatus("error")
        setSubmitError(
          response.status === 429
            ? "Too many messages were sent recently. Please wait a moment and try again."
            : "Your message could not be sent. Please try again or email me directly.",
        )
        return
      }

      setForm({ name: "", email: "", message: "", website: "" })
      setSubmitStatus("sent")
    } catch {
      setSubmitStatus("error")
      setSubmitError(
        "Your message could not be sent. Check your connection and try again.",
      )
    }
  }

  return (
    <section
      id="contact"
      className="relative py-28 lg:py-36 overflow-hidden"
      ref={ref}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(124,58,237,0.08) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Big CTA */}
          <div className="flex flex-col gap-8">
            <div className={`reveal ${inView ? "visible" : ""}`}>
              <p
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-3)",
                  letterSpacing: "0.2em",
                }}
              >
                HAVE AN IDEA, OPPORTUNITY, OR PROJECT?
              </p>
            </div>

            <WordReveal
              inView={inView}
              className="font-display font-bold leading-[1.0] tracking-tight"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 6rem)",
                color: "var(--text-1)",
              }}
              label="Let's build something great."
              words={[
                { text: "Let's" },
                { text: "build", breakAfter: true },
                {
                  text: "something",
                  className: "gradient-text",
                  breakAfter: true,
                },
                {
                  text: "great.",
                  style: {
                    WebkitTextStroke: "1px rgba(124,58,237,0.5)",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  },
                },
              ]}
            />

            <div className={`reveal ${inView ? "visible" : ""} reveal-delay-2`}>
              <a
                href="mailto:tretime865@gmail.com"
                className="group inline-flex items-center gap-3 text-base font-medium transition-all duration-200"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#a78bfa",
                  padding: "12px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#c4b5fd"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#a78bfa"
                }}
              >
                Let&apos;s talk
                <svg
                  className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M3 15L15 3M15 3H7M15 3V11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* Contact options */}
            <div
              className={`flex flex-col gap-4 reveal ${
                inView ? "visible" : ""
              } reveal-delay-3`}
            >
              {[
                {
                  label: "Email",
                  value: "tretime865@gmail.com",
                  href: "mailto:tretime865@gmail.com",
                },
                {
                  label: "LinkedIn",
                  value: "linkedin.com/in/dipen-thapa-34073432b",
                  href: "https://www.linkedin.com/in/dipen-thapa-34073432b/",
                },
                {
                  label: "GitHub",
                  value: "github.com/dipenthapa7",
                  href: "https://github.com/dipenthapa7",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    paddingBottom: 14,
                  }}
                >
                  <span
                    className="font-mono w-20 flex-shrink-0"
                    style={{
                      fontSize: 10,
                      color: "var(--text-3)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </span>
                  <a
                    href={item.href}
                    target={item.label !== "Email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group/cl flex items-center gap-2 transition-colors duration-200"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      color: "var(--text-2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--text-1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-2)"
                    }}
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact form */}
          <div className={`reveal ${inView ? "visible" : ""} reveal-delay-2`}>
            {submitStatus === "sent" ? (
              <div
                className="flex flex-col items-center justify-center gap-4 p-12 rounded-3xl text-center"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  minHeight: 320,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M4 11L9 16L18 6"
                      stroke="#a78bfa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  className="font-display font-semibold"
                  style={{ fontSize: 18, color: "var(--text-1)" }}
                >
                  Message sent
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: "var(--text-2)",
                  }}
                >
                  Thanks for reaching out. Your message was delivered
                  successfully.
                </p>
              </div>
            ) : (
              <form
                action={FORMSPREE_ENDPOINT}
                method="POST"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 p-8 rounded-3xl"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="font-display font-semibold"
                  style={{
                    fontSize: 16,
                    color: "var(--text-1)",
                    marginBottom: 4,
                  }}
                >
                  Send a message
                </p>

                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clipPath: "inset(50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <label htmlFor="contact-website">
                    Leave this field empty
                  </label>
                  <input
                    id="contact-website"
                    name="_gotcha"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        website: e.target.value,
                      }))
                    }
                  />
                </div>

                {[
                  {
                    key: "name",
                    label: "Name",
                    type: "text",
                    placeholder: "Your name",
                    maxLength: 100,
                  },
                  {
                    key: "email",
                    label: "Email",
                    type: "email",
                    placeholder: "your@email.com",
                    maxLength: 254,
                  },
                ].map((field) => (
                  <div
                    key={field.key}
                    className="contact-field"
                    data-filled={Boolean(form[(field.key as "name" | "email")])}
                  >
                    <label
                      htmlFor={`contact-${field.key}`}
                      className="contact-floating-label"
                    >
                      {field.label.toUpperCase()}
                    </label>
                    <input
                      id={`contact-${field.key}`}
                      name={field.key}
                      type={field.type}
                      required
                      maxLength={field.maxLength}
                      placeholder=" "
                      aria-description={field.placeholder}
                      value={form[(field.key as "name" | "email")]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      className="contact-control w-full px-4 py-3 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        color: "var(--text-1)",
                        fontFamily: "Inter, sans-serif",
                        outline: "none",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(124,58,237,0.4)"
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(124,58,237,0.08)"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border)"
                        e.target.style.boxShadow = "none"
                      }}
                    />
                  </div>
                ))}

                <div
                  className="contact-field"
                  data-filled={Boolean(form.message)}
                >
                  <label
                    htmlFor="contact-message"
                    className="contact-floating-label"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={3000}
                    rows={5}
                    placeholder=" "
                    aria-description="Tell me about your project or opportunity"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="contact-control w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 resize-none"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border)",
                      color: "var(--text-1)",
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(124,58,237,0.4)"
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(124,58,237,0.08)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border)"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                </div>

                {submitStatus === "error" && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: "#fca5a5",
                    }}
                  >
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitStatus === "sending"}
                  aria-busy={submitStatus === "sending"}
                  className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-200"
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    fontFamily: "Inter, sans-serif",
                    opacity: submitStatus === "sending" ? 0.7 : 1,
                    cursor: submitStatus === "sending" ? "wait" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(124,58,237,0.4)"
                    e.currentTarget.style.transform = "translateY(-1px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  {submitStatus === "sending" ? "Sending..." : "Send message"}
                  <svg
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M2 12L12 2M12 2H6M12 2V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
