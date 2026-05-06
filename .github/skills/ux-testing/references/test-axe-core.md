# Automated Accessibility Audit (axe-core)

Step-by-step procedure for running axe-core automated accessibility engine in-browser to catch WCAG violations that manual inspection misses.

## Why This Matters

The manual accessibility checks in `test-accessibility.md` catch structural issues (heading hierarchy, alt text, keyboard nav). But axe-core catches:
- **Color contrast failures** with exact ratios
- **ARIA attribute misuse** (invalid roles, missing required attributes)
- **Form labeling errors** (inputs without associated labels)
- **Focus management issues** (tabindex misuse, focusable hidden elements)
- **Landmark region violations** (content outside landmarks)

axe-core tests against WCAG 2.1 Level A and AA automatically — it's the same engine Lighthouse uses for its accessibility score.

## Prerequisites

- Browser open via Playwright at `http://localhost:3000`
- No external dependencies needed — axe-core is injected at runtime via CDN

## Step 1: Full Page Audit

Inject axe-core and run a complete accessibility scan:

```bash
playwright-cli resize 1280 900
playwright-cli goto http://localhost:3000

# Inject axe-core and run full audit
playwright-cli eval "await (async () => { const script = document.createElement('script'); script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; script.crossOrigin = 'anonymous'; document.head.appendChild(script); await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; }); const results = await axe.run(); const summary = { violations: results.violations.length, passes: results.passes.length, incomplete: results.incomplete.length, inapplicable: results.inapplicable.length }; const violations = results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length, help: v.helpUrl })); return JSON.stringify({ summary, violations }, null, 2); })()"
```

## Step 2: Categorized Violation Report

Get violations grouped by severity/impact:

```bash
playwright-cli eval "await (async () => { if (typeof axe === 'undefined') { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); } const results = await axe.run(); const byImpact = { critical: [], serious: [], moderate: [], minor: [] }; results.violations.forEach(v => { byImpact[v.impact] = byImpact[v.impact] || []; byImpact[v.impact].push(v.id + ' (' + v.nodes.length + ' instances): ' + v.description); }); return '=== CRITICAL ===\n' + (byImpact.critical.join('\n') || 'None') + '\n\n=== SERIOUS ===\n' + (byImpact.serious.join('\n') || 'None') + '\n\n=== MODERATE ===\n' + (byImpact.moderate.join('\n') || 'None') + '\n\n=== MINOR ===\n' + (byImpact.minor.join('\n') || 'None'); })()"
```

## Step 3: Detailed Node-Level Report

For each violation, get the specific elements that fail:

```bash
playwright-cli eval "await (async () => { if (typeof axe === 'undefined') { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); } const results = await axe.run(); return results.violations.map(v => { const nodes = v.nodes.slice(0, 3).map(n => '  → ' + n.target.join(' > ') + ' — ' + (n.failureSummary || '').split('\n')[0]); return '❌ ' + v.id + ' [' + v.impact + '] — ' + v.description + '\n' + nodes.join('\n') + (v.nodes.length > 3 ? '\n  ... and ' + (v.nodes.length - 3) + ' more' : ''); }).join('\n\n') || '✅ No violations found'; })()"
```

## Step 4: Color Contrast Audit (Focused)

Run axe-core targeting only color contrast rules:

```bash
playwright-cli eval "await (async () => { if (typeof axe === 'undefined') { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); } const results = await axe.run(document, { runOnly: ['color-contrast'] }); if (results.violations.length === 0) return '✅ All color contrasts pass WCAG AA'; return results.violations[0].nodes.map(n => { const data = n.any[0]?.data || {}; return '✗ ' + n.target.join(' > ') + ': fg=' + (data.fgColor || '?') + ' bg=' + (data.bgColor || '?') + ' ratio=' + (data.contrastRatio ? data.contrastRatio.toFixed(2) + ':1' : '?') + ' (need ' + (data.expectedContrastRatio || '4.5:1') + ')'; }).join('\n'); })()"
```

## Step 5: Form Accessibility Audit (Focused)

Run targeting form-related rules only:

```bash
playwright-cli eval "await (async () => { if (typeof axe === 'undefined') { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); } const formRules = ['label', 'label-title-only', 'input-image-alt', 'select-name', 'autocomplete-valid']; const results = await axe.run(document, { runOnly: formRules }); if (results.violations.length === 0) return '✅ All form elements properly labeled'; return results.violations.map(v => '✗ ' + v.id + ': ' + v.nodes.map(n => n.target.join(' > ')).join(', ')).join('\n'); })()"
```

## Step 6: Landmark & Structure Audit (Focused)

Check ARIA landmarks and document structure:

```bash
playwright-cli eval "await (async () => { if (typeof axe === 'undefined') { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); } const structureRules = ['landmark-one-main', 'region', 'bypass', 'heading-order', 'page-has-heading-one', 'document-title']; const results = await axe.run(document, { runOnly: structureRules }); if (results.violations.length === 0) return '✅ Document structure and landmarks valid'; return results.violations.map(v => '✗ ' + v.id + ' [' + v.impact + ']: ' + v.description + ' (' + v.nodes.length + ' instances)').join('\n'); })()"
```

## Step 7: Mobile-Specific Accessibility

Run the audit at mobile viewport (some issues only appear at small sizes):

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000

playwright-cli eval "await (async () => { if (typeof axe === 'undefined') { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); } const results = await axe.run(); const mobileRelevant = results.violations.filter(v => ['color-contrast', 'target-size', 'link-in-text-block', 'scrollable-region-focusable'].includes(v.id)); return mobileRelevant.length ? 'Mobile-specific violations:\n' + mobileRelevant.map(v => '✗ ' + v.id + ' [' + v.impact + ']: ' + v.nodes.length + ' instances').join('\n') : '✅ No mobile-specific a11y issues'; })()"
```

## Step 8: Section-by-Section Audit

Run axe-core scoped to individual sections for targeted fixing:

```bash
# Test specific section
playwright-cli eval "await (async () => { if (typeof axe === 'undefined') { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js'; document.head.appendChild(s); await new Promise(r => s.onload = r); } const sections = ['hero', 'services', 'about', 'process', 'contact']; const results = []; for (const id of sections) { const el = document.getElementById(id); if (!el) { results.push(id + ': NOT FOUND'); continue; } const r = await axe.run(el); results.push(id + ': ' + (r.violations.length === 0 ? '✅ Pass' : '❌ ' + r.violations.length + ' violations — ' + r.violations.map(v => v.id).join(', '))); } return results.join('\n'); })()"
```

## Offline Fallback (No CDN)

If CDN is unavailable, install axe-core locally:

```bash
npm install axe-core --save-dev
```

Then reference the local file:
```bash
playwright-cli eval "await (async () => { const script = document.createElement('script'); script.src = '/node_modules/axe-core/axe.min.js'; document.head.appendChild(script); await new Promise(r => script.onload = r); const results = await axe.run(); return JSON.stringify({ violations: results.violations.length }, null, 2); })()"
```

## Output Template

```
### axe-core Accessibility Audit

#### Summary
- Total rules tested: ___
- Violations: ___
- Passes: ___
- Incomplete (needs review): ___

#### Violations by Impact
| Impact | Count | Rule IDs |
|--------|-------|----------|
| Critical | ___ | (list) |
| Serious | ___ | (list) |
| Moderate | ___ | (list) |
| Minor | ___ | (list) |

#### Critical & Serious Violations (Detail)
| Rule | Impact | Instances | Elements | Fix |
|------|--------|-----------|----------|-----|
| (rule-id) | (impact) | ___ | (CSS selectors) | (remediation) |

#### Color Contrast Failures
| Element | Foreground | Background | Ratio | Required |
|---------|-----------|------------|-------|----------|
| (selector) | (color) | (color) | __:1 | 4.5:1 |

#### Section Health
| Section | Status | Violations |
|---------|--------|------------|
| hero | ✅/❌ | (list or "none") |
| services | ✅/❌ | (list or "none") |
| about | ✅/❌ | (list or "none") |
| process | ✅/❌ | (list or "none") |
| contact | ✅/❌ | (list or "none") |
```

## Severity Classification

| Condition | Severity |
|----------|----------|
| Critical impact violations (axe) | **P0** — Must fix immediately |
| Serious impact violations (axe) | **P1** — Fix before release |
| Color contrast failures on primary text | **P1** — WCAG AA violation |
| Form inputs without labels | **P1** — Screen reader failure |
| Missing landmark regions | **P2** — Navigation aid missing |
| Moderate impact violations | **P2** — Should fix |
| Minor impact violations | **P3** — Nice to fix |
| Incomplete results (needs manual review) | **P3** — Review during polish phase |

## Common Fixes Reference

| axe Rule ID | Common Fix |
|-------------|-----------|
| `color-contrast` | Adjust text color or background to meet 4.5:1 ratio |
| `label` | Add `<label for="id">` or `aria-label` to input |
| `heading-order` | Fix heading hierarchy (don't skip levels) |
| `region` | Wrap content in `<main>`, `<nav>`, `<section>` landmarks |
| `link-name` | Add text content or `aria-label` to links |
| `button-name` | Add text content or `aria-label` to buttons |
| `image-alt` | Add descriptive `alt` attribute to images |
| `landmark-one-main` | Add `<main>` element wrapping page content |
| `bypass` | Add skip-to-content link at page top |
