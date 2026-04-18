# Scroll Depth Audit

Step-by-step Playwright procedure for measuring scroll depth per section and identifying scroll hogs.

## Scroll Depth Targets

| Breakpoint | Max Viewports to Scroll | Rationale |
|-----------|------------------------|-----------|
| Desktop (1280×900) | ≤ 4 viewports | Users expect compact, scannable layout |
| Tablet (768×1024) | ≤ 5 viewports | Stacking acceptable but must stay tight |
| Mobile (375×812) | ≤ 6 viewports | Single-column stacking, but padding must crunch |

**Formula**: `viewports_to_scroll = page_height / viewport_height`

## Step 1: Measure Total Page Height

Run at each breakpoint:

```bash
# Desktop
playwright-cli resize 1280 900
playwright-cli eval "JSON.stringify({ pageHeight: document.documentElement.scrollHeight, viewportHeight: window.innerHeight, viewportsToScroll: (document.documentElement.scrollHeight / window.innerHeight).toFixed(1) })"

# Tablet
playwright-cli resize 768 1024
playwright-cli eval "JSON.stringify({ pageHeight: document.documentElement.scrollHeight, viewportHeight: window.innerHeight, viewportsToScroll: (document.documentElement.scrollHeight / window.innerHeight).toFixed(1) })"

# Mobile
playwright-cli resize 375 812
playwright-cli eval "JSON.stringify({ pageHeight: document.documentElement.scrollHeight, viewportHeight: window.innerHeight, viewportsToScroll: (document.documentElement.scrollHeight / window.innerHeight).toFixed(1) })"
```

Record results in the Scroll Depth Summary table.

## Step 2: Measure Each Section's Height

This identifies which sections are consuming the most vertical space:

```bash
playwright-cli eval "Array.from(document.querySelectorAll('section, header, footer')).map(s => { const r = s.getBoundingClientRect(); return { id: s.id || s.tagName.toLowerCase(), height: Math.round(r.height), pct: Math.round(r.height / document.documentElement.scrollHeight * 100) }; }).sort((a,b) => b.height - a.height).map(s => s.id + ': ' + s.height + 'px (' + s.pct + '%)').join('\\n')"
```

**Run this at each breakpoint.** Section heights change significantly between desktop and mobile.

## Step 3: Identify Scroll-Hog Patterns

For each section that exceeds its fair share of the page (> 20% at mobile), diagnose **why** it's tall using these measurements:

### Measure section padding
```bash
playwright-cli eval "((id) => { const s = document.getElementById(id); const cs = getComputedStyle(s); return id + ' padding: top=' + cs.paddingTop + ' bottom=' + cs.paddingBottom; })('SECTION_ID')"
```

### Measure card heights in a grid
```bash
playwright-cli eval "Array.from(document.querySelectorAll('.service-card')).map((c, i) => 'card-' + i + ': ' + Math.round(c.getBoundingClientRect().height) + 'px').join('\\n')"
```

### Measure gap between stacked elements
```bash
playwright-cli eval "((selector) => { const els = Array.from(document.querySelectorAll(selector)); return els.map((el, i) => { const r = el.getBoundingClientRect(); return 'item-' + i + ': height=' + Math.round(r.height) + 'px, top=' + Math.round(r.top) + 'px'; }).join('\\n'); })('.service-card')"
```

### Check if grid is stacking when it could stay side-by-side
```bash
playwright-cli eval "((selector) => { const els = Array.from(document.querySelectorAll(selector)); if (els.length < 2) return 'single element'; const tops = els.map(e => Math.round(e.getBoundingClientRect().top)); const allSameTop = tops.every(t => Math.abs(t - tops[0]) < 5); return allSameTop ? 'HORIZONTAL (side-by-side)' : 'VERTICAL (stacked) — tops: ' + tops.join(', '); })('.service-card')"
```

### Measure image container heights
```bash
playwright-cli eval "Array.from(document.querySelectorAll('.team-photo, .team-member')).map((el, i) => 'photo-' + i + ': ' + Math.round(el.getBoundingClientRect().height) + 'px').join('\\n')"
```

## Step 4: Screenshot Each Section in Isolation

For the top 3 scroll hogs, screenshot each one:

```bash
playwright-cli screenshot "#SECTION_ID" --filename=scroll-hog-SECTION_ID-mobile.png
```

If `playwright-cli screenshot` doesn't support element selectors, scroll to the section and capture the viewport:

```bash
playwright-cli eval "document.getElementById('SECTION_ID').scrollIntoView({behavior: 'instant'})"
playwright-cli screenshot --filename=scroll-hog-SECTION_ID-mobile.png
```

## Scroll-Hog Pattern Vocabulary

When reporting issues, use these **exact pattern names** so Planner can look up the matching tetris move in `site-patterns/references/scroll-optimization.md`:

| Pattern Name | Description | Typical Waste |
|-------------|-------------|---------------|
| **Vertical Card Stack** | Cards that could be side-by-side are stacked single-column | 40-50% of section height |
| **Excessive Section Padding** | Section padding (80px top/bottom) not reduced for mobile | 100-160px per section |
| **Excessive Card Padding** | Card internal padding (40px) not reduced for mobile | 20-40px per card |
| **Verbose Card Face** | Multi-line description text visible on card face, could be collapsed | 30-60px per card |
| **Stacked Photos** | Team/profile photos stacked vertically that could be side-by-side or smaller | 200-400px |
| **Oversized Images** | Images taller than needed, no max-height constraint | 100-300px |
| **Full-Height Form** | Single-column form that could use 2 columns on tablet+ | 200-400px |
| **Repeated CTAs** | Same CTA appears between sections, wasting vertical space | 80-120px each |
| **Bloated Whitespace** | Margins/gaps between elements larger than mobile warrants | 50-200px total |
| **Heading + Subtitle Gap** | Large gap between section title and subtitle/content | 30-60px |
| **Benefit List Spread** | List items with excessive vertical padding/gaps | 50-100px per list |
| **Icon Block Height** | Large icon containers (70px+) pushing content down | 30-50px per card |

## Output Template

After running all measurements, produce this table in the audit report:

```
### Scroll Depth Summary
| Breakpoint | Page Height | Viewport | Viewports to Scroll | Target | Status |
|-----------|-------------|----------|-------------------|--------|--------|
| Desktop 1280×900 | ____px | 900px | ____ | ≤ 4 | ✅/❌ |
| Tablet 768×1024 | ____px | 1024px | ____ | ≤ 5 | ✅/❌ |
| Mobile 375×812 | ____px | 812px | ____ | ≤ 6 | ✅/❌ |

### Section Scroll Budget (Mobile 375×812)
| Section | Height | % of Page | Scroll-Hog Pattern | Severity |
|---------|--------|-----------|-------------------|----------|
| hero | ____px | ___% | (pattern or ✅ OK) | P_/✅ |
| services | ____px | ___% | (pattern or ✅ OK) | P_/✅ |
| about | ____px | ___% | (pattern or ✅ OK) | P_/✅ |
| process | ____px | ___% | (pattern or ✅ OK) | P_/✅ |
| contact | ____px | ___% | (pattern or ✅ OK) | P_/✅ |
| footer | ____px | ___% | (pattern or ✅ OK) | P_/✅ |

### Top Scroll Hogs (Ranked)
1. **#SECTION** — ____px (___%) — Pattern: __________ — Evidence: scroll-hog-SECTION-mobile.png
2. **#SECTION** — ____px (___%) — Pattern: __________ — Evidence: scroll-hog-SECTION-mobile.png
3. **#SECTION** — ____px (___%) — Pattern: __________ — Evidence: scroll-hog-SECTION-mobile.png
```

## Severity Classification for Scroll Issues

| Condition | Severity |
|----------|----------|
| Page exceeds target by > 3 viewports | **P1** — Major scroll problem |
| Page exceeds target by 1-3 viewports | **P2** — Needs condensation |
| Single section > 30% of total page height at mobile | **P1** — Scroll hog |
| Single section > 20% of total page height at mobile | **P2** — Should be condensed |
| Section padding unchanged from desktop at mobile | **P2** — Padding not responsive |
| Cards stacked that could be side-by-side at tablet | **P2** — Missed horizontal reflow opportunity |
