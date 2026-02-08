/**
 * Mg Design - Zero-Lag Professional Engine
 * Optimized for Core Web Vitals (LCP, FID, CLS)
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // -- State Management --
    const state = {
        isScrolled: false,
        activeHeroIndex: 0,
        activeFeaturedIndex: 0,
        isTabActive: true,
        lastScrollPos: 0,
        currentLang: localStorage.getItem('selectedLang') || 'ar'
    };

    // -- Selectors --
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');
    const navLinks = document.querySelectorAll('.nav-links li a');
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.reveal');

    /**
     * 1. Consolidated Scroll Engine (GPU Optimized)
     */
    let tick = false;
    const handleScroll = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Header Transformation
        if (scrollY > 50 && !state.isScrolled) {
            header.classList.add('scrolled');
            state.isScrolled = true;
        } else if (scrollY <= 50 && state.isScrolled) {
            header.classList.remove('scrolled');
            state.isScrolled = false;
        }

        // Scroll to Top Visibility
        if (scrollTopBtn) {
            if (scrollY > 600) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        }

        // Active Section Highlight (Spatial Partitioning)
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY <= bottom) {
                const id = section.getAttribute('id');
                updateNavActive(id);
            }
        });
    };

    const updateNavActive = (id) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    window.addEventListener('scroll', () => {
        if (!tick) {
            window.requestAnimationFrame(() => {
                handleScroll();
                tick = false;
            });
            tick = true;
        }
    }, { passive: true });

    /**
     * 2. Intersection Observer (Memory Efficient Reveal)
     */
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /**
     * 3. Luxury Hero Slider Engine (Taj Style with Preview)
     */
    const initHeroSlider = () => {
        const slides = document.querySelectorAll('.hero-slider .slide');
        if (!slides.length) return;

        const updateSlides = (index) => {
            slides.forEach(s => s.classList.remove('active', 'next'));

            const activeIdx = (index + slides.length) % slides.length;
            const nextIdx = (activeIdx + 1) % slides.length;

            slides[activeIdx].classList.add('active');
            slides[nextIdx].classList.add('next');
            state.activeHeroIndex = activeIdx;
        };

        const nextHero = () => {
            if (state.isTabActive) updateSlides(state.activeHeroIndex + 1);
        };

        // Auto slide interval
        let heroInterval = setInterval(nextHero, 5000);

        const resetHeroTimer = () => {
            clearInterval(heroInterval);
            heroInterval = setInterval(nextHero, 5000);
        };

        document.querySelector('.next-btn')?.addEventListener('click', () => {
            updateSlides(state.activeHeroIndex + 1);
            resetHeroTimer();
        });

        document.querySelector('.prev-btn')?.addEventListener('click', () => {
            updateSlides(state.activeHeroIndex - 1);
            resetHeroTimer();
        });

        // Init
        updateSlides(0);
    };

    /**
     * 4. Featured Product Slider (Taj Style Stack)
     */
    const initFeaturedSlider = () => {
        const slides = document.querySelectorAll('.f-slide');
        if (!slides.length) return;

        const updateFeatured = (index) => {
            slides.forEach(s => s.classList.remove('active', 'next', 'prev'));

            const activeIdx = (index + slides.length) % slides.length;
            const nextIdx = (activeIdx + 1) % slides.length;
            const prevIdx = (activeIdx - 1 + slides.length) % slides.length;

            slides[activeIdx].classList.add('active');
            slides[nextIdx].classList.add('next');
            if (slides.length > 2) slides[prevIdx].classList.add('prev');

            state.activeFeaturedIndex = activeIdx;
        };

        const nextFeatured = () => {
            if (state.isTabActive) updateFeatured(state.activeFeaturedIndex + 1);
        };

        let fInterval = setInterval(nextFeatured, 6000);

        document.querySelector('.f-next')?.addEventListener('click', () => {
            updateFeatured(state.activeFeaturedIndex + 1);
            clearInterval(fInterval);
            fInterval = setInterval(nextFeatured, 6000);
        });

        document.querySelector('.f-prev')?.addEventListener('click', () => {
            updateFeatured(state.activeFeaturedIndex - 1);
            clearInterval(fInterval);
            fInterval = setInterval(nextFeatured, 6000);
        });

        updateFeatured(0);
    };

    /**
     * 5. Visibility API (Save CPU when Tab inactive)
     */
    document.addEventListener('visibilitychange', () => {
        state.isTabActive = !document.hidden;
    });

    /**
     * 6. Core Interactions
     */
    // Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksList = document.querySelector('.nav-links');

    menuToggle?.addEventListener('click', () => {
        const isOpen = navLinksList.classList.toggle('active');
        menuToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });

    // Language Toggle Logic
    const langToggle = document.getElementById('langToggle');

    const updateLanguageDOM = () => {
        const lang = state.currentLang;
        const dict = translations[lang];

        // Update Layout Direction
        document.body.className = lang === 'en' ? 'ltr' : '';
        document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
        document.documentElement.lang = lang;

        // Update Switcher Button
        if (langToggle) {
            langToggle.querySelector('span').textContent = lang === 'ar' ? 'EN' : 'AR';
        }

        // Fast DOM Translation
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                const icon = el.querySelector('i');
                if (icon) {
                    const iconClone = icon.cloneNode(true);
                    el.innerHTML = '';
                    el.appendChild(iconClone);
                    el.appendChild(document.createTextNode(' ' + dict[key]));
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Translate Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) el.placeholder = dict[key];
        });
    };

    langToggle?.addEventListener('click', () => {
        state.currentLang = state.currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('selectedLang', state.currentLang);
        updateLanguageDOM();
    });

    // Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                const show = filter === 'all' || item.classList.contains(filter);
                item.style.display = show ? 'block' : 'none';
                if (show) setTimeout(() => item.classList.add('active'), 10);
            });
        });
    });

    // Form Mock Submission
    const mgForm = document.getElementById('mgForm');
    mgForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = mgForm.querySelector('button[type="submit"]');
        const oldText = btn.textContent;
        btn.disabled = true;
        btn.textContent = state.currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';

        setTimeout(() => {
            const successMsg = state.currentLang === 'ar' ? 'تم استلام طلبك! سنتواصل معك قريباً.' : 'Message received! We will contact you soon.';
            alert(successMsg);
            btn.disabled = false;
            btn.textContent = oldText;
            mgForm.reset();
        }, 1500);
    });

    // Init All
    updateLanguageDOM();
    initHeroSlider();
    initFeaturedSlider();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                navLinksList.classList.remove('active');
            }
        });
    });

    // Loader
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1000);
        });
    }
});
