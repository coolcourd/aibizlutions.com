# CSS Patterns

Complete CSS class inventory and patterns used on the AI Bizlutions site. When adding new styles, follow these conventions exactly.

## Custom Properties (`:root`)

```css
:root {
    --primary-color: #0056b3;      /* Deep Blue — trust, headings, links */
    --secondary-color: #ff6b6b;    /* Bright Coral — CTAs, action, accents */
    --dark-bg: #1f2a41;            /* Dark Charcoal — dark sections, header */
    --light-bg: #f4f7f9;           /* Light gray — light section backgrounds */
    --text-color: #333;            /* Body text on light backgrounds */
    --light-text: #ffffff;         /* Text on dark backgrounds */
    --font-family: 'Poppins', sans-serif;
}
```

**Rule**: Never hardcode hex values. Always use `var(--token-name)`.

## Layout Classes

| Class | Purpose | Key styles |
|-------|---------|-----------|
| `.container` | Centered content wrapper | `max-width: 1200px; margin: 0 auto; padding: 0 20px` |
| `.section` | Section padding | `padding: 80px 0` |
| `.section-dark` | Dark background section | `background: var(--dark-bg); color: var(--light-text)` |
| `.center-text` | Center-align a block | `text-align: center` |

## Typography Classes

| Class | Purpose | Key styles |
|-------|---------|-----------|
| `.section-title` | Section heading | `text-align: center; margin-bottom: 50px; font-size: 2.2em` |
| `.section-subtitle` | Subtitle on light bg | `text-align: center; font-size: 1.3em; color: #666; max-width: 700px` |
| `.section-subtitle-light` | Subtitle on dark bg | Same but `color: rgba(255,255,255,0.8)` |
| `.highlight` | Emphasized text | `color: var(--primary-color); font-weight: 700` |
| `.brand-highlight` | Brand emphasis | Same as `.highlight` |

## Button Classes

```css
/* Base — always include .btn */
.btn {
    display: inline-block;
    padding: 12px 25px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    text-align: center;
}

/* Variants — add alongside .btn */
.btn-primary     → Coral filled (--secondary-color bg, white text)
.btn-secondary   → Blue outlined (transparent bg, --primary-color border + text)
.btn-secondary-light → White outlined for dark sections (transparent bg, white border)

/* Modifiers */
.btn-large       → Bigger: padding 15px 35px, font-size 1.1em
.btn-submit      → For form submit buttons (same as primary + loading state)
```

**Hover behaviors:**
- `.btn-primary:hover` → Lighter coral + box-shadow glow
- `.btn-secondary:hover` → Fills with `--primary-color`, text turns white
- `.btn-secondary-light:hover` → Subtle white bg overlay, border solidifies

## Card Classes

### Service Card

```css
.service-grid → display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px
.service-card → white bg, padding 40px 30px, border-radius 16px, box-shadow, hover lift
.icon-wrapper → 70x70px rounded square, gradient blue bg, centers icon
.service-card .icon → 2.2em, --primary-color (turns white on card hover)
.service-description → color #555, line-height 1.7
.service-benefits → list-style none
.service-benefits li → flex, align-items center, gap 10px
.benefit-icon → color --secondary-color
```

**Hover effect**: Card lifts (`translateY(-10px)`), blue border appears, gradient top-bar scales in via `::before`.

### Contact Card

```css
.contact-card → dark bg, rounded, padding
.contact-card-header → flex, icon + title
.contact-item → flex, icon + label/value stack, hover highlight
```

## Animation Classes

```css
.animate-on-scroll → opacity: 0; transform: translateY(20px); transition: 0.6s ease-out
.is-visible        → opacity: 1; transform: translateY(0)  /* Added by JS */
.delay-1           → transition-delay: 0.1s
.delay-2           → transition-delay: 0.2s
.delay-3           → transition-delay: 0.3s
```

**No JS changes needed** — the existing `IntersectionObserver` automatically finds all `.animate-on-scroll` elements.

## Modal Classes

```css
.modal          → fixed fullscreen overlay, z-index 9999, dark semi-transparent bg
.modal-content  → white bg, centered, max-width 800px, max-height 80vh, overflow-y auto
.modal-close    → float right, 32px font, cursor pointer, hovers to --secondary-color
.modal-body p   → color #555, line-height 1.8
.modal-body strong → color --primary-color
```

**Animations**: `.modal` uses `fadeIn`, `.modal-content` uses `slideDown` keyframes.

## Form Classes

```css
.contact-form  → bg white, padding, border-radius, box-shadow
.form-group    → margin-bottom, contains label + input
.form-group label → flex, align-items center, gap, font-weight 600, color --dark-bg
.form-group input, select, textarea → full width, padding, border, border-radius, font-family
.form-group input:focus → border-color --primary-color, box-shadow blue glow
.btn-submit    → same as .btn-primary, with .is-loading state
.form-success-message → centered text, success icon, hidden by default
```

## Responsive Breakpoints

### Breakpoint 1: `@media (max-width: 992px)`

Key changes:
- `.container` → padding reduces to `0 15px`
- `#nav-menu` → hidden, becomes vertical dropdown on `.active`
- `.menu-toggle` → `display: block` (hamburger visible)
- `.service-grid` → `grid-template-columns: 1fr` (single column)
- `.about-content` → `grid-template-columns: 1fr` (stacks)
- `.contact-grid` → `grid-template-columns: 1fr` (stacks)
- `.hero-section` → centered text, reduced font size

### Breakpoint 2: `@media (max-width: 600px)`

Key changes:
- Hero h2 → `font-size: 2.2em`
- `.hero-cta-group` → `flex-direction: column; align-items: stretch` (buttons stack)
- `.hero-cta-group .btn` → `width: 100%`
- `.service-card` → `padding: 30px 20px` (tighter)
- `.modal-content` → `padding: 20px; margin: 15% auto`
- `.contact-form` → `padding: 25px 20px`

### Adding New Responsive Rules

When creating a new component, add responsive overrides inside the **existing** media query blocks — don't create new `@media` blocks:

```css
/* Find the existing block at bottom of style.css */
@media (max-width: 992px) {
    /* Add your tablet rules here */
    .new-component {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    /* Add your mobile rules here */
    .new-component {
        padding: 20px;
    }
}
```

## Naming Conventions

- Sections: `#section-name` with class `.section-name-section` (e.g., `#services` → `.services-section`)
- Grid containers: `.{thing}-grid` (e.g., `.service-grid`, `.contact-grid`)
- Cards: `.{thing}-card` (e.g., `.service-card`, `.contact-card`)
- Subtitles: `.section-subtitle` (light bg) or `.section-subtitle-light` (dark bg)
- Icons: always prefixed with `fi fi-sr-` (solid) or `fi fi-rr-` (regular)
