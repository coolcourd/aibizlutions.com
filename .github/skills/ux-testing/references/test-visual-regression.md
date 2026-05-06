# Visual Regression Testing

Step-by-step procedure for capturing baseline screenshots and detecting unintended visual changes after CSS/HTML modifications.

## Why This Matters

Without visual regression testing, every CSS fix risks breaking something else:
- "Fixed mobile padding" → broke desktop card alignment
- "Adjusted font size" → text now overflows container
- "Changed gap" → footer layout collapsed

Visual regression gives you a safety net: change CSS confidently, then verify nothing else moved.

## Prerequisites

- Local server running at `http://localhost:3000`
- Playwright available via `playwright-cli`
- Baseline screenshots stored in `ux-baselines/` directory

## Directory Structure

```
ux-baselines/
├── desktop-1280/
│   ├── hero.png
│   ├── services.png
│   ├── about.png
│   ├── process.png
│   ├── contact.png
│   └── footer.png
├── tablet-768/
│   ├── hero.png
│   ├── services.png
│   ├── about.png
│   ├── process.png
│   ├── contact.png
│   └── footer.png
└── mobile-375/
    ├── hero.png
    ├── services.png
    ├── about.png
    ├── process.png
    ├── contact.png
    └── footer.png
```

## Step 1: Capture Baselines (One-Time or After Approved Changes)

Run this after a known-good state is confirmed:

```bash
mkdir -p ux-baselines/desktop-1280 ux-baselines/tablet-768 ux-baselines/mobile-375

playwright-cli resize 1280 900
playwright-cli goto http://localhost:3000

# Desktop baselines — scroll to each section and capture
playwright-cli eval "document.getElementById('hero')?.scrollIntoView({behavior:'instant'})" 
playwright-cli screenshot --filename=ux-baselines/desktop-1280/hero.png

playwright-cli eval "document.getElementById('services')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/desktop-1280/services.png

playwright-cli eval "document.getElementById('about')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/desktop-1280/about.png

playwright-cli eval "document.getElementById('process')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/desktop-1280/process.png

playwright-cli eval "document.getElementById('contact')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/desktop-1280/contact.png

playwright-cli eval "document.querySelector('footer')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/desktop-1280/footer.png

# Tablet baselines
playwright-cli resize 768 1024

playwright-cli eval "document.getElementById('hero')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/tablet-768/hero.png

playwright-cli eval "document.getElementById('services')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/tablet-768/services.png

playwright-cli eval "document.getElementById('about')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/tablet-768/about.png

playwright-cli eval "document.getElementById('process')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/tablet-768/process.png

playwright-cli eval "document.getElementById('contact')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/tablet-768/contact.png

playwright-cli eval "document.querySelector('footer')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/tablet-768/footer.png

# Mobile baselines
playwright-cli resize 375 812

playwright-cli eval "document.getElementById('hero')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/mobile-375/hero.png

playwright-cli eval "document.getElementById('services')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/mobile-375/services.png

playwright-cli eval "document.getElementById('about')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/mobile-375/about.png

playwright-cli eval "document.getElementById('process')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/mobile-375/process.png

playwright-cli eval "document.getElementById('contact')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/mobile-375/contact.png

playwright-cli eval "document.querySelector('footer')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-baselines/mobile-375/footer.png
```

## Step 2: Capture Current State (After Changes)

After any CSS/HTML modification, capture new screenshots for comparison:

```bash
mkdir -p ux-current/desktop-1280 ux-current/tablet-768 ux-current/mobile-375

# Repeat the same capture process but save to ux-current/
# (Same commands as Step 1, replacing ux-baselines/ with ux-current/)
```

## Step 3: Visual Diff (Pixel Comparison)

### Method A: Using pixelmatch (Node.js)

```bash
# Install pixelmatch (one-time)
npm install pixelmatch pngjs --save-dev

# Run diff script
node -e "
const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const breakpoints = ['desktop-1280', 'tablet-768', 'mobile-375'];
const sections = ['hero', 'services', 'about', 'process', 'contact', 'footer'];
const results = [];

breakpoints.forEach(bp => {
  sections.forEach(section => {
    const baselinePath = 'ux-baselines/' + bp + '/' + section + '.png';
    const currentPath = 'ux-current/' + bp + '/' + section + '.png';
    
    if (!fs.existsSync(baselinePath) || !fs.existsSync(currentPath)) {
      results.push({ bp, section, status: 'MISSING', diff: 'N/A' });
      return;
    }
    
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));
    
    const { width, height } = baseline;
    const diff = new PNG({ width, height });
    
    const numDiffPixels = pixelmatch(
      baseline.data, current.data, diff.data, width, height,
      { threshold: 0.1 }
    );
    
    const diffPercent = ((numDiffPixels / (width * height)) * 100).toFixed(2);
    const status = numDiffPixels === 0 ? '✓ MATCH' : diffPercent < 1 ? '⚠ MINOR' : '✗ CHANGED';
    
    if (numDiffPixels > 0) {
      const diffPath = 'ux-diffs/' + bp + '-' + section + '-diff.png';
      fs.mkdirSync('ux-diffs', { recursive: true });
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }
    
    results.push({ bp, section, status, diff: diffPercent + '%' });
  });
});

console.log('=== VISUAL REGRESSION RESULTS ===');
results.forEach(r => console.log(r.status + ' ' + r.bp + '/' + r.section + ': ' + r.diff + ' pixels changed'));
const failures = results.filter(r => r.status.includes('✗'));
console.log('\n' + (failures.length ? '❌ ' + failures.length + ' regressions detected' : '✅ No regressions'));
"
```

### Method B: Manual Side-by-Side (No Dependencies)

When pixelmatch isn't available, use viewport-level comparison:

```bash
# Capture current state at same viewport
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000
playwright-cli eval "document.getElementById('services')?.scrollIntoView({behavior:'instant'})"
playwright-cli screenshot --filename=ux-current/mobile-375/services.png
```

Then visually compare `ux-baselines/mobile-375/services.png` vs `ux-current/mobile-375/services.png` by opening both.

### Method C: Dimension Comparison (Quick Sanity Check)

Compare section dimensions between baseline and current state without pixel diffing:

```bash
# Capture current dimensions
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000
playwright-cli eval "Array.from(document.querySelectorAll('section, header, footer')).map(s => { const r = s.getBoundingClientRect(); return (s.id || s.tagName) + ': ' + Math.round(r.width) + '×' + Math.round(r.height); }).join('\n')"
```

Compare against stored baseline dimensions. Height changes > 20px indicate a potential regression.

## Step 4: Update Baselines (After Intentional Changes)

When changes are approved and verified:

```bash
# Replace baselines with current screenshots
cp -r ux-current/* ux-baselines/
rm -rf ux-current ux-diffs
```

## .gitignore Addition

Add to `.gitignore` to keep diffs and current state out of version control:

```
ux-current/
ux-diffs/
```

Keep `ux-baselines/` tracked in git so the team shares the same reference.

## Output Template

```
### Visual Regression Report

#### Summary
- Breakpoints tested: Desktop (1280), Tablet (768), Mobile (375)
- Sections compared: hero, services, about, process, contact, footer
- Total comparisons: 18
- Matches: ___
- Minor changes (< 1%): ___
- Regressions (≥ 1%): ___

#### Regressions Detected
| Breakpoint | Section | Diff % | Diff Image |
|-----------|---------|--------|------------|
| mobile-375 | services | __% | ux-diffs/mobile-375-services-diff.png |

#### Intentional vs Unintentional
For each regression, classify:
- ✅ INTENTIONAL — matches the planned change
- ❌ UNINTENTIONAL — side effect that needs fixing
```

## Severity Classification

| Condition | Severity |
|----------|----------|
| Unintentional change > 5% diff at any breakpoint | **P1** — Layout regression |
| Unintentional change 1–5% diff | **P2** — Minor visual regression |
| Change < 1% diff (anti-aliasing, sub-pixel) | Ignore — rendering noise |
| Missing baseline for comparison | **P3** — Capture baseline before next change |
