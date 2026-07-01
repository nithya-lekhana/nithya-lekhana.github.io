document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       2. Smooth Scrolling
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* =========================================
       3. 3D Tilt Hover Effect
       ========================================= */
    const tiltElements = document.querySelectorAll('.feature-card, .floating-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt (max 10 degrees)
            const tiltX = ((y - centerY) / centerY) * -10; 
            const tiltY = ((x - centerX) / centerX) * 10;
            
            // Only apply tilt if not a floating card (since floating card has animation)
            // But we can apply it to feature cards and inner cards
            el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.zIndex = "10";
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease';
            el.style.zIndex = "1";
        });
        
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none';
        });
    });

    /* =========================================
       4. Staggered Fade-In Animations
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    let delayCounter = 0;
    let resetTimer;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Stagger animations for elements appearing at the same time
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, 100 * delayCounter);
                
                delayCounter++;
                observer.unobserve(entry.target);
                
                // Reset counter after a batch finishes
                clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {
                    delayCounter = 0;
                }, 100);
            }
        });
    }, observerOptions);

    const elementsToAnimate = [
        '.trust-bar',
        '.feature-card',
        '.vault-info',
        '.vault-mockup',
        '.cta-card'
    ];

    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    });

    // CSS injected dynamically for the observer
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);

    /* =========================================
       5. Mobile Menu Toggle
       ========================================= */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link (unless it's the dropdown toggle)
        navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
        
        // Handle mobile dropdown toggle
        const dropdownToggle = document.querySelector('.dropdown-toggle');
        const dropdown = document.querySelector('.dropdown');
        if (dropdownToggle && dropdown) {
            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    }
});
