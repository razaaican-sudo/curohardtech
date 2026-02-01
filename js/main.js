/**
 * CUROTECH Website Clone - JavaScript
 * Handles interactivity: counters, FAQ accordion, modal, navigation
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features
    initHeader();
    initMobileMenu();
    initTypewriter();
    initCounterAnimation();
    initFAQAccordion();
    initBookDemoModal(); // Enable Book Demo Modal
    initFormHandler(); // Enable AJAX Form Submission
    initSmoothScroll();
});

/**
 * Typewriter Animation for Hero Section
 */
function initTypewriter() {
    const textElement = document.getElementById('typewriter-text');
    if (!textElement) return;

    const phrases = [
        "Robotics Solutions",
        "AI Labs",
        "STEM Curriculum",
        "Drone Workshops"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Deleting speed
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Typing speed
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}


/**
 * Sticky Header with scroll effect
 */
function initHeader() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    // 1. Dynamic Wrapper Logic (to fix mobile layer overlap)
    if (navContainer && navLinks && navButtons) {
        // Create wrapper if it doesn't exist
        let wrapper = document.querySelector('.nav-content-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'nav-content-wrapper';
            // Insert wrapper before the toggle button
            if (menuToggle) {
                navContainer.insertBefore(wrapper, menuToggle);
            } else {
                navContainer.appendChild(wrapper);
            }
            // Move links and buttons into it
            wrapper.appendChild(navLinks);
            wrapper.appendChild(navButtons);
        }
    }

    // 2. Toggle Logic
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const wrapper = document.querySelector('.nav-content-wrapper');
            if (wrapper) wrapper.classList.toggle('mobile-active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * Counter Animation on Scroll
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    };

    // Intersection Observer for triggering animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    // Observe either .statistics (index) or .impact-stats (impact page)
    const statsSection = document.querySelector('.statistics') || document.querySelector('.impact-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Book Demo Modal Logic
 */
function initBookDemoModal() {
    const modal = document.getElementById('bookDemoModal');
    const closeBtn = document.getElementById('closeBookDemo');
    const bookButtons = document.querySelectorAll('.js-open-demo-modal');

    if (!modal || !closeBtn) return;

    // Open Modal on Button Click
    bookButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    // Close Modal Logic
    const closeModal = () => modal.classList.remove('active');

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Reveal Elements on Scroll (Optional Enhancement)
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.feature-card, .tech-card, .offering-card, .stat-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// Video Fallback - If video doesn't load, show a gradient background
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video');

    if (heroVideo) {
        heroVideo.addEventListener('error', () => {
            const heroContainer = document.querySelector('.hero-video-container');
            heroContainer.style.background = 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%)';
            heroVideo.style.display = 'none';
        });
    }
});

/**
 * Handle Form Submissions via AJAX (No Redirect)
 */
function initFormHandler() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // STOP the redirect

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // 1. Visual Feedback - Loading
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';

            // 2. Prepare Data
            const formData = new FormData(form);
            const actionUrl = form.getAttribute('action'); // Get the FormSubmit URL from HTML

            // 3. Send AJAX Request
            fetch(actionUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json' // Tells FormSubmit to return JSON, not redirect
                },
                body: formData
            })
                .then(response => {
                    if (response.ok) {
                        // 4. Success UI
                        showSuccessMessage(form);
                    } else {
                        // Error state
                        alert("Oops! Something went wrong. Please check your internet or email configuration.");
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalBtnText;
                    }
                })
                .catch(error => {
                    console.error('Form Error:', error);
                    alert("Network error. Please try again later.");
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                });
        });
    });
}

function showSuccessMessage(form) {
    // specific handling for modal vs newsletter
    const isModal = form.classList.contains('modal-form');

    const successHTML = `
        <div class="success-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>${isModal ? 'Request Received!' : 'Subscribed!'}</h3>
            <p>${isModal ? 'We will be in touch with you shortly to schedule your demo.' : 'Thank you for joining our newsletter.'}</p>
        </div>
    `;

    // Replace form content
    form.innerHTML = successHTML;
}
