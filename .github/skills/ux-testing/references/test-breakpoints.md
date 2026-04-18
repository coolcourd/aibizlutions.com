# Breakpoint Visual Audit

Step-by-step procedure for testing visual layout at all three breakpoints.

## Setup

Ensure the browser is open and navigated to the site:
```bash
playwright-cli open http://localhost:3000 --headed
```

## Desktop Audit (xl ≥ 1280px)

```bash
playwright-cli resize 1280 900
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=breakpoint-desktop-1280.png
```

**Check each section by scrolling:**
```bash
# Hero section
playwright-cli snapshot "#hero"
playwright-cli screenshot --filename=desktop-hero.png

# Services section
playwright-cli click "a[href='#services']"
playwright-cli screenshot --filename=desktop-services.png

# About section
playwright-cli click "a[href='#about']"
playwright-cli screenshot --filename=desktop-about.png

# Process section
playwright-cli click "a[href='#process']"
playwright-cli screenshot --filename=desktop-process.png

# Contact section
playwright-cli click "a[href='#contact']"
playwright-cli screenshot --filename=desktop-contact.png
```

**Verify at desktop:**
- [ ] Navigation bar shows all links horizontally (no hamburger)
- [ ] Hero content centered, CTA buttons side by side
- [ ] Service cards in 3-column grid
- [ ] About section: text + team photos side by side
- [ ] Process steps visible in row/grid layout
- [ ] Contact form properly sized, not stretched full width
- [ ] Footer content aligned properly
- [ ] No horizontal scrollbar

## Tablet Audit (md 768–1279px)

```bash
playwright-cli resize 768 1024
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=breakpoint-tablet-768.png
```

**Scroll through and screenshot each section:**
```bash
playwright-cli click "a[href='#services']"
playwright-cli screenshot --filename=tablet-services.png

playwright-cli click "a[href='#about']"
playwright-cli screenshot --filename=tablet-about.png

playwright-cli click "a[href='#contact']"
playwright-cli screenshot --filename=tablet-contact.png
```

**Verify at tablet:**
- [ ] Navigation may show hamburger or condense — verify it works
- [ ] Service cards: 2-column or stacked, not overflowing
- [ ] About section: may stack vertically — verify readability
- [ ] Team photos properly sized
- [ ] Form fields usable at this width
- [ ] No horizontal overflow on any section
- [ ] Text remains readable (≥ 14px body text)

## Mobile Audit (sm < 768px)

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000
playwright-cli screenshot --filename=breakpoint-mobile-375.png
```

**Critical mobile checks:**
```bash
# Verify hero CTA visible above fold
playwright-cli snapshot "#hero"
playwright-cli screenshot --filename=mobile-hero.png

# Scroll to services
playwright-cli eval "document.getElementById('services').scrollIntoView()"
playwright-cli screenshot --filename=mobile-services.png

# Scroll to about
playwright-cli eval "document.getElementById('about').scrollIntoView()"
playwright-cli screenshot --filename=mobile-about.png

# Scroll to contact
playwright-cli eval "document.getElementById('contact').scrollIntoView()"
playwright-cli screenshot --filename=mobile-contact.png
```

**Verify at mobile:**
- [ ] Hamburger menu icon visible (not full nav)
- [ ] Hero heading readable, not clipped
- [ ] Hero CTA buttons stacked or full-width
- [ ] Service cards stack to single column
- [ ] Team photos stack vertically
- [ ] No horizontal scroll (check with `playwright-cli eval "document.documentElement.scrollWidth > document.documentElement.clientWidth"`)
- [ ] Touch targets ≥ 44x44px (buttons, links, menu items)
- [ ] Body text ≥ 16px
- [ ] Padding reduced from desktop values
- [ ] Images scale down, don't overflow

## Horizontal Overflow Check (All Breakpoints)

Run at each viewport size:
```bash
playwright-cli eval "document.documentElement.scrollWidth > document.documentElement.clientWidth"
```

If `true` → **P1 issue**: horizontal scroll present. Screenshot the overflow:
```bash
playwright-cli screenshot --filename=issue-horizontal-overflow-{breakpoint}.png
```

## Comparison

After collecting all screenshots, compare:
1. Desktop → Tablet: Layout gracefully condenses
2. Tablet → Mobile: Columns stack, nav collapses, padding tightens
3. No content is lost between breakpoints — only rearranged
