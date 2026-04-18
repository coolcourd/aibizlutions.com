# Accessibility Audit

Step-by-step procedure for verifying accessibility using Playwright's accessibility tree snapshots.

## Full Page Accessibility Snapshot

```bash
playwright-cli resize 1280 900
playwright-cli goto http://localhost:3000
playwright-cli snapshot
```

This outputs the full accessibility tree. Analyze it for the checks below.

## Heading Hierarchy

Take a snapshot and verify heading levels follow a logical order:

```bash
playwright-cli eval "Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => h.tagName + ': ' + h.textContent.trim().substring(0, 60)).join('\\n')"
```

**Expected hierarchy:**
- `H1`: Logo / site title (exactly one)
- `H2`: Hero heading
- `H3`: Section titles (Services, About, Process, Contact)
- `H4`: Card titles (service names, team member names)
- `H5`: Sub-items (value props, process steps)

**Verify:**
- [ ] Exactly one `<h1>` on the page
- [ ] No skipped levels (no h2 → h4 without h3 in between, within same section)
- [ ] Each section has an `<h3>` section title
- [ ] Headings describe content meaningfully

## Image Alt Text

```bash
playwright-cli eval "Array.from(document.querySelectorAll('img')).map(img => img.src.split('/').pop() + ' → alt: ' + (img.alt || 'MISSING')).join('\\n')"
```

**Verify:**
- [ ] Every `<img>` has an `alt` attribute
- [ ] `alt` text is descriptive (not just filenames)
- [ ] Logo image has meaningful alt text
- [ ] Team member photos have descriptive alt text
- [ ] Decorative images (if any) have `alt=""`

## Interactive Element Accessibility

Check all buttons and links have accessible names:

```bash
playwright-cli eval "Array.from(document.querySelectorAll('a, button')).map(el => el.tagName + ': ' + (el.getAttribute('aria-label') || el.textContent.trim().substring(0, 40) || 'NO NAME')).join('\\n')"
```

**Verify:**
- [ ] Every `<a>` and `<button>` has visible text or `aria-label`
- [ ] No empty links or buttons
- [ ] Icon-only buttons have `aria-label`

## Keyboard Navigation Test

Tab through the entire page and verify focus order:

```bash
playwright-cli goto http://localhost:3000

# Tab through interactive elements
playwright-cli press Tab
playwright-cli snapshot --depth=2
playwright-cli screenshot --filename=a11y-focus-1.png

playwright-cli press Tab
playwright-cli screenshot --filename=a11y-focus-2.png

playwright-cli press Tab
playwright-cli screenshot --filename=a11y-focus-3.png

# Continue tabbing through nav, hero CTAs, etc.
playwright-cli press Tab
playwright-cli screenshot --filename=a11y-focus-4.png

playwright-cli press Tab
playwright-cli screenshot --filename=a11y-focus-5.png
```

**Verify:**
- [ ] Focus indicator is visible on each element (outline or ring)
- [ ] Tab order follows visual layout (top → bottom, left → right)
- [ ] No keyboard traps (can always Tab forward)
- [ ] Skip-to-content link present (ideal but check)
- [ ] All interactive elements reachable via keyboard

## Modal Focus Trap

```bash
# Open a modal
playwright-cli click "#openStoryModal"
playwright-cli screenshot --filename=a11y-modal-open.png

# Tab within modal — focus should stay inside
playwright-cli press Tab
playwright-cli snapshot "#storyModal"
playwright-cli screenshot --filename=a11y-modal-focus-1.png

playwright-cli press Tab
playwright-cli screenshot --filename=a11y-modal-focus-2.png

# Escape should close
playwright-cli press Escape
playwright-cli screenshot --filename=a11y-modal-closed.png
```

**Verify:**
- [ ] Focus moves into modal when opened
- [ ] Tab cycling stays within modal (focus trap)
- [ ] Escape key closes modal
- [ ] Focus returns to trigger button after close

## Color Contrast Check

Use JavaScript to extract computed styles for key text/background combos:

```bash
# Hero section text on dark background
playwright-cli eval "(() => { const el = document.querySelector('#hero h2'); const s = getComputedStyle(el); return 'color: ' + s.color + ', bg: ' + getComputedStyle(document.querySelector('#hero')).backgroundColor; })()"

# Section dark text
playwright-cli eval "(() => { const el = document.querySelector('.section-dark .section-title'); const s = getComputedStyle(el); return 'color: ' + s.color + ', bg: ' + getComputedStyle(el.closest('.section-dark')).backgroundColor; })()"

# Body text on light background
playwright-cli eval "(() => { const el = document.querySelector('.service-description'); const s = getComputedStyle(el); return 'color: ' + s.color + ', bg: ' + getComputedStyle(el.closest('.section')).backgroundColor; })()"
```

**Verify against WCAG AA:**
- [ ] Normal text (< 18px or < 14px bold): contrast ratio ≥ 4.5:1
- [ ] Large text (≥ 18px or ≥ 14px bold): contrast ratio ≥ 3:1
- [ ] Light text on dark backgrounds (`.section-dark`): sufficient contrast
- [ ] Button text on button backgrounds: sufficient contrast
- [ ] Link text distinguishable from surrounding text

## Language Attribute

```bash
playwright-cli eval "document.documentElement.lang"
```

**Verify:**
- [ ] `<html>` has `lang="en"` attribute

## Form Accessibility

```bash
playwright-cli snapshot "#contact"

# Check for label associations
playwright-cli eval "Array.from(document.querySelectorAll('#contact input, #contact textarea, #contact select')).map(el => el.name + ' → label: ' + (el.labels?.length ? el.labels[0].textContent.trim() : el.getAttribute('aria-label') || 'NONE')).join('\\n')"
```

**Verify:**
- [ ] Every form input has an associated `<label>` or `aria-label`
- [ ] Labels are visible (not just `aria-label` with no visual)
- [ ] Required fields are indicated
- [ ] Error messages are associated with fields via `aria-describedby` or proximity

## ARIA Landmarks

```bash
playwright-cli eval "Array.from(document.querySelectorAll('header, nav, main, section, footer, [role]')).map(el => (el.getAttribute('role') || el.tagName.toLowerCase()) + (el.id ? '#' + el.id : '')).join('\\n')"
```

**Verify:**
- [ ] `<header>` present (banner landmark)
- [ ] `<nav>` present (navigation landmark)
- [ ] `<main>` present (main landmark) — or sections serve as main content
- [ ] `<footer>` present (contentinfo landmark)
- [ ] Sections have identifying headings or `aria-label`
