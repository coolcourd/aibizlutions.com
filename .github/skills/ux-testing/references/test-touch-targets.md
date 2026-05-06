# Touch Target Audit

Step-by-step procedure for verifying all interactive elements meet minimum tap target sizes on mobile viewports.

## Standards

| Standard | Minimum Size | Source |
|----------|-------------|--------|
| WCAG 2.5.5 (AAA) | 44×44px | W3C |
| WCAG 2.5.8 (AA) | 24×24px | W3C (target size) |
| Google Material | 48×48px | Material Design Guidelines |
| Apple HIG | 44×44pt | Apple Human Interface Guidelines |

**This audit uses 44×44px as the target** (WCAG AAA / Apple standard). Elements between 24–44px are flagged as warnings; below 24px are failures.

## Prerequisites

- Browser open at mobile viewport (375×812)
- Site loaded at `http://localhost:3000`

## Step 1: Full Touch Target Scan

Measure every interactive element's bounding box at mobile:

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000
playwright-cli eval "(() => { const els = Array.from(document.querySelectorAll('a, button, input, select, textarea, [role=\"button\"], [tabindex]')); const results = { pass: [], warn: [], fail: [] }; els.forEach(el => { const r = el.getBoundingClientRect(); if (r.width === 0 && r.height === 0) return; const w = Math.round(r.width); const h = Math.round(r.height); const name = (el.getAttribute('aria-label') || el.textContent || el.name || el.type || '').trim().substring(0, 35); const entry = el.tagName + ' \"' + name + '\": ' + w + '×' + h + 'px'; if (w >= 44 && h >= 44) results.pass.push('✓ ' + entry); else if (w >= 24 && h >= 24) results.warn.push('⚠ ' + entry); else results.fail.push('✗ ' + entry); }); return '=== FAILURES (< 24px) ===\n' + (results.fail.join('\n') || 'None') + '\n\n=== WARNINGS (24-43px) ===\n' + (results.warn.join('\n') || 'None') + '\n\n=== PASSING (≥ 44px) ===\n' + results.pass.length + ' elements pass'; })()"
```

## Step 2: Navigation Touch Targets

Specifically test the mobile nav menu items since they're the most-tapped elements:

```bash
# Open hamburger menu first
playwright-cli click "#mobile-menu"

# Measure nav link tap targets
playwright-cli eval "Array.from(document.querySelectorAll('#nav-menu a')).map(a => { const r = a.getBoundingClientRect(); const pass = r.height >= 44; return (pass ? '✓' : '✗') + ' \"' + a.textContent.trim() + '\": height=' + Math.round(r.height) + 'px width=' + Math.round(r.width) + 'px'; }).join('\n')"
```

**Nav link targets:**
- [ ] Each nav link has ≥ 44px height
- [ ] Spacing between links prevents accidental taps (≥ 8px gap)
- [ ] Hamburger button itself is ≥ 44×44px

## Step 3: CTA Button Touch Targets

```bash
playwright-cli eval "Array.from(document.querySelectorAll('.btn-primary, .btn-secondary, .btn-secondary-light, .cta-nav-link, [type=\"submit\"]')).map(btn => { const r = btn.getBoundingClientRect(); const w = Math.round(r.width); const h = Math.round(r.height); const pass = w >= 44 && h >= 44; return (pass ? '✓' : '✗') + ' \"' + btn.textContent.trim().substring(0, 30) + '\": ' + w + '×' + h + 'px'; }).join('\n')"
```

**CTA button targets:**
- [ ] All CTA buttons ≥ 44px height
- [ ] Submit button full-width or ≥ 44px height on mobile
- [ ] Buttons not too close together (≥ 8px spacing)

## Step 4: Form Input Touch Targets

```bash
playwright-cli eval "Array.from(document.querySelectorAll('input, textarea, select')).map(el => { const r = el.getBoundingClientRect(); const h = Math.round(r.height); const pass = h >= 44; return (pass ? '✓' : '✗') + ' ' + el.tagName + '[' + (el.type || 'text') + '] \"' + (el.placeholder || el.name || '') + '\": height=' + h + 'px width=' + Math.round(r.width) + 'px'; }).join('\n')"
```

**Form input targets:**
- [ ] All text inputs ≥ 44px height
- [ ] Textarea ≥ 44px height (usually larger)
- [ ] Select dropdowns ≥ 44px height

## Step 5: Social/Icon Link Touch Targets

Icon-only links are commonly undersized:

```bash
playwright-cli eval "Array.from(document.querySelectorAll('.social-links a, .social-icons a, footer a')).map(a => { const r = a.getBoundingClientRect(); const w = Math.round(r.width); const h = Math.round(r.height); const pass = w >= 44 && h >= 44; return (pass ? '✓' : '✗') + ' \"' + (a.getAttribute('aria-label') || a.textContent.trim().substring(0, 20) || a.href.split('/').pop()) + '\": ' + w + '×' + h + 'px'; }).join('\n')"
```

## Step 6: Touch Target Spacing (Crowding)

Even if individual targets are large enough, overlapping/crowded targets cause mis-taps:

```bash
playwright-cli eval "(() => { const els = Array.from(document.querySelectorAll('a, button, input, [role=\"button\"]')).filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < document.documentElement.scrollHeight; }); const issues = []; for (let i = 0; i < els.length; i++) { for (let j = i + 1; j < els.length; j++) { const a = els[i].getBoundingClientRect(); const b = els[j].getBoundingClientRect(); const hGap = Math.max(0, Math.max(b.left - a.right, a.left - b.right)); const vGap = Math.max(0, Math.max(b.top - a.bottom, a.top - b.bottom)); if (hGap < 8 && vGap < 8 && hGap + vGap < 8) { const nameA = (els[i].textContent || '').trim().substring(0, 15); const nameB = (els[j].textContent || '').trim().substring(0, 15); issues.push('⚠ \"' + nameA + '\" ↔ \"' + nameB + '\": gap=' + Math.min(hGap, vGap).toFixed(0) + 'px'); } } } return issues.length ? issues.slice(0, 20).join('\n') : '✅ No crowding issues detected'; })()"
```

## Output Template

```
### Touch Target Audit (Mobile 375×812)

#### Summary
- Total interactive elements: ___
- Passing (≥ 44px): ___
- Warnings (24-43px): ___
- Failures (< 24px): ___

#### Failures (Must Fix)
| Element | Size | Required | Location |
|---------|------|----------|----------|
| (element) | __×__px | 44×44px | (section) |

#### Warnings (Should Fix)
| Element | Size | Recommended | Location |
|---------|------|-------------|----------|
| (element) | __×__px | 44×44px | (section) |

#### Crowding Issues
| Element Pair | Gap | Required | Location |
|-------------|-----|----------|----------|
| (element A) ↔ (element B) | __px | ≥ 8px | (section) |
```

## Severity Classification

| Condition | Severity |
|----------|----------|
| Any interactive element < 24px in either dimension | **P1** — Accessibility failure |
| Primary CTA buttons < 44px height | **P1** — Conversion blocker |
| Nav links < 44px height on mobile | **P1** — Navigation failure |
| Form inputs < 44px height | **P2** — Usability issue |
| Icon links < 44px (with adequate aria-label) | **P2** — Usability issue |
| Elements crowded with < 8px gap | **P2** — Mis-tap risk |
| Elements 24-43px with adequate spacing | **P3** — Polish improvement |
