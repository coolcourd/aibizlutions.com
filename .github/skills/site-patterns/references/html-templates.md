# HTML Templates

Copy-paste skeletons for every reusable component on the AI Bizlutions site. Always start from these — never invent new patterns.

## Light Section Skeleton

```html
<section id="SECTION-ID" class="section SECTION-ID-section">
    <div class="container">
        <h3 class="section-title animate-on-scroll">Section Title</h3>
        <p class="section-subtitle animate-on-scroll">Supporting subtitle text</p>
        
        <!-- Content goes here -->
        
    </div>
</section>
```

## Dark Section Skeleton

```html
<section id="SECTION-ID" class="section section-dark">
    <div class="container">
        <h3 class="section-title animate-on-scroll">Section Title</h3>
        <p class="section-subtitle-light animate-on-scroll">Supporting subtitle on dark bg</p>
        
        <!-- Content goes here -->
        
    </div>
</section>
```

**Note**: Use `.section-subtitle` on light sections, `.section-subtitle-light` on dark sections.

## Service Card (3-Column Grid)

Wrap cards in `.service-grid` for the 3-column layout:

```html
<div class="service-grid">
    <div class="service-card animate-on-scroll">
        <div class="icon-wrapper">
            <i class="fi fi-sr-ICON-NAME icon"></i>
        </div>
        <h4>Card Title</h4>
        <p class="service-description">Description text explaining the service or feature.</p>
        <ul class="service-benefits">
            <li><i class="fi fi-rr-bolt benefit-icon"></i> Benefit one</li>
            <li><i class="fi fi-rr-bullseye-arrow benefit-icon"></i> Benefit two</li>
            <li><i class="fi fi-rr-piggy-bank benefit-icon"></i> Benefit three</li>
        </ul>
    </div>
    <div class="service-card animate-on-scroll delay-1">
        <!-- Same structure, second card -->
    </div>
    <div class="service-card animate-on-scroll delay-2">
        <!-- Same structure, third card -->
    </div>
</div>
```

**Key details:**
- First card: no delay class
- Second card: `.delay-1`
- Third card: `.delay-2`
- Icons: `.fi-sr-` prefix (solid) for main icon, `.fi-rr-` prefix (regular) for benefit icons
- Grid stacks to single column at `≤992px`

## Team Member Card

Used in the about section:

```html
<div class="team-photos animate-on-scroll delay-1">
    <div class="team-member">
        <div class="team-photo">
            <img src="PHOTO.jpg" alt="NAME - ROLE Description">
        </div>
        <h4>Full Name</h4>
        <p class="team-role">Role Title</p>
        <button class="btn-team-story" id="openNAMEModal">Read Name's Story</button>
    </div>
</div>
```

## Value Prop Cards (Inside About Section)

```html
<div class="value-props">
    <div class="value-prop">
        <i class="fi fi-sr-puzzle-piece"></i>
        <h5>Prop Title</h5>
        <p>Short description</p>
    </div>
    <div class="value-prop">
        <i class="fi fi-sr-headset"></i>
        <h5>Prop Title</h5>
        <p>Short description</p>
    </div>
    <div class="value-prop">
        <i class="fi fi-sr-chart-network"></i>
        <h5>Prop Title</h5>
        <p>Short description</p>
    </div>
</div>
```

## Modal

Three parts: HTML element, open button (anywhere on page), and JS wiring.

### Modal HTML (place before closing `</body>` or after the section that triggers it)

```html
<div id="NAMEModal" class="modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h3>Modal Title</h3>
        <div class="modal-body">
            <p>Modal paragraph content.</p>
            <p><strong>Bold text uses primary color.</strong></p>
            <p>More paragraphs as needed.</p>
        </div>
    </div>
</div>
```

### Open Button (place in any section)

```html
<button id="openNAMEModal" class="btn btn-secondary-light">
    Open Modal <i class="fi fi-rr-arrow-right"></i>
</button>
```

### JS Wiring (see js-patterns.md for the full pattern)

New modals must be added to the `modals` and `openButtons` objects in `script.js`.

## Contact Form

```html
<form id="contact-form" class="contact-form animate-on-scroll delay-2" 
    action="https://formsubmit.co/support@aibizlutions.com" 
    method="POST">

    <input type="hidden" name="_subject" value="Form Subject Line">
    <input type="hidden" name="_autoresponse" value="Thank you message for auto-reply.">
    
    <div class="form-group">
        <label for="FIELD-ID"><i class="fi fi-rr-ICON"></i> Label Text</label>
        <input type="text" id="FIELD-ID" name="Field Name" placeholder="Placeholder" required>
    </div>

    <div class="form-group">
        <label for="FIELD-ID"><i class="fi fi-rr-ICON"></i> Label Text</label>
        <select id="FIELD-ID" name="Field Name" required>
            <option value="" disabled selected>Select placeholder</option>
            <option value="opt1">Option 1</option>
            <option value="opt2">Option 2</option>
        </select>
    </div>

    <div class="form-group">
        <label for="FIELD-ID"><i class="fi fi-rr-ICON"></i> Label Text</label>
        <textarea id="FIELD-ID" name="Field Name" placeholder="Placeholder..." required></textarea>
    </div>
    
    <button type="submit" class="btn btn-primary btn-submit">
        <span>Submit Text</span>
        <i class="fi fi-rr-arrow-right"></i>
    </button>
</form>

<div id="form-success" class="form-success-message" style="display: none;">
    <i class="fi fi-sr-check-circle"></i>
    <h4>Success Title</h4>
    <p>Success message text.</p>
</div>
```

**Key details:**
- Form action uses `formsubmit.co` — no backend needed
- Every `<input>`, `<select>`, `<textarea>` has an associated `<label>` with `for` attribute
- Labels include an icon (`fi-rr-` prefix)
- Hidden inputs control subject line and auto-response
- Success message hidden by default, shown via JS after submit

## Contact Info Card (Sidebar)

```html
<div class="contact-info animate-on-scroll delay-3">
    <div class="contact-card">
        <div class="contact-card-header">
            <i class="fi fi-sr-headset"></i>
            <h4>Direct Contact</h4>
        </div>
        <div class="contact-details">
            <a href="mailto:email@example.com" class="contact-item">
                <i class="fi fi-rr-envelope"></i>
                <div>
                    <span class="contact-label">Email</span>
                    <span class="contact-value">email@example.com</span>
                </div>
            </a>
            <a href="tel:XXX-XXX-XXXX" class="contact-item">
                <i class="fi fi-rr-phone-call"></i>
                <div>
                    <span class="contact-label">Phone</span>
                    <span class="contact-value">XXX-XXX-XXXX</span>
                </div>
            </a>
        </div>
    </div>
</div>
```

## Hero Section

```html
<section id="hero" class="hero-section">
    <div class="container">
        <div class="hero-content">
            <h2 class="animate-on-scroll">Main Headline. <span class="highlight">Highlighted Part.</span></h2>
            <p class="animate-on-scroll delay-1">Supporting paragraph text.</p>
            <div class="hero-cta-group animate-on-scroll delay-2">
                <a href="#contact" class="btn btn-primary">Primary CTA</a>
                <a href="#services" class="btn btn-secondary">Secondary CTA</a>
            </div>
        </div>
    </div>
</section>
```

## Navigation

```html
<header id="header">
    <div class="container nav-content">
        <h1 class="logo"><a href="/"><img src="logo-t.png" width="100px" alt="AI Bizlutions LLC Logo"></a></h1>
        <nav id="nav-menu">
            <a href="#services">Solutions</a>
            <a href="#about">About Us</a>
            <a href="#process">Process</a>
            <a href="#contact" class="cta-nav-link">Get Started</a>
        </nav>
        <div class="menu-toggle" id="mobile-menu">☰</div>
    </div>
</header>
```

**To add a new nav link:** Insert a new `<a>` inside `#nav-menu` before the CTA link.
