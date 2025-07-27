// About Page JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }

    // Initialize all functionality
    initializeCounters();
    initializeParallax();
    initializeTestimonials();
    initializeVideoModal();
    initializeScrollEffects();
    initializeTeamCards();
    initializeValueCards();
    initializeAchievements();

    // Animated counters for statistics
    function initializeCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOutCubic);

                element.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(updateCounter);
        }
    }

    // Parallax effects
    function initializeParallax() {
        const heroBackground = document.querySelector('.hero-background');
        const particles = document.querySelectorAll('.particle');
        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            if (heroBackground) {
                heroBackground.style.transform = `translateY(${rate}px)`;
            }

            // Animate particles with different speeds
            particles.forEach((particle, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = scrolled * speed;
                particle.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Testimonials functionality
    function initializeTestimonials() {
        const testimonials = [
            {
                text: "The Himalayan trek with Wanderlust Adventures was life-changing. The guides were incredible, the experience authentic, and the memories will last forever. I've traveled with many companies, but none compare to their attention to detail and genuine care for travelers.",
                author: "Jennifer Smith",
                location: "New York, USA",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            {
                text: "Amazing cultural immersion in Morocco! Every detail was perfectly planned, from the local guides to the authentic accommodations. This wasn't just a vacation, it was a transformative journey that opened my eyes to a beautiful culture.",
                author: "David Chen",
                location: "San Francisco, USA",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            },
            {
                text: "The African safari exceeded all expectations. The wildlife encounters were incredible, but what made it special was the sustainable approach and the positive impact on local communities. Truly responsible tourism at its best.",
                author: "Maria Rodriguez",
                location: "Madrid, Spain",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b892?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
            }
        ];

        let currentTestimonial = 0;
        const testimonialContainer = document.querySelector('.testimonial-item');

        if (testimonialContainer) {
            // Auto-rotate testimonials
            setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                updateTestimonial();
            }, 6000);

            function updateTestimonial() {
                const testimonial = testimonials[currentTestimonial];

                testimonialContainer.style.opacity = '0';
                testimonialContainer.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    testimonialContainer.querySelector('.testimonial-text p').textContent = testimonial.text;
                    testimonialContainer.querySelector('.author-name').textContent = testimonial.author;
                    testimonialContainer.querySelector('.author-location').textContent = testimonial.location;
                    testimonialContainer.querySelector('.author-image').src = testimonial.image;
                    testimonialContainer.querySelector('.author-image').alt = testimonial.author;

                    testimonialContainer.style.opacity = '1';
                    testimonialContainer.style.transform = 'translateY(0)';
                }, 300);
            }

            // Add navigation dots
            createTestimonialDots();
        }

        function createTestimonialDots() {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'testimonial-dots';
            dotsContainer.innerHTML = testimonials.map((_, index) =>
                `<button class="testimonial-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>`
            ).join('');

            testimonialContainer.parentNode.appendChild(dotsContainer);

            // Add click handlers for dots
            dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentTestimonial = index;
                    updateTestimonial();
                    updateActiveDot(index);
                });
            });

            // Update active dot on auto-rotation
            const originalUpdate = updateTestimonial;
            updateTestimonial = function () {
                originalUpdate();
                updateActiveDot(currentTestimonial);
            };

            function updateActiveDot(activeIndex) {
                dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === activeIndex);
                });
            }
        }
    }

    // Video modal functionality
    function initializeVideoModal() {
        const playButton = document.querySelector('.play-button');
        const videoModal = document.getElementById('videoModal');

        if (playButton && videoModal) {
            playButton.addEventListener('click', function () {
                // Add a loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                // Reset after modal is shown
                videoModal.addEventListener('shown.bs.modal', function () {
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                }, { once: true });
            });

            // Pause video when modal is closed
            videoModal.addEventListener('hidden.bs.modal', function () {
                const iframe = this.querySelector('iframe');
                if (iframe) {
                    const src = iframe.src;
                    iframe.src = '';
                    iframe.src = src;
                }
            });
        }
    }

    // Advanced scroll effects
    function initializeScrollEffects() {
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Reveal animations on scroll
        const revealElements = document.querySelectorAll('.story-highlights, .floating-card, .value-card, .achievement-card');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            revealObserver.observe(element);
        });

        // Navbar background change on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    // Team cards interactive effects
    function initializeTeamCards() {
        const teamMembers = document.querySelectorAll('.team-member');

        teamMembers.forEach(member => {
            const memberImage = member.querySelector('.member-image');
            const socialLinks = member.querySelectorAll('.social-link');

            // Enhanced hover effects
            member.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-15px) scale(1.02)';

                // Stagger social link animations
                socialLinks.forEach((link, index) => {
                    setTimeout(() => {
                        link.style.transform = 'translateY(-5px) scale(1.1)';
                    }, index * 100);
                });
            });

            member.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';

                socialLinks.forEach(link => {
                    link.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Add click-to-flip effect on mobile
            if ('ontouchstart' in window) {
                let isFlipped = false;

                member.addEventListener('click', function (e) {
                    if (!e.target.closest('.social-link')) {
                        isFlipped = !isFlipped;
                        const overlay = this.querySelector('.member-overlay');

                        if (isFlipped) {
                            overlay.style.opacity = '1';
                            this.classList.add('flipped');
                        } else {
                            overlay.style.opacity = '0';
                            this.classList.remove('flipped');
                        }
                    }
                });
            }
        });
    }

    // Value cards interactive animations
    function initializeValueCards() {
        const valueCards = document.querySelectorAll('.value-card');

        valueCards.forEach((card, index) => {
            // Staggered entrance animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);

            // Interactive hover effects
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-15px) rotateY(5deg)';

                // Add glow effect
                this.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.2)';

                // Scale icon
                const icon = this.querySelector('.value-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                }
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) rotateY(0deg)';
                this.style.boxShadow = '';

                const icon = this.querySelector('.value-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    // Achievement cards with enhanced interactions
    function initializeAchievements() {
        const achievementCards = document.querySelectorAll('.achievement-card');

        achievementCards.forEach((card, index) => {
            // Add entrance delay
            card.style.animationDelay = `${index * 0.2}s`;

            // Enhanced 3D hover effect
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-15px) rotateY(10deg) rotateX(5deg)';
                this.style.boxShadow = '0 30px 60px rgba(255, 193, 7, 0.3)';

                // Animate icon with bounce
                const icon = this.querySelector('.achievement-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(15deg)';
                    icon.style.animation = 'bounce 0.6s ease';
                }
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) rotateY(0deg) rotateX(0deg)';
                this.style.boxShadow = '';

                const icon = this.querySelector('.achievement-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.animation = '';
                }
            });

            // Click effect
            card.addEventListener('click', function () {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                // Show achievement details (could integrate with modal)
                showAchievementDetail(this);
            });
        });
    }

    // Show achievement details
    function showAchievementDetail(card) {
        const title = card.querySelector('.achievement-title').textContent;
        const year = card.querySelector('.achievement-year').textContent;
        const description = card.querySelector('.achievement-description').textContent;

        // Create and show a toast notification
        showToast(`${title} - ${year}: ${description}`, 'success');
    }

    // Enhanced floating elements animation
    function initializeFloatingElements() {
        const floatingCards = document.querySelectorAll('.floating-card');

        floatingCards.forEach((card, index) => {
            // Random floating animation
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 20;
                const randomY = (Math.random() - 0.5) * 20;
                const randomRotate = (Math.random() - 0.5) * 10;

                card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
            }, 2000 + (index * 500));

            // Reset position on hover
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translate(0, 0) rotate(0deg) scale(1.05)';
                this.style.zIndex = '10';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = '';
                this.style.zIndex = '';
            });
        });
    }

    // Utility functions
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${getToastIcon(type)} me-2"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    function getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || icons.info;
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        // Press 'T' to scroll to team section
        if (e.key === 't' || e.key === 'T') {
            const teamSection = document.querySelector('.team-section');
            if (teamSection) {
                teamSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Press 'V' to scroll to values section
        if (e.key === 'v' || e.key === 'V') {
            const valuesSection = document.querySelector('.core-values');
            if (valuesSection) {
                valuesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Press 'M' to scroll to mission section
        if (e.key === 'm' || e.key === 'M') {
            const missionSection = document.querySelector('.mission-vision');
            if (missionSection) {
                missionSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Initialize floating elements
    initializeFloatingElements();

    // Performance optimization
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Refresh AOS on resize
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }

            // Recalculate any position-dependent elements
            initializeParallax();
        }, 250);
    });

    // Loading state management
    window.addEventListener('load', function () {
        // Remove loading states
        document.querySelectorAll('.loading').forEach(element => {
            element.classList.remove('loading');
        });

        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');
    });

    // Add CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 60%, 100% {
                transform: translateY(0) scale(1.2) rotate(15deg);
            }
            40% {
                transform: translateY(-10px) scale(1.3) rotate(15deg);
            }
            80% {
                transform: translateY(-5px) scale(1.25) rotate(15deg);
            }
        }
        
        .toast-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 15px;
            padding: 1rem 1.5rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            border-left: 4px solid #667eea;
        }
        
        .toast-success { border-left-color: #28a745; }
        .toast-error { border-left-color: #dc3545; }
        .toast-warning { border-left-color: #ffc107; }
        .toast-info { border-left-color: #17a2b8; }
        
        .toast-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #495057;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            margin-left: 1rem;
            padding: 0;
            font-size: 0.875rem;
            transition: color 0.2s ease;
        }
        
        .toast-close:hover {
            color: #495057;
        }
        
        .testimonial-dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 2rem;
        }
        
        .testimonial-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid #e9ecef;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .testimonial-dot.active {
            background: #667eea;
            border-color: #667eea;
            transform: scale(1.2);
        }
        
        .testimonial-dot:hover {
            border-color: #667eea;
            transform: scale(1.1);
        }
        
        .team-member.flipped .member-overlay {
            opacity: 1 !important;
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
        
        .loaded * {
            transition-duration: 0.3s;
        }
        
        @media (max-width: 768px) {
            .toast-notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
            
            .floating-card {
                position: static !important;
                transform: none !important;
                margin-bottom: 1rem;
                pointer-events: auto;
            }
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .particle {
                animation: none !important;
            }
            
            .floating-card {
                animation: none !important;
            }
        }
        
        /* Focus styles for accessibility */
        .testimonial-dot:focus,
        .social-link:focus,
        .play-button:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .hero-overlay {
                background: rgba(0, 0, 0, 0.8);
            }
            
            .cta-overlay {
                background: rgba(0, 0, 0, 0.8);
            }
        }
    `;
    document.head.appendChild(style);

    // Analytics and user interaction tracking
    function trackUserInteraction(action, element) {
        // Implement analytics tracking here
        console.log(`User ${action} on ${element}`);

        // Example: Google Analytics event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'About Page Interaction',
                'event_label': element
            });
        }
    }

    // Add interaction tracking to key elements
    document.querySelectorAll('.cta-buttons .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            trackUserInteraction('click', 'CTA Button');
        });
    });

    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', () => {
            trackUserInteraction('click', 'Social Link');
        });
    });

    // Initialize performance monitoring
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
});

// Export functions for external use
window.AboutPage = {
    showToast: function (message, type) {
        // Implementation available in closure above
        console.log(`Toast: ${message} (${type})`);
    },

    scrollToSection: function (sectionClass) {
        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    },

    refreshAnimations: function () {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
};