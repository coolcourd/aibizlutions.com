# Scroll Optimization — Condensation Playbook

A catalog of "tetris moves" for reducing scroll depth without removing content. Each move addresses a specific scroll-hog pattern identified by the UX-Tester.

Load this reference when the UX-Tester reports scroll depth issues. Match the **Scroll-Hog Pattern** name to the corresponding **Tetris Move** below.

---

## Move 1: Padding Crunch

**Fixes**: Excessive Section Padding, Excessive Card Padding

**Space saved**: ~15-25% per section

**Technique**: Reduce padding at mobile/tablet breakpoints. Desktop keeps generous spacing; mobile tightens aggressively.

```css
/* In @media (max-width: 992px) */
.section {
    padding: 50px 0;        /* was 80px 0 */
}

.service-card {
    padding: 25px 20px;     /* was 40px 30px */
}

/* In @media (max-width: 600px) */
.section {
    padding: 40px 0;        /* even tighter */
}

.service-card {
    padding: 20px 15px;
}
```

**Also crunch**: `margin-bottom` on `.section-title` (50px → 25px on mobile), gaps in grid containers, `.icon-wrapper` size (70px → 50px).

---

## Move 2: Horizontal Reflow

**Fixes**: Vertical Card Stack

**Space saved**: ~40-50% for card sections

**Technique**: Keep 2-column grid at tablet (768px) instead of collapsing to 1-column. Only go single-column at 600px or below.

```css
/* Change the stacking breakpoint from 992px to 600px */
/* In @media (max-width: 992px) — KEEP 2 columns */
.service-grid {
    grid-template-columns: repeat(2, 1fr);  /* was 1fr */
    gap: 20px;                               /* tighter gap */
}

/* Only stack at small mobile */
@media (max-width: 600px) {
    .service-grid {
        grid-template-columns: 1fr;          /* single column only here */
    }
}
```

**Also applies to**: `.about-content`, `.contact-grid`, `.value-props`, team photo grids — any multi-column layout that stacks too early.

---

## Move 3: Compact Card Variant

**Fixes**: Verbose Card Face, Icon Block Height

**Space saved**: ~30% per card

**Technique**: Switch from vertical card layout (icon above title above description) to horizontal (icon left, text right). Description truncated or collapsed.

```css
/* Compact card at mobile */
@media (max-width: 600px) {
    .service-card {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 15px;
        padding: 20px;
    }

    .icon-wrapper {
        width: 50px;
        height: 50px;
        min-width: 50px;      /* prevent shrink */
        border-radius: 12px;
    }

    .service-card .icon {
        font-size: 1.5em;     /* was 2.2em */
    }

    .service-card h4 {
        font-size: 1.2em;     /* was 1.5em */
        margin-bottom: 8px;
    }

    .service-description {
        font-size: 0.9em;
        line-height: 1.5;
        /* Optional: clamp to 2 lines */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
```

---

## Move 4: Accordion Collapse

**Fixes**: Verbose Card Face, Benefit List Spread

**Space saved**: ~50-60% for verbose sections

**Technique**: Use native `<details>/<summary>` to hide card details behind a tap. Title and icon visible; benefits/description expand on tap.

```html
<div class="service-card animate-on-scroll">
    <div class="card-header-compact">
        <div class="icon-wrapper">
            <i class="fi fi-sr-brain-circuit icon"></i>
        </div>
        <h4>Card Title</h4>
    </div>
    <details class="card-details">
        <summary>Learn more</summary>
        <p class="service-description">Full description...</p>
        <ul class="service-benefits">...</ul>
    </details>
</div>
```

```css
.card-details summary {
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    padding: 8px 0;
    font-size: 0.9em;
}

.card-details[open] summary {
    margin-bottom: 10px;
}
```

**Trade-off**: Content requires a tap to see. Use only when scroll savings are critical and the details are secondary.

---

## Move 5: Two-Column Form

**Fixes**: Full-Height Form

**Space saved**: ~30% on form sections

**Technique**: Place short fields (name, email, phone) side by side in a 2-column grid at tablet+.

```css
@media (min-width: 768px) {
    .contact-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
    }

    /* Full-width fields */
    .form-group:has(textarea),
    .form-group:last-of-type,
    .btn-submit {
        grid-column: 1 / -1;
    }
}
```

**Note**: Textarea and submit button always span full width. Only short inputs go side-by-side.

---

## Move 6: Section Merging

**Fixes**: Repeated sections with similar themes

**Space saved**: ~150-250px per merge (eliminates duplicate heading + padding)

**Technique**: Combine two related sections into one section with sub-layouts. For example, merge "About" and "Team" into a single section.

```html
<!-- BEFORE: Two sections with separate padding -->
<section id="about" class="section section-dark">
    <div class="container">
        <h3 class="section-title">About Us</h3>
        <!-- about content -->
    </div>
</section>
<section id="team" class="section">
    <div class="container">
        <h3 class="section-title">Our Team</h3>
        <!-- team content -->
    </div>
</section>

<!-- AFTER: One section, sub-headings -->
<section id="about" class="section section-dark">
    <div class="container">
        <h3 class="section-title">About Us</h3>
        <!-- about content -->
        <h4 class="subsection-title">Our Team</h4>
        <!-- team content -->
    </div>
</section>
```

**Trade-off**: Loses the light/dark alternation for the merged section. Best when both sections share the same theme or tone.

---

## Move 7: Image Compression

**Fixes**: Stacked Photos, Oversized Images

**Space saved**: ~20-40% on image-heavy sections

**Technique**: Constrain image container height and use `object-fit: cover` to crop gracefully.

```css
@media (max-width: 992px) {
    .team-photo {
        max-height: 200px;     /* was unconstrained */
        overflow: hidden;
    }

    .team-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;  /* keep faces visible */
    }
}

@media (max-width: 600px) {
    .team-photo {
        max-height: 150px;
    }
}
```

**Also**: Use smaller `width` attribute on `<img>` tags at mobile if aspect ratio is extreme.

---

## Move 8: Inline Value Props

**Fixes**: Value prop cards taking full rows

**Space saved**: ~50% for value prop sections

**Technique**: Replace stacked value prop cards with horizontal inline badges/chips.

```css
@media (max-width: 992px) {
    .value-props {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }

    .value-prop {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        flex: 0 1 auto;
    }

    .value-prop h5 {
        font-size: 0.85em;
        margin: 0;
    }

    .value-prop p {
        display: none;  /* Hide description, keep title only */
    }

    .value-prop i {
        font-size: 1em;
    }
}
```

**Trade-off**: Loses the description text under each value prop. Title + icon only.

---

## Move 9: Typography Tightening

**Fixes**: Heading + Subtitle Gap, general vertical bloat

**Space saved**: ~10-15% cumulative across page

**Technique**: Reduce margins, line-heights, and font sizes at mobile.

```css
@media (max-width: 992px) {
    .section-title {
        font-size: 1.8em;          /* was 2.2em */
        margin-bottom: 25px;       /* was 50px */
    }

    .section-subtitle,
    .section-subtitle-light {
        margin-bottom: 30px;       /* was 50px */
        font-size: 1.1em;         /* was 1.3em */
    }

    h4 {
        margin-bottom: 10px;       /* was 0.8em (~15px) */
    }
}

@media (max-width: 600px) {
    .section-title {
        font-size: 1.5em;
        margin-bottom: 20px;
    }

    .service-description {
        line-height: 1.5;          /* was 1.7 */
        font-size: 0.9em;
    }

    .service-benefits li {
        padding: 5px 0;            /* was 8px 0 */
        font-size: 0.85em;
    }
}
```

---

## Move 10: CTA Consolidation

**Fixes**: Repeated CTAs

**Space saved**: ~80-120px per removed CTA

**Technique**: Remove mid-page CTAs that duplicate the nav CTA or hero CTA. Rely on the sticky nav "Get Started" link and a single bottom-of-page CTA.

**Decision rule**: Keep CTAs only at:
1. Hero section (primary entry point)
2. Contact section (final conversion)
3. Navigation bar (always visible)

Remove "Ready for Transformation?" buttons between sections unless they serve a distinct purpose.

---

## Choosing Moves — Decision Matrix

| Scroll-Hog Pattern | Best Move | Runner-Up |
|-------------------|-----------|-----------|
| Vertical Card Stack | Move 2: Horizontal Reflow | Move 3: Compact Card |
| Excessive Section Padding | Move 1: Padding Crunch | Move 9: Typography Tightening |
| Excessive Card Padding | Move 1: Padding Crunch | Move 3: Compact Card |
| Verbose Card Face | Move 4: Accordion Collapse | Move 3: Compact Card |
| Stacked Photos | Move 7: Image Compression | Move 2: Horizontal Reflow |
| Oversized Images | Move 7: Image Compression | — |
| Full-Height Form | Move 5: Two-Column Form | — |
| Repeated CTAs | Move 10: CTA Consolidation | — |
| Bloated Whitespace | Move 1: Padding Crunch | Move 9: Typography Tightening |
| Heading + Subtitle Gap | Move 9: Typography Tightening | — |
| Benefit List Spread | Move 9: Typography Tightening | Move 4: Accordion Collapse |
| Icon Block Height | Move 3: Compact Card | Move 1: Padding Crunch |

## Combining Moves

Moves stack. For maximum scroll reduction on a section:
1. Start with **Move 1** (Padding Crunch) — easiest, no layout change
2. Add **Move 9** (Typography Tightening) — subtle, cumulative
3. Then **Move 2** (Horizontal Reflow) if cards are stacking too early
4. Then **Move 3** (Compact Card) or **Move 4** (Accordion) for the most aggressive condensation

**Target**: Each move applied should measurably reduce the section height. Re-measure after each change to confirm progress.
