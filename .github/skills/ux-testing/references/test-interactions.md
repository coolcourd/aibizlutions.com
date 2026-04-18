# Interaction & Click Flow Tests

Step-by-step procedure for testing all interactive elements on the AI Bizlutions site.

## Navigation Links (Desktop)

Test each nav link scrolls to the correct section:

```bash
playwright-cli resize 1280 900
playwright-cli goto http://localhost:3000

# Click "Solutions" nav link
playwright-cli click "a[href='#services']"
playwright-cli snapshot "#services"
playwright-cli screenshot --filename=nav-services.png

# Click "About Us" nav link
playwright-cli click "a[href='#about']"
playwright-cli snapshot "#about"
playwright-cli screenshot --filename=nav-about.png

# Click "Process" nav link
playwright-cli click "a[href='#process']"
playwright-cli snapshot "#process"
playwright-cli screenshot --filename=nav-process.png

# Click "Get Started" CTA nav link
playwright-cli click "a[href='#contact']"
playwright-cli snapshot "#contact"
playwright-cli screenshot --filename=nav-contact.png
```

**Verify:**
- [ ] Each click scrolls smoothly to the target section
- [ ] Target section is visible in viewport after click
- [ ] No broken anchor links (section exists with matching id)

## Hero CTA Buttons

```bash
playwright-cli goto http://localhost:3000

# Click "Book Your Free Consult"
playwright-cli click "a.btn-primary[href='#contact']"
playwright-cli screenshot --filename=hero-cta-consult.png

# Go back to top and click "See Our Solutions"
playwright-cli goto http://localhost:3000
playwright-cli click "a.btn-secondary[href='#services']"
playwright-cli screenshot --filename=hero-cta-solutions.png
```

**Verify:**
- [ ] Both buttons scroll to correct sections
- [ ] Buttons have visible hover/focus states

## Mobile Hamburger Menu

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000

# Verify hamburger is visible
playwright-cli snapshot "#mobile-menu"
playwright-cli screenshot --filename=mobile-menu-closed.png

# Open hamburger menu
playwright-cli click "#mobile-menu"
playwright-cli screenshot --filename=mobile-menu-open.png

# Verify menu items are visible
playwright-cli snapshot "#nav-menu"

# Click a menu link — menu should close
playwright-cli click "#nav-menu a[href='#services']"
playwright-cli screenshot --filename=mobile-menu-after-link-click.png

# Reopen and verify icon swap
playwright-cli click "#mobile-menu"
playwright-cli screenshot --filename=mobile-menu-reopened.png
```

**Verify:**
- [ ] Hamburger icon (☰) visible on mobile
- [ ] Clicking hamburger opens nav menu with `.active` class
- [ ] Icon swaps to close (✖) when open
- [ ] Menu items are large enough to tap (≥ 44px height)
- [ ] Clicking a link closes the menu
- [ ] Icon swaps back to hamburger after close

## Modal Testing — Story Modal

```bash
playwright-cli resize 1280 900
playwright-cli goto http://localhost:3000

# Scroll to about section
playwright-cli click "a[href='#about']"

# Open story modal
playwright-cli click "#openStoryModal"
playwright-cli screenshot --filename=modal-story-open.png
playwright-cli snapshot "#storyModal"

# Test close via X button
playwright-cli click ".modal-close"
playwright-cli screenshot --filename=modal-story-closed-x.png

# Reopen and test close via Escape key
playwright-cli click "#openStoryModal"
playwright-cli press Escape
playwright-cli screenshot --filename=modal-story-closed-escape.png

# Reopen and test close via backdrop click
playwright-cli click "#openStoryModal"
playwright-cli click "#storyModal"
playwright-cli screenshot --filename=modal-story-closed-backdrop.png
```

**Verify:**
- [ ] Modal opens with content visible
- [ ] Body scroll is locked when modal open (overflow: hidden)
- [ ] Close via X button works
- [ ] Close via Escape key works
- [ ] Close via backdrop click works
- [ ] Body scroll unlocks after modal close

## Modal Testing — Chase Modal

```bash
playwright-cli click "a[href='#about']"
playwright-cli click "#openChaseModal"
playwright-cli screenshot --filename=modal-chase-open.png
playwright-cli snapshot "#chaseModal"

# Close via X
playwright-cli click "#chaseModal .modal-close"
playwright-cli screenshot --filename=modal-chase-closed.png
```

**Verify:** Same checks as Story Modal.

## Modal Testing — Courd Modal

```bash
playwright-cli click "a[href='#about']"
playwright-cli click "#openCourdModal"
playwright-cli screenshot --filename=modal-courd-open.png
playwright-cli snapshot "#courdModal"

# Close via X
playwright-cli click "#courdModal .modal-close"
playwright-cli screenshot --filename=modal-courd-closed.png
```

**Verify:** Same checks as Story Modal.

## Modal Testing on Mobile

Repeat modal tests at mobile viewport:

```bash
playwright-cli resize 375 812
playwright-cli goto http://localhost:3000

# Scroll to about and open story modal
playwright-cli eval "document.getElementById('about').scrollIntoView()"
playwright-cli click "#openStoryModal"
playwright-cli screenshot --filename=modal-story-mobile.png

# Verify modal is readable and scrollable on mobile
playwright-cli snapshot "#storyModal .modal-content"
playwright-cli click ".modal-close"
```

**Verify:**
- [ ] Modal fits mobile viewport (no horizontal overflow)
- [ ] Modal content is scrollable if longer than viewport
- [ ] Close button easily tappable on mobile
- [ ] Text readable at mobile size

## Scroll Animation Testing

```bash
playwright-cli resize 1280 900
playwright-cli goto http://localhost:3000

# Screenshot before scrolling (elements should NOT have .is-visible)
playwright-cli screenshot --filename=scroll-anim-before.png

# Scroll to services section to trigger animations
playwright-cli eval "document.getElementById('services').scrollIntoView({behavior: 'instant'})"

# Wait briefly for IntersectionObserver to fire
playwright-cli eval "new Promise(r => setTimeout(r, 500))"
playwright-cli screenshot --filename=scroll-anim-services-after.png

# Check if .is-visible was added
playwright-cli eval "document.querySelectorAll('.animate-on-scroll.is-visible').length"
```

**Verify:**
- [ ] Elements below fold start without `.is-visible` class
- [ ] Scrolling into view adds `.is-visible` class
- [ ] Animation is visible (opacity/transform transition)
- [ ] Staggered delays (`.delay-1`, `.delay-2`) create sequential reveal

## Contact Form Testing

```bash
playwright-cli click "a[href='#contact']"
playwright-cli snapshot "#contact"
playwright-cli screenshot --filename=contact-form.png

# Test tab order through form fields
playwright-cli press Tab
playwright-cli screenshot --filename=contact-form-focus-1.png
playwright-cli press Tab
playwright-cli screenshot --filename=contact-form-focus-2.png
```

**Verify:**
- [ ] Form fields have visible labels
- [ ] Tab order is logical (name → email → message → submit)
- [ ] Focus indicators visible on active field
- [ ] Submit button is keyboard accessible
