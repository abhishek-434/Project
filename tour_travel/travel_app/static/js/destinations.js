document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Search form enhancement
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            const searchInput = this.querySelector('input[name="search"]');
            if (searchInput.value.trim() === '') {
                e.preventDefault();
            }
        });
    }

    // Destination card hover effects
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Mobile menu toggle (would need HTML element added)
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuButton.style.display = 'none';

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.prepend(mobileMenuButton);

        const navLinks = document.querySelector('.nav-links');
        const authButtons = document.querySelector('.auth-buttons');

        mobileMenuButton.addEventListener('click', function () {
            navLinks.classList.toggle('show');
            authButtons.classList.toggle('show');
        });

        // Check screen size and toggle mobile menu
        function checkScreenSize() {
            if (window.innerWidth <= 768) {
                mobileMenuButton.style.display = 'block';
                navLinks.classList.remove('show');
                authButtons.classList.remove('show');
            } else {
                mobileMenuButton.style.display = 'none';
                navLinks.classList.add('show');
                authButtons.classList.add('show');
            }
        }

        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    }

    // Pagination active state
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            paginationLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll to top button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopButton);

    scrollToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });

    // Add some animations when scrolling
    const animateOnScroll = function () {
        const destinationsSection = document.querySelector('.destinations-section');
        if (destinationsSection) {
            const sectionPosition = destinationsSection.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (sectionPosition < screenPosition) {
                destinationsSection.style.opacity = '1';
                destinationsSection.style.transform = 'translateY(0)';
            }
        }
    };

    // Set initial state for animation
    const destinationsSection = document.querySelector('.destinations-section');
    if (destinationsSection) {
        destinationsSection.style.opacity = '0';
        destinationsSection.style.transform = 'translateY(20px)';
        destinationsSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load in case section is already in view
});

// Additional helper functions
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}