This is the final comprehensive pass to bring this portfolio to genuine global-award quality (Awwwards Site of the Day / CSSDA tier). Fix everything below.

═══════════════════════════════
1. FIX THE BROKEN PIPELINE SECTION (CRITICAL — DO THIS FIRST)
═══════════════════════════════
The "Raw Data → Pipeline → Analysis & ML → Visualization → Deployment" section currently renders broken — only "Deployment" shows, with a long empty vertical line above it and the other 4 stages missing.
- Debug and fix so all 5 stages render correctly in sequence with icon/label each.
- Rebuild as a scroll-driven pinned sequence: animate a line/particle tracing stage to stage, each stage lighting up (color/glow) and briefly revealing a one-line detail as it activates.
- Reduce empty vertical space in this section by 60-70%.
- Confirm this plays correctly on actual scroll, not just as static positioned elements.

═══════════════════════════════
2. ONE REAL SIGNATURE INTERACTION
═══════════════════════════════
Add ONE genuinely novel interactive/visual element beyond the pipeline fix:
- A WebGL/Three.js hero element (orbiting nodes in real 3D depth, reacting to cursor position), OR
- A custom canvas cursor-trail/particle effect responding to mouse movement site-wide, OR
- A generative background (animated gradient mesh, particle field, or noise texture) reacting subtly to scroll.
Commit fully — half-implemented is worse than not attempting it.

═══════════════════════════════
3. FINISH HEADLINE VARIATION (ONLY 2 OF 8+ DONE SO FAR)
═══════════════════════════════
Apply the same variation used on "Technologies I build with" and "Applied in practice" to the rest:
- "Engineering ideas / into experiences"
- "Projects that / define my work"
- "Academic / foundation" and "Verified / credentials"
- "Let's build / something"
Vary scale, line breaks, and color treatment so no two headlines share the identical stacked-line formula. At least half should NOT use the two-line stack pattern.

═══════════════════════════════
4. SITEWIDE SCROLL CHOREOGRAPHY
═══════════════════════════════
Beyond the pipeline and stats counter, apply consistent scroll-triggered entrance animation across ALL sections:
- Staggered word or character reveals on headlines as they enter view.
- Images/cards revealing via clip-path wipe or scale-in rather than plain fade.
- Consistent custom easing (cubic-bezier) and duration scale across the whole page so it reads as one choreographed experience.

═══════════════════════════════
5. TECH STACK VISUAL HIERARCHY
═══════════════════════════════
Differentiate your strongest skills (Python, React, Pandas) from the rest of the grid — larger card, subtle glow, or a "core stack" vs "also familiar with" grouping — instead of every icon card being visually identical.

═══════════════════════════════
6. CONFIRM AND BUILD THE MICRO-INTERACTION LAYER
═══════════════════════════════
- Custom cursor: distinct hover states for links (underline/scale), buttons (magnetic pull), project cards (follows cursor with "View Project" label).
- Stats counter: numbers animate counting up from 0 on scroll into view.
- Contact form: floating labels animating up on focus, purple glow on input border on focus.
- Buttons: hover scale/glow with consistent ~200-300ms easing.
- Navbar: active-section indicator that updates as you scroll, plus smooth scroll-to-section on click.

═══════════════════════════════
7. ELIMINATE DEAD SPACE
═══════════════════════════════
- Reduce/fill the empty gap between Projects and the Deployment/pipeline section with connective texture (gradient bleed, dot-grid, floating accent).
- Same check around the "I don't just write code..." pull-quote section.
- Double-check the footer/final CTA section isn't clipping text ("Let's build something") at the bottom edge — confirm the full phrase is fully visible and not cut off.

═══════════════════════════════
8. DEEPEN PROJECT CASE STUDIES
═══════════════════════════════
For each project, add a short "process" note (key decision/challenge, 1-2 sentences) alongside outcome stats. Enlarge preview imagery inside the browser-chrome mockups with hover-to-zoom or click-to-expand. Add a 3rd project if feasible so the section doesn't feel thin.

═══════════════════════════════
9. CREDENTIALS CLEANUP
═══════════════════════════════
Remove or demote "Python (Basic)" and "Time Management" from the main credentials row — keep only the BIT degree and strongest technical certification at full visual weight.

═══════════════════════════════
10. CRAFT-LEVEL POLISH
═══════════════════════════════
- Brief tasteful page-load/intro animation (logo/initials reveal, 1-2 seconds, skippable).
- Fix the empty dark placeholder next to the Nepal Air Quality stats card with an actual chart/dashboard graphic.
- Increase contrast on all low-contrast gray body text against black (Hero bio line especially).
- Add a custom favicon and Open Graph image/meta tags for social link previews.
- Add a simple custom 404 page matching the site's visual identity, rather than a default error page.

═══════════════════════════════
11. PERFORMANCE & ACCESSIBILITY BASELINE (NON-NEGOTIABLE FOR AWARDS)
═══════════════════════════════
- All animations use transform/opacity only — no layout-shifting properties — sustaining 60fps.
- Respect prefers-reduced-motion with graceful static fallback for every animated element.
- Full responsive pass: cursor-dependent interactions need sensible touch/mobile equivalents.
- Verify WCAG AA color contrast across all text.

═══════════════════════════════
Keep the existing purple-on-black brand identity, content, and overall structure. After this pass, the site should have zero broken sections, no repeated headline templates, a confirmed-working interaction layer, and one genuine signature moment.