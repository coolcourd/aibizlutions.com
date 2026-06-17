---
name: site-patterns
description: "Code pattern library for the AI Bizlutions static site. Use when: implementing new sections, adding components, creating modals, wiring animations, building forms, or following the design system. Contains HTML templates, CSS class inventory, JS interaction patterns, and responsive breakpoint rules."
---

# Site Patterns — AI Bizlutions

Canonical code patterns for the AI Bizlutions marketing site. Load this skill before writing any HTML, CSS, or JS to ensure consistency with existing code.

## When to Use

- Adding a new section to `index.html`
- Creating card components, modals, or forms
- Wiring scroll animations or interactive behavior
- Writing responsive CSS
- Choosing button styles or color tokens

## Quick Reference

| Pattern | Reference |
|---------|-----------|
| Section skeletons, cards, modals, forms | [HTML Templates](./references/html-templates.md) |
| CSS classes, custom properties, breakpoints | [CSS Patterns](./references/css-patterns.md) |
| Modals, observers, event listeners, forms | [JS Patterns](./references/js-patterns.md) |
| Scroll depth condensation moves | [Scroll Optimization](./references/scroll-optimization.md) |

## Design Tokens (CSS Custom Properties)

Always use these — never hardcode colors:

| Token | Value | Usage |
|-------|-------|-------|
| `--bo-sky` | `#0EA5E9` | Primary brand accent — CTAs, links, button fill |
| `--bo-sky-deep` | `#0284C7` | Hover / pressed state for `--bo-sky` |
| `--bo-cyan` | `#22D3EE` | Eye glow / highlight accents |
| `--bo-ink` | `#0B1220` | Body text on light, contours |
| `--bo-navy` | `#0F172A` | Dark sections, header, footer |
| `--bo-white` | `#FFFFFF` | Bo's shell, light surfaces |
| `--font-family` | `'Inter', sans-serif` | Body + UI |
| `--font-display` | `'Baloo 2', …` | Wordmark + hero display text |

Legacy aliases (`--primary-color`, `--secondary-color`, `--dark-bg`, `--light-bg`, `--text-color`) are mapped to the locked palette in `:root`. New code should prefer `--bo-*` names. **Never** introduce purple / violet / indigo.

## Button Decision Tree

| Context | Class | Look |
|---------|-------|------|
| Primary CTA on light background | `.btn .btn-primary` | Sky filled (`--bo-sky`), sky-deep on hover |
| Secondary action on light background | `.btn .btn-secondary` | Sky outlined |
| Action on dark (`.section-dark`) background | `.btn .btn-secondary-light` | White outlined |
| Navigation CTA | `.cta-nav-link` | Highlighted nav link |
| Larger emphasis | Add `.btn-large` | Bigger padding |

**Rule**: Maximum one `.btn-primary` per visual section.

## Section Pattern

Sections alternate light/dark backgrounds for visual rhythm:

```
Light section  → class="section"
Dark section   → class="section section-dark"
```

Every section follows this skeleton:
```html
<section id="section-name" class="section [section-dark]">
    <div class="container">
        <h3 class="section-title animate-on-scroll">Title</h3>
        <p class="section-subtitle animate-on-scroll">Subtitle</p>
        <!-- content -->
    </div>
</section>
```

## Animation Wiring

Add `.animate-on-scroll` to any element that should fade in on scroll. The existing `IntersectionObserver` in `script.js` handles it automatically — no JS changes needed.

For staggered reveals, add delay classes:
- `.delay-1` → 0.1s delay
- `.delay-2` → 0.2s delay  
- `.delay-3` → 0.3s delay

## Icon System

| Style | Class prefix | Usage |
|-------|-------------|-------|
| Solid rounded | `fi fi-sr-{name}` | Primary icons in cards, features |
| Regular rounded | `fi fi-rr-{name}` | Secondary icons, benefit lists, form labels |

Browse icons at: Flaticon UIcons (solid-rounded, regular-rounded sets)

## Responsive Breakpoints

| Breakpoint | Max-width | What changes |
|-----------|-----------|-------------|
| Tablet/large mobile | `992px` | Nav collapses to hamburger, grids stack to 1-col, hero centers |
| Small mobile | `600px` | Hero CTAs stack vertically, card padding reduces, modal padding reduces |

## File Locations

| What | Where |
|------|-------|
| HTML structure | `index.html` |
| All styles | `style.css` |
| All JS | `script.js` (inside `DOMContentLoaded` handler) |
| Privacy policy | `privacy-policy/index.html` |

## Checklist Before Handoff

After implementing, verify:
- [ ] Colors use CSS custom properties (no hardcoded hex)
- [ ] New elements have `.animate-on-scroll` where appropriate
- [ ] Images have `alt` text
- [ ] Interactive elements are keyboard accessible
- [ ] New sections follow the section skeleton pattern
- [ ] Responsive behavior works at both breakpoints
- [ ] JS is inside the `DOMContentLoaded` handler
- [ ] No `var` — only `const`/`let`
