import CustomCursor from './components/CustomCursor'
import CursorTrail from './components/CursorTrail'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Expertise from './components/Expertise'
import Experience from './components/Experience'
import Projects from './components/Projects'
import BeyondInterface from './components/BeyondInterface'
import EducationCerts from './components/EducationCerts'
import Philosophy from './components/Philosophy'
import Contact from './components/Contact'
import Footer from './components/Footer'
import IntroLoader from './components/IntroLoader'
import NotFound from './components/NotFound'
import SectionBridge from './components/SectionBridge'

export default function App() {
  if (window.location.pathname !== '/') return <NotFound />

  return (
    <div
      className="min-h-screen noise"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-1)' }}
    >
      <IntroLoader />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      {/* Custom cursor — hidden on touch devices via CSS */}
      <CursorTrail />
      <CustomCursor />

      {/* Navigation */}
      <Navbar />

      <main id="main-content">
        {/* 1. Hero — first viewport, editorial hero + InfraCore visual */}
        <Hero />

        {/* 2. About — 01 / who is Dipen */}
        <About />

        {/* 3. Expertise — 02 / skills + tech stack */}
        <Expertise />

        {/* Divider */}
        <div
          className="max-w-[1280px] mx-auto px-6"
          aria-hidden
        >
          <div style={{ height: 1, background: 'var(--border)' }} />
        </div>

        {/* 4. Experience — 03 / timeline */}
        <Experience />

        {/* Philosophy breathing moment */}
        <Philosophy />

        {/* 5. Projects — 04 / selected work */}
        <Projects />

        <SectionBridge />

        {/* Divider */}
        <div
          className="max-w-[1280px] mx-auto px-6"
          aria-hidden
        >
          <div style={{ height: 1, background: 'var(--border)' }} />
        </div>

        {/* 6. Cloud/networking signature section */}
        <BeyondInterface />

        {/* Divider */}
        <div
          className="max-w-[1280px] mx-auto px-6"
          aria-hidden
        >
          <div style={{ height: 1, background: 'var(--border)' }} />
        </div>

        {/* 7. Education + Certifications */}
        <EducationCerts />

        {/* 8. Contact — final CTA */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
