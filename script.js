// ================================
// MODERN PROFESSIONAL PORTFOLIO
// JavaScript - Animations & Interactions
// ================================

(function() {
    'use strict';

    // ===== NAVIGATION =====
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ===== GESTION DES IMAGES NON CHARGÉES =====
    // Remplace automatiquement les images cassées par un placeholder élégant
    function handleImageError(img) {
        // Créer un placeholder élégant
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        placeholder.style.width = img.width || '100%';
        placeholder.style.height = img.height || '400px';

        // Remplacer l'image par le placeholder
        if (img.parentNode) {
            img.parentNode.replaceChild(placeholder, img);
        }
    }

    // Gérer toutes les images
    document.querySelectorAll('img').forEach(img => {
        // Si l'image n'a pas encore chargé
        if (!img.complete) {
            img.addEventListener('error', () => handleImageError(img));
        }
        // Si l'image est déjà en erreur
        else if (img.naturalWidth === 0) {
            handleImageError(img);
        }

        // Ajouter un effet de fondu quand l'image charge
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 50);
        });
    });

    // Scroll behavior for navigation
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignore empty anchors
            if (href === '#' || href === '') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== SCROLL ANIMATIONS (AOS Alternative) =====
    class ScrollAnimator {
        constructor() {
            this.elements = document.querySelectorAll('[data-aos]');
            this.windowHeight = window.innerHeight;
            this.init();
        }

        init() {
            if (this.elements.length === 0) return;

            this.checkElements();
            window.addEventListener('scroll', () => this.checkElements());
            window.addEventListener('resize', () => {
                this.windowHeight = window.innerHeight;
                this.checkElements();
            });
        }

        checkElements() {
            this.elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const delay = element.getAttribute('data-aos-delay') || 0;

                // Element is in viewport
                if (elementTop < this.windowHeight * 0.85 && elementBottom > 0) {
                    setTimeout(() => {
                        element.classList.add('aos-animate');
                    }, delay);
                }
            });
        }
    }

    // Initialize scroll animations
    const scrollAnimator = new ScrollAnimator();

    // ===== FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Envoi en cours...</span>';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    submitButton.innerHTML = '<span>✓ Message envoyé !</span>';
                    submitButton.style.background = '#10b981';
                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.style.background = '';
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Error
                submitButton.innerHTML = '<span>✗ Erreur - Réessayer</span>';
                submitButton.style.background = '#ef4444';
                submitButton.disabled = false;

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                }, 3000);
            }
        });

        // Real-time form validation
        const formInputs = contactForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '#10b981';
                }
            });

            input.addEventListener('focus', () => {
                input.style.borderColor = '#6366f1';
            });
        });
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // ===== PERFORMANCE OPTIMIZATIONS =====

    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ===== SCROLL TO TOP BUTTON =====
    function createScrollToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');

        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 48px;
            height: 48px;
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 999;
        `;

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-4px) scale(1.05)';
            button.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
        });

        document.body.appendChild(button);
    }

    createScrollToTopButton();

    // ===== PORTFOLIO CARD TILT EFFECT =====
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    portfolioCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== SERVICE CARDS HOVER EFFECT =====
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.service-card__icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.service-card__icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });

    // ===== TECH STACK RANDOM ANIMATION =====
    const techItems = document.querySelectorAll('.tech-item');

    function randomTechAnimation() {
        const randomItem = techItems[Math.floor(Math.random() * techItems.length)];
        if (randomItem) {
            randomItem.style.transform = 'scale(1.15) rotate(5deg)';
            setTimeout(() => {
                randomItem.style.transform = '';
            }, 500);
        }
    }

    // Animate random tech item every 3 seconds
    if (techItems.length > 0) {
        setInterval(randomTechAnimation, 3000);
    }

    // ===== CURSOR CUSTOM (Desktop only) =====
    if (window.innerWidth > 1024) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid #6366f1;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.15s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.15;
            cursorY += dy * 0.15;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Enlarge cursor on hover
        const hoverables = document.querySelectorAll('a, button, .portfolio-card, .service-card, .tech-item');
        hoverables.forEach(hoverable => {
            hoverable.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = '#10b981';
            });

            hoverable.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderColor = '#6366f1';
            });
        });
    }

    // ===== TYPING EFFECT FOR HERO =====
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Optional: Apply typing effect to hero title on first load
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle && sessionStorage.getItem('visited') !== 'true') {
        const originalText = heroTitle.textContent;
        heroTitle.style.opacity = '1';
        // Uncomment to enable typing effect
        // typeWriter(heroTitle, originalText);
        sessionStorage.setItem('visited', 'true');
    }

    // ===== STATS COUNTER ANIMATION =====
    const stats = document.querySelectorAll('.stat__number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        stats.forEach(stat => {
            const target = stat.textContent;
            const numericValue = parseInt(target.replace(/\D/g, ''));
            const suffix = target.replace(/[0-9]/g, '');
            let current = 0;
            const increment = numericValue / 50;

            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    stat.textContent = numericValue + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        });

        countersAnimated = true;
    }

    // Trigger counter animation when hero stats are in view
    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

    // ===== CONSOLE MESSAGE =====
    console.log('%c👋 Bonjour !', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cIntéressé par le code de ce site ?', 'font-size: 14px; color: #475569;');
    console.log('%cContactez-moi : contact@arielberdah.com', 'font-size: 14px; color: #10b981;');

    // ===== PREVENT CONTEXT MENU (Optional - Remove if not needed) =====
    // document.addEventListener('contextmenu', (e) => e.preventDefault());

    // ===== PAGE LOAD ANIMATION =====
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===== PERFORMANCE MONITORING =====
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log(`⚡ Page loaded in ${Math.round(entry.loadEventEnd - entry.fetchStart)}ms`);
                }
            }
        });

        try {
            perfObserver.observe({ entryTypes: ['navigation'] });
        } catch (e) {
            // Observer not supported
        }
    }

})();
