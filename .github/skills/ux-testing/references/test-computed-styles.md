# Computed Style Audit

Step-by-step procedure for extracting and diagnosing computed CSS values that cause mobile bloat. This is the primary tool for identifying **why** a section is too tall — not just **that** it's too tall.

## Why This Matters

Screenshots show symptoms. Computed style extraction shows causes:
- Desktop padding (80px) still applied at mobile
- Font sizes that didn't scale down
- Gaps/margins that stayed at desktop values
- Elements overflowing viewport width

## Step 1: Section Padding Audit (All Breakpoints)

Run at each breakpoint to identify sections where padding didn't reduce:

```bash
# Desktop baseline
playwright-cli resize 1280 900
playwright-cli eval "Array.from(document.querySelectorAll('section, header, footer')).map(s => { const cs = getComputedStyle(s); return (s.id || s.tagName.toLowerCase()) + ': pad-top=' + cs.paddingTop + ' pad-bot=' + cs.paddingBottom + ' total-pad=' + (parseInt(cs.paddingTop) + parseInt(cs.paddingBottom)) + 'px'; }).join('\n')"

# Mobile — compare against desktop values
playwright-cli resize 375 812
playwright-cli eval "Array.from(document.querySelectorAll('section, header, footer')).map(s => { const cs = getComputedStyle(s); return (s.id || s.tagName.toLowerCase()) + ': pad-top=' + cs.paddingTop + ' pad-bot=' + cs.paddingBottom + ' total-pad=' + (parseInt(cs.paddingTop) + parseInt(cs.paddingBottom)) + 'px'; }).join('\n')"
```

**Red flags:**
- Any section with > 60px total padding at mobile (375px viewport)
- Padding that didn't decrease from desktop → mobile
- Sections where padding accounts for > 15% of section height

## Step 2: Typography Scale Audit

Extract font sizes and line heights for all text at mobile to catch oversized typography:

```bash
playwright-cli resize 375 812
playwright-cli eval "Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,.section-subtitle')).map(el => { const cs = getComputedStyle(el); const text = el.textContent.trim().substring(0, 30); return el.tagName + ' \"' + text + '\": size=' + cs.fontSize + ' line-height=' + cs.lineHeight + ' margin-bot=' + cs.marginBottom; }).join('\n')"
```

**Mobile typography targets:**
| Element | Max Font Size (mobile) | Max Line Height |
|---------|----------------------|-----------------|
| h2 | 28px–32px | 1.2–1.3 |
| h3 (section title) | 24px–28px | 1.2–1.3 |
| h4 (card title) | 18px–20px | 1.3 |
| p (body) | 14px–16px | 1.5–1.6 |
| .section-subtitle | 14px–16px | 1.5 |

**Red flags:**
- h2 still at desktop size (> 36px) on mobile
- Body text with line-height > 1.8 on mobile
- Large margin-bottom on headings (> 16px at mobile)

## Step 3: Gap & Margin Audit

Check CSS grid/flex gaps and element margins that create whitespace bloat:

```bash
playwright-cli resize 375 812

# Grid/flex container gaps
playwright-cli eval "Array.from(document.querySelectorAll('.services-grid, .process-steps, .team-grid, .about-content, .contact-content')).map(el => { const cs = getComputedStyle(el); return el.className.split(' ')[0] + ': gap=' + cs.gap + ' row-gap=' + cs.rowGap + ' column-gap=' + cs.columnGap; }).join('\n')"

# Card margins
playwright-cli eval "Array.from(document.querySelectorAll('.service-card, .process-step, .team-member')).map((el, i) => { const cs = getComputedStyle(el); return el.className.split(' ')[0] + '-' + i + ': margin=' + cs.margin + ' padding=' + cs.padding; }).join('\n')"

# Heading-to-content spacing
playwright-cli eval "Array.from(document.querySelectorAll('.section-title, .section-subtitle')).map(el => { const cs = getComputedStyle(el); return el.className + ' \"' + el.textContent.trim().substring(0,20) + '\": margin-bottom=' + cs.marginBottom; }).join('\n')"
```

**Mobile gap targets:**
| Container | Max Gap (mobile) |
|-----------|-----------------|
| Service cards | 20px–24px |
| Process steps | 24px–30px |
| Team grid | 20px |
| Section title → content | 16px–24px |

## Step 4: Horizontal Overflow Detection

Find any elements that bleed past the viewport edge (causes horizontal scroll):

```bash
playwright-cli resize 375 812
playwright-cli eval "(() => { const vw = document.documentElement.clientWidth; const overflows = []; document.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.width > vw + 1) { overflows.push(el.tagName + '.' + (el.className || '').split(' ')[0] + '#' + (el.id || '') + ': width=' + Math.round(r.width) + 'px (viewport=' + vw + 'px, overflow=' + Math.round(r.width - vw) + 'px)'); } }); return overflows.length ? overflows.join('\n') : '✅ No horizontal overflow detected'; })()"
```

## Step 5: Box Model Deep Dive (Single Element)

When a specific element is identified as problematic, get its full box model:

```bash
# Replace SELECTOR with the target element
playwright-cli eval "((sel) => { const el = document.querySelector(sel); const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return JSON.stringify({ selector: sel, width: Math.round(r.width), height: Math.round(r.height), padding: { top: cs.paddingTop, right: cs.paddingRight, bottom: cs.paddingBottom, left: cs.paddingLeft }, margin: { top: cs.marginTop, right: cs.marginRight, bottom: cs.marginBottom, left: cs.marginLeft }, border: { top: cs.borderTopWidth, right: cs.borderRightWidth, bottom: cs.borderBottomWidth, left: cs.borderLeftWidth }, fontSize: cs.fontSize, lineHeight: cs.lineHeight, display: cs.display, flexDirection: cs.flexDirection, gap: cs.gap }, null, 2); })('#services')"
```

## Step 6: Media Query Effectiveness Check

Verify that responsive styles are actually applying by comparing key values across breakpoints:

```bash
# Run at desktop, then mobile, and compare
playwright-cli resize 1280 900
playwright-cli eval "(() => { const checks = [ {sel: '.service-card', props: ['padding', 'fontSize']}, {sel: '.section-title', props: ['fontSize', 'marginBottom']}, {sel: '#hero', props: ['paddingTop', 'paddingBottom']}, ]; return checks.map(c => { const el = document.querySelector(c.sel); if (!el) return c.sel + ': NOT FOUND'; const cs = getComputedStyle(el); return c.sel + ': ' + c.props.map(p => p + '=' + cs[p]).join(', '); }).join('\n'); })()"

playwright-cli resize 375 812
playwright-cli eval "(() => { const checks = [ {sel: '.service-card', props: ['padding', 'fontSize']}, {sel: '.section-title', props: ['fontSize', 'marginBottom']}, {sel: '#hero', props: ['paddingTop', 'paddingBottom']}, ]; return checks.map(c => { const el = document.querySelector(c.sel); if (!el) return c.sel + ': NOT FOUND'; const cs = getComputedStyle(el); return c.sel + ': ' + c.props.map(p => p + '=' + cs[p]).join(', '); }).join('\n'); })()"
```

**If values are identical at both breakpoints → media queries are missing or not specific enough.**

## Output Template

```
### Computed Style Audit (Mobile 375×812)

#### Padding Bloat
| Section | Desktop Padding | Mobile Padding | Savings if Reduced |
|---------|----------------|----------------|-------------------|
| hero | __px top/bottom | __px top/bottom | __px |
| services | __px top/bottom | __px top/bottom | __px |
| about | __px top/bottom | __px top/bottom | __px |
| process | __px top/bottom | __px top/bottom | __px |
| contact | __px top/bottom | __px top/bottom | __px |

#### Typography Bloat
| Element | Current Size | Target Size | Status |
|---------|-------------|-------------|--------|
| h2 | __px | 28-32px | ✅/❌ |
| h3 | __px | 24-28px | ✅/❌ |
| h4 | __px | 18-20px | ✅/❌ |
| p | __px | 14-16px | ✅/❌ |

#### Gap/Margin Issues
| Container | Current Gap | Target Gap | Excess |
|-----------|------------|------------|--------|
| services-grid | __px | 20-24px | __px |
| process-steps | __px | 24-30px | __px |

#### Horizontal Overflow
(list any elements or ✅ None detected)
```

## Severity Classification

| Condition | Severity |
|----------|----------|
| Padding unchanged from desktop → mobile | **P1** — Primary scroll bloat source |
| Font size > 1.5× target at mobile | **P1** — Readability + space issue |
| Gap/margin > 2× target | **P2** — Contributing to scroll bloat |
| Horizontal overflow detected | **P1** — Broken layout |
| Minor gap excess (< 10px over target) | **P3** — Polish issue |
