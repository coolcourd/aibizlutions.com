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

// Teaser video card: plays every teaser in order when it comes into view (muted, as browsers
// require), loops back to the first, and the arrows, the four bars and the buttons let people
// go back, skip ahead, pause or turn the sound on.
(function () {
  var card = document.querySelector('.tz-card');
  if (!card || !window.HTMLVideoElement) return;
  var base = card.getAttribute('data-base') || '';
  var list = [
    ['clip1-just-tell-bo', 'Just tell Bo'],
    ['clip3-morning', 'Your morning'],
    ['clip4-from-scratch', 'Starting from scratch'],
    ['sizzle-features', 'A quick tour']
  ];
  var v = card.querySelector('.tz-video');
  var big = card.querySelector('.tz-big');
  var bar = card.querySelector('.tz-bar');
  var steps = card.querySelector('.tz-steps');
  var playBtn = card.querySelector('.tz-play');
  var soundBtn = card.querySelector('.tz-sound');
  var count = card.querySelector('.tz-count');
  var name = card.querySelector('.tz-name');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i = 0, userPaused = false, started = false, inView = true, fills = [];
  var ICON_PLAY = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
  var ICON_PAUSE = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';
  var ICON_MUTED = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICON_SOUND = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  v.removeAttribute('controls');
  v.muted = true;
  card.querySelectorAll('.tz-arrow').forEach(function (b) { b.hidden = false; });
  bar.hidden = false;

  list.forEach(function (item, k) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tz-step';
    b.setAttribute('aria-label', 'Play video ' + (k + 1) + ': ' + item[1]);
    b.innerHTML = '<span class="tz-track"><span class="tz-fill"></span></span>';
    b.addEventListener('click', function () { userPaused = false; load(k, true); });
    steps.appendChild(b);
    fills.push(b.querySelector('.tz-fill'));
  });

  function paint() {
    count.textContent = (i + 1) + ' of ' + list.length;
    name.textContent = list[i][1];
    fills.forEach(function (f, k) { f.style.width = k < i ? '100%' : '0'; f.parentNode.parentNode.setAttribute('aria-current', k === i ? 'true' : 'false'); });
  }
  function paintButtons() {
    var playing = !v.paused && !v.ended;
    playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    soundBtn.innerHTML = (v.muted ? ICON_MUTED + '<span>Turn sound on</span>' : ICON_SOUND + '<span>Sound on</span>');
    soundBtn.setAttribute('aria-pressed', v.muted ? 'false' : 'true');
    big.hidden = playing || (!started && !reduce && inView);
  }
  function tryPlay() {
    started = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () { big.hidden = false; });
  }
  function load(n, play) {
    i = (n + list.length) % list.length;
    v.poster = base + list[i][0] + '.jpg';
    v.src = base + list[i][0] + '.mp4';
    paint();
    if (play) tryPlay(); else paintButtons();
  }

  v.addEventListener('ended', function () { load(i + 1, true); });
  v.addEventListener('play', paintButtons);
  v.addEventListener('pause', paintButtons);
  v.addEventListener('timeupdate', function () {
    if (v.duration) fills[i].style.width = Math.min(100, (v.currentTime / v.duration) * 100) + '%';
  });
  function toggle() {
    if (v.paused) { userPaused = false; tryPlay(); } else { userPaused = true; v.pause(); }
  }
  v.addEventListener('click', toggle);
  playBtn.addEventListener('click', toggle);
  big.addEventListener('click', function () { userPaused = false; tryPlay(); });
  soundBtn.addEventListener('click', function () {
    v.muted = !v.muted;
    if (!v.muted && v.paused) { userPaused = false; tryPlay(); }
    paintButtons();
  });
  card.querySelector('.tz-prev').addEventListener('click', function () { userPaused = false; load(i - 1, true); });
  card.querySelector('.tz-next').addEventListener('click', function () { userPaused = false; load(i + 1, true); });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { userPaused = false; load(i - 1, true); }
    else if (e.key === 'ArrowRight') { userPaused = false; load(i + 1, true); }
  });

  // Full screen: the whole card (video, arrows and controls) where the browser allows it, turning a
  // phone sideways when it can; on iPhone, which only lets the video itself go full screen, the
  // phone's own player takes over.
  var fsBtn = card.querySelector('.tz-fs');
  var ICON_FS = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_FS_EXIT = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function paintFs() {
    var on = fsEl() === card;
    fsBtn.innerHTML = on ? ICON_FS_EXIT : ICON_FS;
    fsBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
  }
  fsBtn.addEventListener('click', function () {
    if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    var req = card.requestFullscreen || card.webkitRequestFullscreen;
    if (req) {
      var lock = function () {
        if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
      };
      var r = req.call(card);
      if (r && r.then) r.then(lock, function () {}); else lock();
    } else if (v.webkitEnterFullscreen) {
      v.webkitEnterFullscreen();
    }
    if (v.paused) { userPaused = false; tryPlay(); }
  });
  document.addEventListener('fullscreenchange', paintFs);
  document.addEventListener('webkitfullscreenchange', paintFs);
  paintFs();

  // Play while the card is on screen, pause when it scrolls away. Someone who asks the system for
  // less motion gets the big play button instead of autoplay.
  function onView(visible) {
    inView = visible;
    if (visible) {
      if (!userPaused && (started || !reduce) && v.paused) tryPlay();
    } else if (!v.paused) {
      v.pause();
    }
    paintButtons();
  }
  load(0, false);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { onView(es[0].intersectionRatio >= 0.06); }, { threshold: [0, 0.06, 0.5] }).observe(v);
  } else if (!reduce) {
    tryPlay();
  }
})();
