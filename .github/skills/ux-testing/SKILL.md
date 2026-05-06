---
name: ux-testing
description: "Comprehensive UX testing with Playwright. Use when: running visual audits, testing responsive breakpoints, measuring mobile condensing, auditing touch targets, testing performance/CWV, running axe-core accessibility, checking content density, testing orientation variants, visual regression diffing, clicking through navigation flows, testing modals, verifying scroll animations, capturing screenshots for evidence."
---

# UX Testing with Playwright

Comprehensive browser automation for visual audits, mobile optimization diagnostics, performance measurement, accessibility verification, and visual regression testing on the AI Bizlutions static site.

## Prerequisites

1. **Local server must be running** — load the `local-server` skill or start manually:
   ```
   npx serve . -l 3000
   ```
2. **Playwright CLI installed globally** (one-time setup):
   ```
   npm install -g @playwright/cli@latest
   playwright-cli install --skills
   ```
3. **Base URL**: `http://localhost:3000`

## Quick Start

For a full UX audit, run these phases in order:

1. Start local server
2. Run [Breakpoint Visual Audit](./references/test-breakpoints.md)
3. Run [Scroll Depth Audit](./references/test-scroll-depth.md)
4. Run [Computed Style Audit](./references/test-computed-styles.md) ← diagnoses mobile bloat
5. Run [Content Density Audit](./references/test-content-density.md) ← identifies condensing opportunities
6. Run [Touch Target Audit](./references/test-touch-targets.md) ← validates tap target sizes
7. Run [Orientation & Viewport Variants](./references/test-orientation.md) ← landscape + edge viewports
8. Run [Interaction & Click Flow Tests](./references/test-interactions.md)
9. Run [Accessibility Audit](./references/test-accessibility.md) (manual checks)
10. Run [axe-core Accessibility Audit](./references/test-axe-core.md) (automated WCAG scan)
11. Run [Lighthouse & Core Web Vitals](./references/test-lighthouse-cwv.md) ← performance metrics
12. Run [Visual Regression Test](./references/test-visual-regression.md) ← catches unintended changes
13. Compile findings with screenshot evidence

### Audit Profiles

Not every audit needs all phases. Use these profiles:

| Profile | When to Use | Phases |
|---------|-------------|--------|
| **Quick Check** | After small CSS fix | 2, 3, 12 |
| **Mobile Focus** | Mobile condensing work | 2, 3, 4, 5, 6, 7 |
| **Full Audit** | Before release / major changes | All phases |
| **Accessibility** | A11y review | 9, 10 |
| **Performance** | Speed optimization | 11 |

## Phase 1: Open the Site

```bash
playwright-cli open http://localhost:3000 --headed
```

Take an initial full-page screenshot for baseline:
```bash
playwright-cli screenshot --filename=baseline-desktop.png
```

## Phase 2: Breakpoint Visual Audit

Resize and screenshot at each breakpoint. See [test-breakpoints.md](./references/test-breakpoints.md) for the full procedure.

**Quick summary:**
```bash
# Desktop (xl)
playwright-cli resize 1280 900
playwright-cli screenshot --filename=breakpoint-desktop-1280.png

# Tablet (md)
playwright-cli resize 768 1024
playwright-cli screenshot --filename=breakpoint-tablet-768.png

# Mobile (sm)
playwright-cli resize 375 812
playwright-cli screenshot --filename=breakpoint-mobile-375.png
```

At each breakpoint, verify:
- Hero CTA visible without scroll
- Service cards stack properly
- Navigation adapts (hamburger on mobile)
- No horizontal overflow
- Text remains readable

## Phase 3: Scroll Depth Audit

Measure scroll depth and identify scroll-hog sections. See [test-scroll-depth.md](./references/test-scroll-depth.md) for the full procedure.

**Quick summary:**
```bash
# Measure total page height at each breakpoint
playwright-cli eval "JSON.stringify({ pageHeight: document.documentElement.scrollHeight, viewportHeight: window.innerHeight, viewportsToScroll: (document.documentElement.scrollHeight / window.innerHeight).toFixed(1) })"

# Measure per-section heights (sorted by tallest)
playwright-cli eval "Array.from(document.querySelectorAll('section, header, footer')).map(s => { const r = s.getBoundingClientRect(); return { id: s.id || s.tagName.toLowerCase(), height: Math.round(r.height), pct: Math.round(r.height / document.documentElement.scrollHeight * 100) }; }).sort((a,b) => b.height - a.height).map(s => s.id + ': ' + s.height + 'px (' + s.pct + '%)').join('\\n')"
```

Targets: Desktop ≤ 4 viewports, Tablet ≤ 5, Mobile ≤ 6.

## Phase 4: Computed Style Audit (Mobile Condensing Diagnostics)

Extract actual CSS computed values to diagnose WHY sections are too tall. See [test-computed-styles.md](./references/test-computed-styles.md) for the full procedure.

**Quick summary:**
```bash
# Section padding at mobile
playwright-cli resize 375 812
playwright-cli eval "Array.from(document.querySelectorAll('section')).map(s => { const cs = getComputedStyle(s); return (s.id || s.tagName) + ': pad=' + cs.paddingTop + '/' + cs.paddingBottom + ' total=' + (parseInt(cs.paddingTop) + parseInt(cs.paddingBottom)) + 'px'; }).join('\n')"

# Font sizes that should have shrunk
playwright-cli eval "Array.from(document.querySelectorAll('h2,h3,h4')).map(el => { const cs = getComputedStyle(el); return el.tagName + ': ' + cs.fontSize + ' / line-height: ' + cs.lineHeight; }).join('\n')"

# Horizontal overflow detection
playwright-cli eval "Array.from(document.querySelectorAll('*')).filter(el => el.scrollWidth > document.documentElement.clientWidth).map(el => el.tagName + '.' + el.className.split(' ')[0] + ': ' + el.scrollWidth + 'px').join('\n')"
```

Key diagnostics: padding bloat, typography scale, gap/margin excess, media query effectiveness.

## Phase 5: Content Density Audit

Measure content volume and identify sections that need progressive disclosure. See [test-content-density.md](./references/test-content-density.md) for the full procedure.

**Quick summary:**
```bash
# Section viewport consumption
playwright-cli resize 375 812
playwright-cli eval "(() => { const vh = window.innerHeight; return Array.from(document.querySelectorAll('section')).map(s => { const vps = (s.getBoundingClientRect().height / vh).toFixed(1); return (parseFloat(vps) <= 1.5 ? '✓' : '✗') + ' ' + (s.id || s.tagName) + ': ' + vps + ' viewports'; }).join('\n'); })()"
```

Targets: No section > 1.5 viewports on mobile. Identifies accordion/truncation/carousel opportunities.

## Phase 6: Touch Target Audit

Verify all interactive elements meet 44×44px minimum tap target size. See [test-touch-targets.md](./references/test-touch-targets.md) for the full procedure.

**Quick summary:**
```bash
playwright-cli resize 375 812
playwright-cli eval "(() => { const els = Array.from(document.querySelectorAll('a, button, input, select, textarea')); let fail = 0; els.forEach(el => { const r = el.getBoundingClientRect(); if (r.width > 0 && (r.width < 44 || r.height < 44)) fail++; }); return fail + ' elements below 44×44px target (of ' + els.length + ' total)'; })()"
```

Tests: nav links, CTA buttons, form inputs, social icons, element spacing/crowding.

## Phase 7: Orientation & Viewport Variants

Test at commonly-missed viewports. See [test-orientation.md](./references/test-orientation.md) for the full procedure.

**Quick summary:**
```bash
# Landscape mobile (most missed)
playwright-cli resize 667 375
playwright-cli screenshot --filename=orientation-landscape-667.png

# Narrow phone (Galaxy Fold folded)
playwright-cli resize 280 653
playwright-cli screenshot --filename=orientation-narrow-280.png

# Tablet landscape
playwright-cli resize 1024 768
playwright-cli screenshot --filename=orientation-tablet-landscape.png
```

Key checks: hero CTA visible in landscape, no overflow at 280px, nav mode at 1024px.

## Phase 8: Interaction & Click Flow Tests

Test every interactive element. See [test-interactions.md](./references/test-interactions.md) for the full procedure.

**Quick summary:**
- Click each nav link → verify smooth scroll to correct section
- Open/close hamburger menu on mobile
- Open each modal (Story, Chase, Courd) → verify close via X button, backdrop click, Escape key
- Test contact form tab order and validation
- Verify all anchor links work

## Phase 9: Manual Accessibility Audit

Capture and analyze the accessibility tree. See [test-accessibility.md](./references/test-accessibility.md) for the full procedure.

**Quick summary:**
```bash
playwright-cli snapshot
```

Verify:
- Heading hierarchy: h1 (logo) → h2 (hero) → h3 (sections) → h4 (cards) → h5 (sub-items)
- All images have alt text
- Interactive elements are focusable and labeled
- Modal focus trap works
- Keyboard navigation through all interactive elements

## Phase 10: Automated Accessibility (axe-core)

Inject axe-core for automated WCAG 2.1 AA testing. See [test-axe-core.md](./references/test-axe-core.md) for the full procedure.

**Quick summary:**
```bash
playwright-cli eval "await (async () => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); const results = await axe.run(); return 'Violations: ' + results.violations.length + ' | Passes: ' + results.passes.length + '\n' + results.violations.map(v => '❌ ' + v.id + ' [' + v.impact + ']: ' + v.nodes.length + ' instances').join('\n'); })()"
```

Covers: color contrast, ARIA misuse, form labeling, landmark regions, focus management.

## Phase 11: Lighthouse & Core Web Vitals

Measure performance metrics. See [test-lighthouse-cwv.md](./references/test-lighthouse-cwv.md) for the full procedure.

**Quick summary:**
```bash
npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-mobile.json --emulated-form-factor=mobile --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility --quiet
```

Key metrics: LCP (≤ 2.5s), CLS (≤ 0.1), INP/TBT (≤ 200ms). Also catches image optimization issues and layout shift sources.

## Phase 12: Visual Regression Testing

Compare screenshots against baselines to catch unintended changes. See [test-visual-regression.md](./references/test-visual-regression.md) for the full procedure.

**Quick summary:**
```bash
# Capture current state
playwright-cli resize 375 812
playwright-cli eval "document.getElementById('services')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-current/mobile-375/services.png

# Compare against ux-baselines/ directory using pixelmatch or visual inspection
```

Use after any CSS/HTML modification to verify no regressions were introduced.

## Phase 13: Compile Findings

After all phases, produce the audit report using the UX-Tester agent's output format:
- Reference screenshots by filename for every P0/P1/P2 finding
- Note the exact breakpoint where each issue was observed
- Include the accessibility snapshot excerpt for any a11y violations
- Include computed style measurements for mobile condensing issues
- Include touch target dimensions for undersized elements
- Include CWV metrics for performance findings

## Screenshot Naming Convention

| Screenshot | Filename |
|-----------|----------|
| Desktop baseline | `baseline-desktop.png` |
| Desktop breakpoint | `breakpoint-desktop-1280.png` |
| Tablet breakpoint | `breakpoint-tablet-768.png` |
| Mobile breakpoint | `breakpoint-mobile-375.png` |
| Mobile hamburger open | `mobile-menu-open.png` |
| Mobile hamburger closed | `mobile-menu-closed.png` |
| Modal open (any) | `modal-{name}-open.png` |
| Modal closed (any) | `modal-{name}-closed.png` |
| Scroll animation before | `scroll-anim-before.png` |
| Scroll animation after | `scroll-anim-after.png` |
| Issue evidence | `issue-{number}-{breakpoint}.png` |
| Orientation landscape | `orientation-mobile-landscape-667.png` |
| Orientation narrow | `orientation-narrow-280.png` |
| Orientation tablet landscape | `orientation-tablet-landscape-1024.png` |
| Scroll hog evidence | `scroll-hog-{section}-mobile.png` |
| Visual regression baseline | `ux-baselines/{breakpoint}/{section}.png` |
| Visual regression current | `ux-current/{breakpoint}/{section}.png` |
| Visual regression diff | `ux-diffs/{breakpoint}-{section}-diff.png` |

Screenshots are saved to the current working directory by default. Use `--filename` to control naming.

## Severity Scale (Unified)

All reference files use this consistent severity scale:

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **P0** | Critical — site broken or inaccessible | Fix immediately, blocks release |
| **P1** | Major — significant UX degradation | Fix before release |
| **P2** | Moderate — noticeable but workaroundable | Fix in current sprint |
| **P3** | Minor — polish/optimization | Fix when convenient |

## Cleanup

After testing:
```bash
playwright-cli close
```
Stop the local server (Ctrl+C in the terminal running `npx serve`).

Clean up temporary files:
```bash
rm -f lighthouse-mobile.json lighthouse-desktop.json
rm -rf ux-current ux-diffs
```

Keep `ux-baselines/` tracked in git as the team reference.
