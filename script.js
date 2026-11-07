document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const open = navMenu.classList.contains('active');
        mobileMenu.textContent = open ? '✖' : '☰';
        mobileMenu.setAttribute('aria-expanded', String(open));
        mobileMenu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenu.textContent = '☰';
                mobileMenu.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-label', 'Open menu');
            }
        });
    });

    // 2. Scroll Animation (Fade-In/Slide-Up)
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });
    
    // 3. Subtle Parallax Effect on Hero Section
    const hero = document.getElementById('hero');
    
    window.addEventListener('scroll', () => {
        let scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
    }, { passive: true });

    // 3.5 Beta Banner Dismissal
    const betaBanner = document.getElementById('beta-banner');
    const betaClose = document.querySelector('.beta-close');

    if (betaBanner && betaClose) {
        if (sessionStorage.getItem('betaBannerDismissed')) {
            betaBanner.style.display = 'none';
        }

        betaClose.addEventListener('click', () => {
            betaBanner.style.display = 'none';
            sessionStorage.setItem('betaBannerDismissed', 'true');
        });
    }

    // 4. Modal Functionality
    const modals = {
        story: document.getElementById('storyModal'),
        chase: document.getElementById('chaseModal'),
        managed: document.getElementById('managedModal'),
        enterprise: document.getElementById('enterpriseModal')
    };

    const openButtons = {
        story: document.getElementById('openStoryModal'),
        chase: document.getElementById('openChaseModal'),
        managed: document.getElementById('openManagedModal'),
        enterprise: document.getElementById('openEnterpriseModal')
    };

    const closeButtons = document.querySelectorAll('.modal-close');

    // Open modals
    Object.keys(openButtons).forEach(key => {
        if (openButtons[key]) {
            openButtons[key].addEventListener('click', () => {
                modals[key].style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }
    });

    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            Object.values(modals).forEach(modal => {
                modal.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        Object.values(modals).forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            Object.values(modals).forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });

    // 5. Contact Form Submission with Confirmation
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            const originalText = submitText.textContent;

            submitBtn.classList.add('is-loading');
            submitText.textContent = 'Sending…';

            const formData = new FormData(contactForm);
            const entered = {
                name: String(formData.get('name') || '').trim(),
                email: String(formData.get('email') || '').trim(),
                qualifications: String(formData.get('qualifications') || '').trim()
            };

            const showError = (message) => {
                submitBtn.classList.remove('is-loading');
                submitText.textContent = originalText;
                const existing = contactForm.querySelector('.form-error');
                if (existing) existing.remove();
                const errorBlock = document.createElement('div');
                errorBlock.className = 'form-error';
                errorBlock.setAttribute('role', 'alert');
                errorBlock.innerHTML = '<img src="bo-head-sad.svg" alt=""><span></span>';
                const text = errorBlock.querySelector('span');
                if (message) {
                    text.appendChild(document.createTextNode(message + ' Questions? Email '));
                } else {
                    text.appendChild(document.createTextNode('Sorry, that didn’t go through. Please try again or email '));
                }
                const mail = document.createElement('a');
                mail.href = 'mailto:support@aibizlutions.com';
                mail.textContent = 'support@aibizlutions.com';
                text.appendChild(mail);
                text.appendChild(document.createTextNode(' directly.'));
                contactForm.appendChild(errorBlock);
            };

            // The submit URL carries the Beta Applications form's public token. Until the real
            // token is pasted in, keep sending applications by email exactly as the site did
            // before the CRM hookup, so the form never stops working in between.
            const submitUrl = contactForm.action;
            if (/BETA_FORM_TOKEN/.test(submitUrl)) {
                const legacy = new FormData();
                legacy.append('_subject', 'Bo Botty Beta Application');
                legacy.append('_autoresponse', 'Thank you for applying to the Bo Botty beta! We’ll review your application and follow up within a few days.');
                legacy.append('Name', entered.name);
                legacy.append('Email', entered.email);
                legacy.append('Beta Qualifications', entered.qualifications);
                fetch('https://formsubmit.co/support@aibizlutions.com', {
                    method: 'POST',
                    body: legacy,
                    headers: { 'Accept': 'application/json' }
                })
                .then(response => {
                    if (!response.ok) throw new Error('');
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                })
                .catch(() => showError(''));
                return;
            }

            // The app gives each form field a random id, so ask the form for its layout and
            // match our three boxes by field type: the email field, a text field labelled
            // "name", and the long-answer field. Answers under any other key are dropped
            // by the server, so this mapping is what makes the answers land in the CRM.
            const definitionUrl = submitUrl.replace(/\/submit\/?$/, '');
            fetch(definitionUrl, { headers: { 'Accept': 'application/json' } })
            .then(response => response.json().catch(() => ({})).then(body => ({ response, body })))
            .then(({ response, body }) => {
                if (!response.ok || body.success === false || !body.data) {
                    throw new Error((body.error && body.error.message) || '');
                }
                const fields = (body.data.fields || []).filter(f => f && f.fieldId);
                const used = new Set();
                const pick = (test) => {
                    const f = fields.find(x => !used.has(x.fieldId) && test(x));
                    if (f) used.add(f.fieldId);
                    return f;
                };
                const emailField = pick(f => f.type === 'email');
                const nameField = pick(f => f.type === 'text' && /name/i.test(f.label || '')) || pick(f => f.type === 'text');
                const qualField = pick(f => f.type === 'textarea') || pick(f => f.type === 'text');

                const responses = {};
                if (nameField) responses[nameField.fieldId] = entered.name;
                if (emailField) responses[emailField.fieldId] = entered.email;
                if (qualField) responses[qualField.fieldId] = entered.qualifications;

                return fetch(submitUrl, {
                    method: 'POST',
                    body: JSON.stringify({ responses, contactName: entered.name, contactEmail: entered.email, _hp: formData.get('_hp') || '' }),
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });
            })
            .then(response => response.json().catch(() => ({})).then(body => ({ response, body })))
            .then(({ response, body }) => {
                if (response.ok && body.success !== false) {
                    contactForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                } else {
                    throw new Error((body.error && body.error.message) || '');
                }
            })
            .catch((err) => {
                // A 4xx from the form server carries a sentence meant for the visitor
                // ("You have already submitted this form."); network failures do not.
                showError(err && err.message && !/fetch|network|load/i.test(err.message) ? err.message : '');
            });
        });
    }

    // 6. Enterprise Form Submission with Confirmation
    const enterpriseForm = document.getElementById('enterprise-form');
    const enterpriseSuccess = document.getElementById('enterprise-form-success');

    if (enterpriseForm) {
        enterpriseForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = enterpriseForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            const originalText = submitText.textContent;

            submitBtn.classList.add('is-loading');
            submitText.textContent = 'Sending…';

            const formData = new FormData(enterpriseForm);

            fetch(enterpriseForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok || response.status === 200) {
                    enterpriseForm.style.display = 'none';
                    enterpriseSuccess.style.display = 'block';
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(() => {
                submitBtn.classList.remove('is-loading');
                submitText.textContent = originalText;
                const existing = enterpriseForm.querySelector('.form-error');
                if (existing) existing.remove();
                const errorBlock = document.createElement('div');
                errorBlock.className = 'form-error';
                errorBlock.setAttribute('role', 'alert');
                errorBlock.innerHTML = '<img src="bo-head-sad.svg" alt=""><span>Sorry, that didn’t go through. Please try again or email <a href="mailto:support@aibizlutions.com">support@aibizlutions.com</a> directly.</span>';
                enterpriseForm.appendChild(errorBlock);
            });
        });
    }

    // 7. Hero email-stub (waitlist signup) — re-uses FormSubmit endpoint.
    const emailStub = document.getElementById('email-stub');
    const emailStubSuccess = document.getElementById('email-stub-success');
    if (emailStub) {
        emailStub.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = emailStub.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Adding…';
            fetch(emailStub.action, {
                method: 'POST',
                body: new FormData(emailStub),
                headers: { 'Accept': 'application/json' }
            })
            .then(r => {
                if (r.ok) {
                    emailStub.style.display = 'none';
                    if (emailStubSuccess) emailStubSuccess.hidden = false;
                } else { throw new Error('stub fail'); }
            })
            .catch(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                const existing = emailStub.querySelector('.form-error');
                if (existing) existing.remove();
                const errorBlock = document.createElement('div');
                errorBlock.className = 'form-error';
                errorBlock.setAttribute('role', 'alert');
                errorBlock.style.gridColumn = '1 / -1';
                errorBlock.innerHTML = '<img src="bo-head-sad.svg" alt=""><span>Hmm, that didn’t go through. The full form below works too.</span>';
                emailStub.appendChild(errorBlock);
            });
        });
    }
});

// Beta form embed: the Bo Botty form page reports its own height (once it is on a release with
// embed support), so the frame fits it exactly. Until then the CSS height is the fallback.
(function () {
    const frame = document.querySelector('.beta-form-embed');
    if (!frame) return;
    window.addEventListener('message', (e) => {
        if (e.origin !== 'https://app.aibizlutions.com' || e.source !== frame.contentWindow) return;
        const d = e.data;
        if (!d || d.type !== 'aib-form-height') return;
        const h = Number(d.height);
        if (Number.isFinite(h) && h > 100 && h < 6000) {
            frame.style.height = Math.ceil(h) + 'px';
        }
    });
})();
