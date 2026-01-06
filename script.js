document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenu.textContent = navMenu.classList.contains('active') ? '✖' : '☰';
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenu.textContent = '☰';
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
    });

    // 4. Modal Functionality
    const modals = {
        story: document.getElementById('storyModal'),
        chase: document.getElementById('chaseModal'),
        courd: document.getElementById('courdModal')
    };

    const openButtons = {
        story: document.getElementById('openStoryModal'),
        chase: document.getElementById('openChaseModal'),
        courd: document.getElementById('openCourdModal')
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
});
