# AI Bizlutions Website — Copilot Architectural Memory File

> **This file is a binding contract.** GitHub Copilot must read and obey every rule here before making any code modification, generation, or refactor in this repository.

---

## 1. Project Overview

- **Type**: Static marketing website for AI Bizlutions LLC
- **Stack**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting**: GitHub Pages (custom domain via `CNAME`: `aibizlutions.com`)
- **Fonts**: Google Fonts (Inter — body/UI, Baloo 2 800 — wordmark/display)
- **Icons**: Flaticon UIcons (solid-rounded, regular-rounded)
- **No build tools**: No bundler, no preprocessor — files served as-is

---

## 2. File Structure

| File | Purpose |
|------|---------|
| `index.html` | Main landing page (hero, services, about, process, contact, footer) |
| `style.css` | All site styles — CSS custom properties in `:root` |
| `script.js` | All site JavaScript — mobile menu, scroll animations, parallax, modals |
| `CNAME` | GitHub Pages custom domain config |
| `privacy-policy/index.html` | Privacy policy page |

---

## 3. Design System

### CSS Custom Properties (`:root`)
```css
/* Locked Bo Botty / AI Bizlutions palette (2026). No purple/violet/indigo. */
--bo-sky: #0EA5E9;             /* Primary brand accent — CTAs, links */
--bo-sky-deep: #0284C7;        /* Hover / pressed state */
--bo-cyan: #22D3EE;            /* Eye glow / highlight accents */
--bo-ink: #0B1220;             /* Body text on light */
--bo-navy: #0F172A;            /* Dark sections, header, footer */
--bo-white: #FFFFFF;           /* Bo's shell, light surfaces */

/* Legacy aliases — mapped to the locked palette so existing rules auto-rebrand. */
--primary-color: var(--bo-sky);
--secondary-color: var(--bo-sky);
--dark-bg: var(--bo-navy);
--light-bg: var(--bo-white);
--text-color: var(--bo-ink);
--light-text: #ffffff;
--font-family: 'Inter', sans-serif;
--font-display: 'Baloo 2', var(--font-family);
```

### Typography
- Font family: Inter (400/500/600/700/800) for body + UI. Baloo 2 800 reserved for the wordmark and hero display headlines (`--font-display`).
- Heading hierarchy: `h1` is the hero/page headline (`.hero-headline`); the site logo is an `<a class="logo">` (not an `<h1>`). Then `h2` (2.5em) > `h3` (1.8em) > `h4` > `h5`.
- `.highlight` uses the locked wordmark treatment: white fill + sky stroke (`-webkit-text-stroke`, `paint-order: stroke fill`).

### Buttons
- `.btn-primary` — filled primary style
- `.btn-secondary` — outlined/secondary style
- `.btn-secondary-light` — light variant for dark sections
- `.cta-nav-link` — CTA in navigation

### Layout
- `.container` — max-width 1200px, centered with auto margins, 20px horizontal padding
- Sections alternate between light (`--light-bg`) and dark (`--dark-bg`) backgrounds
- `.section-dark` uses light text

### Animation
- `.animate-on-scroll` — IntersectionObserver-driven fade-in/slide-up
- `.delay-1`, `.delay-2` — staggered animation delays
- Hero parallax via scroll listener

---

## 4. JavaScript Patterns

### DOM Ready
All JS runs inside `document.addEventListener('DOMContentLoaded', () => { ... })`.

### Mobile Menu
- Toggle button: `#mobile-menu`
- Nav menu: `#nav-menu`
- Toggles `.active` class; swaps hamburger ↔ close icon

### Scroll Animation
- Uses `IntersectionObserver` with `threshold: 0.1`
- Adds `.is-visible` class on intersection
- Each element observed once (unobserved after trigger)

### Modals
- Modal elements: `#storyModal`, `#chaseModal`, `#courdModal`
- Open buttons: `#openStoryModal`, `#openChaseModal`, `#openCourdModal`
- Close via `.modal-close` buttons, backdrop click, or Escape key
- Body scroll locked when modal open (`overflow: hidden`)

---

## 5. Conventions

### Code Style
- No build step — all code must work directly in the browser
- Use `const` / `let`, never `var`
- Use template literals for string interpolation
- CSS: use custom properties from `:root` — never hardcode colors
- Semantic HTML: use appropriate elements (`<header>`, `<nav>`, `<section>`, `<footer>`)

### Adding New Sections
1. Add HTML section in `index.html` following the existing pattern (section with id, container, section-title)
2. Add styles in `style.css` following the existing naming conventions
3. Add any interactivity in `script.js` inside the DOMContentLoaded handler
4. Add nav link if the section should be navigable

### Images & Assets
- Images referenced from root: brand kit (`bo-botty-wordmark.svg`, `bo-mascot-full.svg`, `bo-reveal.svg`, `bo-head-sad.svg`, `bo-botty.svg`, `ai-bizlutions.svg`, `favicon.svg`, `og-image.png`) + team photos (`chase.jpeg`, `courd.jpg`). The old `logo-t.png` / `favicon.png` raster files are retired — never re-introduce. The full source brand kit lives in the main app repo at `AI-Bizlutions-/public/Assets/Logos/`.
- All images need `alt` text
- Use `width` attribute on `<img>` where appropriate for layout stability

### Accessibility
- All interactive elements must be keyboard accessible
- Color contrast must meet WCAG AA (4.5:1 normal text, 3:1 large text)
- Form inputs must have associated labels
- Modals must trap focus and respond to Escape key

### Performance
- No unnecessary dependencies — vanilla JS only
- Minimize DOM queries — cache selectors
- Use passive event listeners for scroll handlers where possible
- Lazy load images below the fold when applicable
