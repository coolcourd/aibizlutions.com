---
name: ux-testing
description: "Real browser UX testing with Playwright. Use when: running visual audits, testing responsive breakpoints, clicking through navigation flows, testing modals, verifying scroll animations, capturing screenshots for evidence, checking accessibility tree, auditing touch targets on mobile viewports."
---

# UX Testing with Playwright

Real browser automation for visual audits, click-flow testing, and accessibility verification on the AI Bizlutions static site.

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
4. Run [Interaction & Click Flow Tests](./references/test-interactions.md)
5. Run [Accessibility Audit](./references/test-accessibility.md)
6. Compile findings with screenshot evidence

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

## Phase 4: Interaction & Click Flow Tests

Test every interactive element. See [test-interactions.md](./references/test-interactions.md) for the full procedure.

**Quick summary:**
- Click each nav link → verify smooth scroll to correct section
- Open/close hamburger menu on mobile
- Open each modal (Story, Chase, Courd) → verify close via X button, backdrop click, Escape key
- Test contact form tab order and validation
- Verify all anchor links work

## Phase 5: Accessibility Audit

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

## Phase 6: Compile Findings

After all phases, produce the audit report using the UX-Tester agent's output format:
- Reference screenshots by filename for every P0/P1/P2 finding
- Note the exact breakpoint where each issue was observed
- Include the accessibility snapshot excerpt for any a11y violations

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

Screenshots are saved to the current working directory by default. Use `--filename` to control naming.

## Cleanup

After testing:
```bash
playwright-cli close
```
Stop the local server (Ctrl+C in the terminal running `npx serve`).
