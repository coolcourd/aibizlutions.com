# Content Density & Whitespace Ratio Audit

Step-by-step procedure for measuring how much vertical space each section consumes relative to its content value, and identifying sections that need condensing strategies (accordions, truncation, tab panels).

## Why This Matters

On mobile, vertical space is the most precious resource. A section that takes 1.5+ viewports to scroll through creates "scroll fatigue" — users abandon the page before reaching your CTA. Content density analysis identifies:

- Sections with too much text for mobile consumption
- Cards with verbose descriptions that should collapse
- Redundant information that could be hidden behind progressive disclosure
- Sections that are "tall" due to content volume (not just padding)

This is distinct from the Computed Style Audit (which catches CSS bloat). Content density catches **too much stuff** even when the CSS is correctly responsive.

## Metrics

| Metric | What It Measures | Target (Mobile) |
|--------|-----------------|-----------------|
| Viewport consumption | Section height ÷ viewport height | ≤ 1.5 per section |
| Text density | Character count per section | ≤ 300 chars visible on mobile card |
| Information units | Distinct content blocks per section | 3–5 visible items max |
| Content-to-chrome ratio | Actual text height ÷ total section height | ≥ 60% |

## Step 1: Section Viewport Consumption

Measure how many viewports each section consumes at mobile:

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000

playwright-cli eval "(() => { const vh = window.innerHeight; return Array.from(document.querySelectorAll('section, header, footer')).map(s => { const r = s.getBoundingClientRect(); const vps = (r.height / vh).toFixed(1); const status = parseFloat(vps) <= 1.5 ? '✓' : parseFloat(vps) <= 2.0 ? '⚠' : '✗'; return status + ' ' + (s.id || s.tagName) + ': ' + Math.round(r.height) + 'px = ' + vps + ' viewports'; }).join('\n'); })()"
```

**Targets:**
- ≤ 1.0 viewport: Excellent — scannable in one view
- 1.0–1.5 viewports: Acceptable — requires minimal scroll
- 1.5–2.0 viewports: Warning — consider condensing
- > 2.0 viewports: Failure — needs progressive disclosure or restructuring

## Step 2: Text Volume Per Section

Count characters and words in each section to identify text-heavy areas:

```bash
playwright-cli eval "Array.from(document.querySelectorAll('section')).map(s => { const text = s.textContent.replace(/\\s+/g, ' ').trim(); const words = text.split(' ').length; const chars = text.length; return (s.id || 'unnamed') + ': ' + chars + ' chars, ' + words + ' words'; }).join('\n')"
```

**Mobile content guidelines:**
- Hero: ≤ 80 words (punchy, scannable)
- Service cards (each): ≤ 50 words visible without expansion
- About section: ≤ 150 words above fold
- Process steps (each): ≤ 40 words
- Contact section: minimal — form + essentials only

## Step 3: Card Content Analysis

For card-based sections (services, process), measure individual card verbosity:

```bash
playwright-cli eval "(() => { const cards = Array.from(document.querySelectorAll('.service-card, .process-step, .process-card')); return cards.map((card, i) => { const title = card.querySelector('h4, h5')?.textContent.trim() || 'card-' + i; const desc = card.querySelector('p')?.textContent.trim() || ''; const list = card.querySelectorAll('li'); const r = card.getBoundingClientRect(); return title + ': desc=' + desc.length + ' chars, ' + list.length + ' list items, height=' + Math.round(r.height) + 'px'; }).join('\n'); })()"
```

**Card content targets (mobile):**
| Card Element | Target | Condensing Strategy if Exceeded |
|-------------|--------|-------------------------------|
| Description text | ≤ 120 chars | Truncate with "Read more" |
| Bullet list | ≤ 3 items visible | Collapse additional items |
| Total card height | ≤ 250px | Use accordion or swipeable carousel |

## Step 4: Content-to-Chrome Ratio

Measure how much of each section is actual readable content vs. decorative/structural elements:

```bash
playwright-cli eval "Array.from(document.querySelectorAll('section')).map(s => { const sectionHeight = s.getBoundingClientRect().height; const cs = getComputedStyle(s); const padding = parseInt(cs.paddingTop) + parseInt(cs.paddingBottom); const contentEls = s.querySelectorAll('h2,h3,h4,h5,p,li,a.btn-primary,a.btn-secondary,input,textarea,button[type=submit]'); let contentHeight = 0; contentEls.forEach(el => { contentHeight += el.getBoundingClientRect().height; }); const ratio = ((contentHeight / sectionHeight) * 100).toFixed(0); const status = ratio >= 60 ? '✓' : ratio >= 40 ? '⚠' : '✗'; return status + ' ' + (s.id || 'unnamed') + ': content=' + Math.round(contentHeight) + 'px / section=' + Math.round(sectionHeight) + 'px = ' + ratio + '% content'; }).join('\n')"
```

**Interpretation:**
- ≥ 60% content: Good density — section is well-used
- 40–59%: Moderate — some wasted chrome/spacing
- < 40%: Poor — too much decorative space, padding, or unused area

## Step 5: Scroll-to-CTA Distance

Measure how far the user must scroll from page top to reach the primary CTA at mobile:

```bash
playwright-cli eval "(() => { const ctas = document.querySelectorAll('a[href=\"#contact\"], button[type=\"submit\"], .btn-primary'); const vh = window.innerHeight; const results = Array.from(ctas).map(cta => { const r = cta.getBoundingClientRect(); const scrollTop = window.pageYOffset + r.top; const vps = (scrollTop / vh).toFixed(1); return cta.textContent.trim().substring(0, 30) + ': ' + Math.round(scrollTop) + 'px from top = ' + vps + ' viewports down'; }); return results.join('\n'); })()"
```

**Targets:**
- First CTA (hero): visible without scrolling (0 viewports)
- Contact form CTA: reachable within 4 viewports on mobile
- Any section CTA: within 0.5 viewports of entering that section

## Step 6: Progressive Disclosure Opportunities

Identify content that could be hidden behind accordions, "Read more" links, or tabs:

```bash
playwright-cli eval "(() => { const opportunities = []; // Long paragraphs document.querySelectorAll('section p').forEach(p => { if (p.textContent.trim().length > 150) { opportunities.push('LONG TEXT: \"' + p.textContent.trim().substring(0, 40) + '...\" (' + p.textContent.trim().length + ' chars) in #' + (p.closest('section')?.id || 'unknown')); } }); // Long lists document.querySelectorAll('section ul, section ol').forEach(list => { const items = list.querySelectorAll('li'); if (items.length > 3) { opportunities.push('LONG LIST: ' + items.length + ' items in #' + (list.closest('section')?.id || 'unknown') + ' — show 3, collapse rest'); } }); // Multiple cards that could carousel document.querySelectorAll('.services-grid, .process-steps').forEach(grid => { const cards = grid.children; if (cards.length > 2) { const gridHeight = grid.getBoundingClientRect().height; opportunities.push('CARD STACK: ' + cards.length + ' cards = ' + Math.round(gridHeight) + 'px in #' + (grid.closest('section')?.id || 'unknown') + ' — consider carousel/tabs'); } }); return opportunities.length ? opportunities.join('\n') : '✅ No obvious disclosure opportunities'; })()"
```

## Condensing Strategy Reference

When content density issues are found, recommend these patterns:

| Problem | Strategy | Example |
|---------|----------|---------|
| Card descriptions > 120 chars | Truncate + "Read more" | Show 2 lines, expand on tap |
| > 3 cards stacked vertically | Horizontal carousel/swipe | Show 1 card, swipe for more |
| > 3 list items | Collapse below 3rd | "Show 2 more..." link |
| Long about/story text | Accordion sections | Click heading to expand |
| Multiple similar sections | Tab panels | Services / Process as tabs |
| Repeated CTAs | Remove duplicates | One CTA per 2 viewports max |

## Output Template

```
### Content Density Audit (Mobile 375×812)

#### Section Viewport Consumption
| Section | Height | Viewports | Target | Status |
|---------|--------|-----------|--------|--------|
| hero | ___px | _._vp | ≤ 1.0 | ✅/❌ |
| services | ___px | _._vp | ≤ 1.5 | ✅/❌ |
| about | ___px | _._vp | ≤ 1.5 | ✅/❌ |
| process | ___px | _._vp | ≤ 1.5 | ✅/❌ |
| contact | ___px | _._vp | ≤ 1.5 | ✅/❌ |

#### Content-to-Chrome Ratio
| Section | Content Height | Section Height | Ratio | Status |
|---------|---------------|----------------|-------|--------|
| (section) | ___px | ___px | __% | ✅/❌ |

#### Condensing Opportunities
| Section | Issue | Strategy | Estimated Savings |
|---------|-------|----------|-------------------|
| (section) | (description) | (strategy) | ___px |

#### CTA Reachability
| CTA | Distance from Top | Viewports | Status |
|-----|-------------------|-----------|--------|
| (cta text) | ___px | _._vp | ✅/❌ |
```

## Severity Classification

| Condition | Severity |
|----------|----------|
| Any section > 2.5 viewports on mobile | **P1** — Scroll fatigue guaranteed |
| Primary CTA unreachable within 4 viewports | **P1** — Conversion at risk |
| Section 1.5–2.5 viewports with condensable content | **P2** — Should condense |
| Content-to-chrome ratio < 40% | **P2** — Wasted space |
| Card text > 120 chars without truncation | **P3** — Verbose but functional |
| Content-to-chrome 40–59% | **P3** — Room to tighten |
