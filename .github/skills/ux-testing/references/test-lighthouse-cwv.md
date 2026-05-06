# Lighthouse & Core Web Vitals Audit

Step-by-step procedure for running Lighthouse performance audits and extracting Core Web Vitals metrics.

## Why This Matters

Performance IS user experience. A page that loads slowly or shifts layout on mobile will feel broken regardless of how good the design is. Core Web Vitals directly impact:
- Google search ranking (mobile-first indexing)
- User bounce rate (53% of mobile users leave if load > 3s)
- Perceived quality and trust

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 |

## Prerequisites

- Local server running at `http://localhost:3000`
- Node.js available for running Lighthouse CLI
- Chrome/Chromium installed (Lighthouse uses it)

## Method 1: Lighthouse CLI (Full Audit)

### Mobile Audit (Primary)

```bash
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=./lighthouse-mobile.json \
  --preset=perf \
  --emulated-form-factor=mobile \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices \
  --quiet
```

### Desktop Audit

```bash
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=./lighthouse-desktop.json \
  --preset=perf \
  --emulated-form-factor=desktop \
  --chrome-flags="--headless --no-sandbox" \
  --only-categories=performance,accessibility,best-practices \
  --quiet
```

### Extract Key Scores

```bash
node -e "
const r = require('./lighthouse-mobile.json');
const cats = r.categories;
const audits = r.audits;
console.log('=== LIGHTHOUSE SCORES (Mobile) ===');
console.log('Performance:', Math.round(cats.performance.score * 100));
console.log('Accessibility:', Math.round(cats.accessibility.score * 100));
console.log('Best Practices:', Math.round(cats['best-practices'].score * 100));
console.log('');
console.log('=== CORE WEB VITALS ===');
console.log('LCP:', audits['largest-contentful-paint'].displayValue, '(' + (audits['largest-contentful-paint'].score >= 0.9 ? '✓' : '✗') + ')');
console.log('CLS:', audits['cumulative-layout-shift'].displayValue, '(' + (audits['cumulative-layout-shift'].score >= 0.9 ? '✓' : '✗') + ')');
console.log('TBT (proxy for INP):', audits['total-blocking-time'].displayValue, '(' + (audits['total-blocking-time'].score >= 0.9 ? '✓' : '✗') + ')');
console.log('FCP:', audits['first-contentful-paint'].displayValue);
console.log('Speed Index:', audits['speed-index'].displayValue);
console.log('');
console.log('=== TOP OPPORTUNITIES ===');
const opps = Object.values(audits).filter(a => a.details && a.details.type === 'opportunity' && a.score < 0.9).sort((a,b) => (b.details.overallSavingsMs||0) - (a.details.overallSavingsMs||0)).slice(0, 5);
opps.forEach(o => console.log('-', o.title, ':', o.displayValue || 'n/a'));
"
```

## Method 2: In-Browser Performance Metrics (via Playwright)

When Lighthouse CLI isn't available, measure CWV directly in the browser:

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000

# Wait for page to fully load
playwright-cli eval "await new Promise(r => setTimeout(r, 3000))"

# Measure LCP
playwright-cli eval "await new Promise(resolve => { new PerformanceObserver((list) => { const entries = list.getEntries(); const last = entries[entries.length - 1]; resolve('LCP: ' + Math.round(last.startTime) + 'ms — element: ' + (last.element ? last.element.tagName + '.' + last.element.className.split(' ')[0] : 'unknown')); }).observe({type: 'largest-contentful-paint', buffered: true}); setTimeout(() => resolve('LCP: timeout (page may still be loading)'), 5000); })"

# Measure CLS
playwright-cli eval "await new Promise(resolve => { let cls = 0; new PerformanceObserver((list) => { for (const entry of list.getEntries()) { if (!entry.hadRecentInput) cls += entry.value; } }).observe({type: 'layout-shift', buffered: true}); setTimeout(() => resolve('CLS: ' + cls.toFixed(4) + (cls <= 0.1 ? ' ✓' : ' ✗')), 3000); })"

# Measure FCP
playwright-cli eval "(() => { const fcp = performance.getEntriesByName('first-contentful-paint')[0]; return fcp ? 'FCP: ' + Math.round(fcp.startTime) + 'ms' : 'FCP: not available'; })()"

# Resource loading breakdown
playwright-cli eval "(() => { const resources = performance.getEntriesByType('resource'); const byType = {}; resources.forEach(r => { const ext = r.name.split('.').pop().split('?')[0].toLowerCase(); const type = ['css','js'].includes(ext) ? ext : ['png','jpg','jpeg','gif','webp','svg','ico'].includes(ext) ? 'img' : ['woff','woff2','ttf','eot'].includes(ext) ? 'font' : 'other'; byType[type] = byType[type] || {count: 0, totalMs: 0, totalKB: 0}; byType[type].count++; byType[type].totalMs += r.duration; byType[type].totalKB += (r.transferSize || 0) / 1024; }); return Object.entries(byType).map(([k,v]) => k + ': ' + v.count + ' files, ' + Math.round(v.totalMs) + 'ms total, ' + Math.round(v.totalKB) + 'KB').join('\n'); })()"
```

## Method 3: CLS Diagnosis (Layout Shift Sources)

CLS is the most common mobile UX problem. Identify what's shifting:

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000

# Identify layout shift sources
playwright-cli eval "await new Promise(resolve => { const shifts = []; new PerformanceObserver((list) => { for (const entry of list.getEntries()) { if (!entry.hadRecentInput && entry.value > 0.001) { const sources = entry.sources ? entry.sources.map(s => s.node ? s.node.tagName + '.' + (s.node.className||'').split(' ')[0] + '#' + (s.node.id||'') : 'unknown') : ['no source info']; shifts.push({ value: entry.value.toFixed(4), sources: sources.join(', ') }); } } }).observe({type: 'layout-shift', buffered: true}); setTimeout(() => { resolve(shifts.length ? shifts.map(s => 'shift=' + s.value + ' → ' + s.sources).join('\n') : '✅ No significant layout shifts detected'); }, 4000); })"
```

**Common CLS causes on static sites:**
- Images without explicit width/height attributes
- Web fonts loading and causing text reflow (FOUT)
- Dynamic content injection (e.g., banner appearing)
- CSS animations that affect layout (not just transform/opacity)

## Step 4: Image Optimization Check

Images are usually the #1 LCP bottleneck on static sites:

```bash
playwright-cli eval "(() => { const imgs = Array.from(document.querySelectorAll('img')); return imgs.map(img => { const r = img.getBoundingClientRect(); const displayed = Math.round(r.width) + '×' + Math.round(r.height); const natural = img.naturalWidth + '×' + img.naturalHeight; const oversized = img.naturalWidth > r.width * 2; return (oversized ? '⚠ OVERSIZED ' : '✓ ') + img.src.split('/').pop() + ': displayed=' + displayed + ' natural=' + natural + (img.loading === 'lazy' ? ' [lazy]' : ' [eager]'); }).join('\n'); })()"
```

**Verify:**
- [ ] Hero/above-fold images are NOT lazy-loaded
- [ ] Below-fold images ARE lazy-loaded
- [ ] No image served at > 2× its display size
- [ ] Images use modern formats (WebP preferred) where possible

## Output Template

```
### Lighthouse & Core Web Vitals Audit

#### Scores
| Category | Mobile | Desktop | Target |
|----------|--------|---------|--------|
| Performance | __/100 | __/100 | ≥ 90 |
| Accessibility | __/100 | __/100 | ≥ 95 |
| Best Practices | __/100 | __/100 | ≥ 90 |

#### Core Web Vitals (Mobile)
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | __ms | ≤ 2500ms | ✅/❌ |
| CLS | __.__ | ≤ 0.1 | ✅/❌ |
| INP/TBT | __ms | ≤ 200ms | ✅/❌ |
| FCP | __ms | ≤ 1800ms | ✅/❌ |

#### Layout Shift Sources
| Element | Shift Value | Cause |
|---------|-------------|-------|
| (element) | 0.____ | (cause) |

#### Image Optimization
| Image | Display Size | Natural Size | Status |
|-------|-------------|--------------|--------|
| (filename) | __×__ | __×__ | ✅/⚠ oversized |

#### Top Opportunities
1. (opportunity): potential savings __ms
2. (opportunity): potential savings __ms
3. (opportunity): potential savings __ms
```

## Severity Classification

| Condition | Severity |
|----------|----------|
| Performance score < 50 (mobile) | **P0** — Critical performance failure |
| LCP > 4.0s | **P1** — Slow meaningful paint |
| CLS > 0.25 | **P1** — Severe layout instability |
| Performance score 50–89 | **P2** — Needs improvement |
| LCP 2.5–4.0s | **P2** — Borderline slow |
| CLS 0.1–0.25 | **P2** — Noticeable shifts |
| Oversized images (> 3× display size) | **P2** — Bandwidth waste |
| Missing lazy-load on below-fold images | **P3** — Minor optimization |
| Performance score ≥ 90 | ✅ — Good |
