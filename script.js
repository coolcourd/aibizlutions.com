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
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => {
        scrollObserver.observe(el);
    });

    
    // 3. Subtle Parallax Effect on Hero Section (WOW Factor)
    const hero = document.getElementById('hero');
    
    // This is a simple vertical shift based on scroll position
    window.addEventListener('scroll', () => {
        let scrollPosition = window.pageYOffset;
        // Adjust the background position slightly (e.g., 0.3 of the scroll distance)
        // This creates a subtle visual depth effect.
        hero.style.backgroundPositionY = scrollPosition * 0.3 + 'px';
    });
});