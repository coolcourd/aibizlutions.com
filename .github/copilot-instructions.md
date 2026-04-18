# AI Bizlutions Website — Copilot Architectural Memory File

> **This file is a binding contract.** GitHub Copilot must read and obey every rule here before making any code modification, generation, or refactor in this repository.

---

## 1. Project Overview

- **Type**: Static marketing website for AI Bizlutions LLC
- **Stack**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting**: GitHub Pages (custom domain via `CNAME`: `aibizlutions.com`)
- **Fonts**: Google Fonts (Poppins)
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
--primary-color: #0056b3;      /* Deep Blue — trust */
--secondary-color: #ff6b6b;    /* Bright Coral — action/accent */
--dark-bg: #1f2a41;            /* Dark Charcoal — professionalism */
--light-bg: #f4f7f9;
--text-color: #333;
--light-text: #ffffff;
--font-family: 'Poppins', sans-serif;
```

### Typography
- Font family: Poppins (weights: 300, 400, 600, 700)
- Heading hierarchy: `h2` (2.5em) > `h3` (1.8em) > `h4` > `h5`
- `.highlight` and `.brand-highlight` use `--primary-color` with `font-weight: 700`

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
- Images referenced from root (`logo-t.png`, `chase.jpeg`, `courd.jpg`, `favicon.png`)
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
