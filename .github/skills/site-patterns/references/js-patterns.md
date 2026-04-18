# JS Patterns

All JavaScript patterns used on the AI Bizlutions site. All code lives in `script.js` inside a single `DOMContentLoaded` handler.

## File Structure

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    // 2. Scroll Animation (IntersectionObserver)
    // 3. Hero Parallax
    // 4. Modal Functionality
    // 5. Contact Form Submission
    // --- Add new code here, before closing }) ---
});
```

**Rule**: All new JS goes inside this handler. Do not create a second `DOMContentLoaded` listener.

## Adding a New Modal

The existing modal system uses object maps. To add a new modal:

### Step 1: Add to the `modals` object

Find this block in `script.js`:
```javascript
const modals = {
    story: document.getElementById('storyModal'),
    chase: document.getElementById('chaseModal'),
    courd: document.getElementById('courdModal')
};
```

Add your new modal:
```javascript
const modals = {
    story: document.getElementById('storyModal'),
    chase: document.getElementById('chaseModal'),
    courd: document.getElementById('courdModal'),
    newname: document.getElementById('newnameModal')  // ← add here
};
```

### Step 2: Add to the `openButtons` object

Find this block:
```javascript
const openButtons = {
    story: document.getElementById('openStoryModal'),
    chase: document.getElementById('openChaseModal'),
    courd: document.getElementById('openCourdModal')
};
```

Add the trigger button:
```javascript
const openButtons = {
    story: document.getElementById('openStoryModal'),
    chase: document.getElementById('openChaseModal'),
    courd: document.getElementById('openCourdModal'),
    newname: document.getElementById('openNewnameModal')  // ← add here
};
```

**That's it.** The existing open/close/backdrop/Escape handlers iterate over these objects automatically. No additional event listener code needed.

### Step 3: Add HTML (see html-templates.md)

The HTML needs:
- `<div id="newnameModal" class="modal">` — the modal element
- `<button id="openNewnameModal">` — the trigger button

## Scroll Animation (No Changes Needed)

The `IntersectionObserver` automatically finds all `.animate-on-scroll` elements:

```javascript
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
// ... observer adds .is-visible on intersection, then unobserves
```

**To animate a new element**: Just add `class="animate-on-scroll"` in the HTML. Add `.delay-1`, `.delay-2`, or `.delay-3` for staggered timing. No JS changes needed.

## Mobile Menu (No Changes Needed)

The hamburger menu toggles `.active` on `#nav-menu` and swaps the icon:

```javascript
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenu.textContent = navMenu.classList.contains('active') ? '✖' : '☰';
});
```

Nav links auto-close the menu on click. **If adding a new nav link**, no JS changes needed — the handler iterates all `a` elements inside `#nav-menu`.

## Hero Parallax (No Changes Needed)

```javascript
const hero = document.getElementById('hero');
window.addEventListener('scroll', () => {
    let scrollPosition = window.pageYOffset;
    hero.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
});
```

## Contact Form Submission

The form uses `fetch()` to POST to FormSubmit.co, then shows a success message:

```javascript
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const submitText = submitBtn.querySelector('span');
        const originalText = submitText.textContent;
        
        // Show loading state
        submitBtn.classList.add('is-loading');
        submitText.textContent = 'Sending…';
        
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
            }
        })
        .catch(() => {
            // Error handling
        })
        .finally(() => {
            submitBtn.classList.remove('is-loading');
            submitText.textContent = originalText;
        });
    });
}
```

**Key pattern**: Button shows loading state via `.is-loading` class and text swap, then hides form and shows `#form-success` on success.

## Adding New Interactive Features

### Pattern: Toggle Element Visibility

```javascript
const trigger = document.getElementById('trigger-id');
const target = document.getElementById('target-id');

trigger.addEventListener('click', () => {
    target.classList.toggle('active');
});
```

### Pattern: Smooth Scroll to Section

Already handled by CSS `scroll-behavior: smooth` on `html`. Anchor links (`<a href="#section">`) work automatically.

### Pattern: Click Outside to Close

Used for modals — also applicable to dropdowns or menus:

```javascript
window.addEventListener('click', (e) => {
    if (e.target === overlayElement) {
        overlayElement.style.display = 'none';
    }
});
```

### Pattern: Escape Key to Close

```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close whatever is open
    }
});
```

## Conventions

- Use `const` for DOM references, `let` only when reassignment is needed
- Cache selectors — query the DOM once, store in a variable
- Use `forEach` for iterating NodeLists
- Event delegation: when possible, add one listener to a parent rather than one per child
- Use `classList.toggle()`, `.add()`, `.remove()` — never manipulate `className` strings directly
- Prefer `.style.display = 'none'/'block'` for show/hide, or toggle a CSS class
- No `var`, no `innerHTML` with user content (XSS risk), no `eval()`
