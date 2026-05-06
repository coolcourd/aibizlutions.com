# Orientation & Viewport Variant Testing

Step-by-step procedure for testing the site at non-standard viewports that most audits miss: landscape mobile, small desktop, ultra-wide, and tall/narrow phones.

## Why This Matters

Most audits only test portrait 375×812 and desktop 1280×900. But real users:
- Rotate their phones to landscape (especially when reading)
- Use small laptops (1024×600 Chromebooks)
- Have ultra-wide monitors (2560px+)
- Use tall/narrow phones (Samsung Galaxy Fold: 280px width folded)

These edge viewports expose layout assumptions that break silently.

## Standard Test Viewports

| Device | Width | Height | Orientation | Priority |
|--------|-------|--------|-------------|----------|
| iPhone SE landscape | 667 | 375 | Landscape | **High** |
| iPhone 14 Pro landscape | 844 | 390 | Landscape | **High** |
| Galaxy Fold (folded) | 280 | 653 | Portrait | **Medium** |
| Chromebook | 1024 | 600 | Landscape | **Medium** |
| iPad landscape | 1024 | 768 | Landscape | **Medium** |
| Ultra-wide desktop | 2560 | 1080 | Landscape | **Low** |
| Short desktop | 1280 | 600 | Landscape | **Low** |

## Step 1: Landscape Mobile Testing

The most commonly missed viewport. Hero sections and nav often break here:

```bash
# iPhone landscape (most common)
playwright-cli resize 667 375
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=orientation-mobile-landscape-667.png

# Check hero — is CTA visible without scrolling?
playwright-cli eval "(() => { const cta = document.querySelector('#hero .btn-primary, #hero a[href=\"#contact\"]'); if (!cta) return 'CTA not found'; const r = cta.getBoundingClientRect(); const vh = window.innerHeight; return 'CTA bottom: ' + Math.round(r.bottom) + 'px / viewport: ' + vh + 'px — ' + (r.bottom <= vh ? '✓ Visible' : '✗ Below fold (' + Math.round(r.bottom - vh) + 'px below)'); })()"

# Check for vertical overflow (content taller than viewport with no scroll affordance)
playwright-cli eval "(() => { const hero = document.getElementById('hero') || document.querySelector('header'); if (!hero) return 'hero not found'; const r = hero.getBoundingClientRect(); const vh = window.innerHeight; return 'Hero height: ' + Math.round(r.height) + 'px / viewport: ' + vh + 'px — ' + (r.height > vh ? '⚠ Hero exceeds viewport by ' + Math.round(r.height - vh) + 'px' : '✓ Fits in viewport'); })()"

# Check nav — is it usable in landscape?
playwright-cli snapshot "nav"
playwright-cli screenshot --filename=orientation-landscape-nav.png
```

### Landscape-Specific Issues to Check:
- [ ] Hero CTA visible without scrolling (critical — landscape viewport is VERY short)
- [ ] Navigation doesn't overlap content
- [ ] Fixed/sticky header doesn't consume > 15% of viewport height
- [ ] Text is still readable (not cramped)
- [ ] Images don't dominate the short viewport

## Step 2: Narrow/Folded Phone Testing

Test at extremely narrow widths (Galaxy Fold folded = 280px):

```bash
playwright-cli resize 280 653
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=orientation-narrow-280.png

# Check for text overflow
playwright-cli eval "(() => { const vw = document.documentElement.clientWidth; const issues = []; document.querySelectorAll('h2, h3, h4, .btn-primary, .btn-secondary').forEach(el => { const r = el.getBoundingClientRect(); if (r.width > vw) { issues.push(el.tagName + ' \"' + el.textContent.trim().substring(0, 25) + '\": ' + Math.round(r.width) + 'px > ' + vw + 'px viewport'); } }); return issues.length ? '✗ OVERFLOW:\n' + issues.join('\n') : '✓ All elements fit at 280px'; })()"

# Check button text wrapping
playwright-cli eval "Array.from(document.querySelectorAll('.btn-primary, .btn-secondary, button[type=submit]')).map(btn => { const r = btn.getBoundingClientRect(); const lines = Math.round(r.height / parseInt(getComputedStyle(btn).lineHeight)); return btn.textContent.trim().substring(0, 25) + ': height=' + Math.round(r.height) + 'px (' + lines + ' line' + (lines > 1 ? 's' : '') + ')'; }).join('\n')"
```

### Narrow Viewport Issues:
- [ ] No horizontal scrollbar
- [ ] Button text doesn't wrap awkwardly (1 or 2 lines max)
- [ ] Headings wrap gracefully (word-break working)
- [ ] Form inputs still usable (not clipped)
- [ ] Logo fits without overflowing

## Step 3: Tablet Landscape Testing

iPad landscape (1024×768) often falls in an awkward responsive gap:

```bash
playwright-cli resize 1024 768
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=orientation-tablet-landscape-1024.png

# Check if layout is desktop or mobile mode
playwright-cli eval "(() => { const nav = document.getElementById('nav-menu'); const hamburger = document.getElementById('mobile-menu'); const navDisplay = getComputedStyle(nav).display; const hamDisplay = getComputedStyle(hamburger).display; return 'Nav: display=' + navDisplay + ' | Hamburger: display=' + hamDisplay + ' — Mode: ' + (hamDisplay === 'none' ? 'DESKTOP' : 'MOBILE'); })()"

# Check grid layouts — are they using the space well?
playwright-cli eval "Array.from(document.querySelectorAll('.services-grid, .process-steps')).map(grid => { const cs = getComputedStyle(grid); return grid.className.split(' ')[0] + ': display=' + cs.display + ' grid-template-columns=' + cs.gridTemplateColumns + ' width=' + Math.round(grid.getBoundingClientRect().width) + 'px'; }).join('\n')"
```

### Tablet Landscape Issues:
- [ ] Uses desktop layout (not hamburger menu) — 1024px should show full nav
- [ ] Grid shows 2–3 columns (not single-column stacking)
- [ ] Content doesn't look stretched or float in too much whitespace
- [ ] Images properly sized for this viewport

## Step 4: Short Desktop Testing

Users with browser dev tools open, or small laptop screens:

```bash
playwright-cli resize 1280 600
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=orientation-short-desktop-1280x600.png

# Check sticky header ratio
playwright-cli eval "(() => { const header = document.querySelector('header, nav, .navbar'); if (!header) return 'header not found'; const r = header.getBoundingClientRect(); const vh = window.innerHeight; const pct = ((r.height / vh) * 100).toFixed(0); return 'Header: ' + Math.round(r.height) + 'px / viewport: ' + vh + 'px = ' + pct + '% — ' + (pct > 15 ? '⚠ Header too tall for short viewport' : '✓ OK'); })()"

# Check hero CTA visibility
playwright-cli eval "(() => { const cta = document.querySelector('#hero .btn-primary, #hero a[href=\"#contact\"]'); if (!cta) return 'CTA not found'; const r = cta.getBoundingClientRect(); const vh = window.innerHeight; return 'CTA visible: ' + (r.bottom <= vh ? '✓ Yes' : '✗ No — ' + Math.round(r.bottom - vh) + 'px below fold'); })()"
```

## Step 5: Ultra-Wide Desktop Testing

Content that's too wide becomes hard to read:

```bash
playwright-cli resize 2560 1080
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=orientation-ultrawide-2560.png

# Check container max-width is working
playwright-cli eval "(() => { const container = document.querySelector('.container'); if (!container) return 'container not found'; const r = container.getBoundingClientRect(); return 'Container width: ' + Math.round(r.width) + 'px / viewport: ' + window.innerWidth + 'px — ' + (r.width <= 1200 ? '✓ Max-width active' : '⚠ Container stretching to ' + Math.round(r.width) + 'px'); })()"

# Check text line length (optimal: 50-75 chars per line)
playwright-cli eval "(() => { const p = document.querySelector('#hero p, .hero-subtitle'); if (!p) return 'text not found'; const r = p.getBoundingClientRect(); const fontSize = parseInt(getComputedStyle(p).fontSize); const charsPerLine = Math.round(r.width / (fontSize * 0.5)); return 'Line length: ~' + charsPerLine + ' chars/line — ' + (charsPerLine <= 75 ? '✓ OK' : '⚠ Too wide (' + charsPerLine + ' chars) — hard to read'); })()"
```

## Output Template

```
### Orientation & Viewport Variant Audit

#### Test Results
| Viewport | Size | Key Finding | Status |
|----------|------|-------------|--------|
| Mobile landscape | 667×375 | (finding) | ✅/❌ |
| Narrow phone (Fold) | 280×653 | (finding) | ✅/❌ |
| Tablet landscape | 1024×768 | (finding) | ✅/❌ |
| Short desktop | 1280×600 | (finding) | ✅/❌ |
| Ultra-wide | 2560×1080 | (finding) | ✅/❌ |

#### Landscape Mobile Findings
- Hero CTA visible without scroll: ✅/❌
- Nav header height vs viewport: __px / __px = __%
- Hero fits in viewport: ✅/❌ (overflow: __px)

#### Narrow Viewport Findings
- Horizontal overflow: ✅ None / ❌ (elements listed)
- Button text wrapping: ✅/❌
- Headings fitting: ✅/❌

#### Evidence Screenshots
- orientation-mobile-landscape-667.png
- orientation-narrow-280.png
- orientation-tablet-landscape-1024.png
- orientation-short-desktop-1280x600.png
- orientation-ultrawide-2560.png
```

## Severity Classification

| Condition | Severity |
|----------|----------|
| Hero CTA invisible on landscape mobile | **P1** — Lost conversions |
| Horizontal overflow at any viewport | **P1** — Broken layout |
| Nav unusable at any tested viewport | **P1** — Navigation failure |
| Header consuming > 20% of short viewport | **P2** — Cramped content |
| Content stretching beyond max-width on ultra-wide | **P2** — Readability issue |
| Awkward text wrapping on narrow viewport | **P3** — Polish issue |
| Line length > 75 chars on ultra-wide | **P3** — Readability preference |
