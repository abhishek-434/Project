// static/js/home.js
document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white', 'shadow-sm');
        } else {
            navbar.classList.remove('bg-white', 'shadow-sm');
        }
    });

    // Hero search form validation
    const searchForm = document.querySelector('.search-form');

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const destination = this.querySelector('select[name="destination"]').value;
            const date = this.querySelector('input[type="date"]').value;
            const travelers = this.querySelector('select[name="travelers"]').value;

            if (!destination || destination === 'Where to?') {
                alert('Please select a destination.');
                return;
            }

            if (!date) {
                alert('Please select a travel date.');
                return;
            }

            if (!travelers || travelers === 'Travelers') {
                alert('Please select the number of travelers.');
                return;
            }

            // Redirect to packages page with search parameters
            window.location.href = `/destinations/packages/?destination=${destination}&date=${date}&travelers=${travelers}`;
        });
    }

    // Destination cards hover effects
    const destinationCards = document.querySelectorAll('.destination-card');

    destinationCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            this.querySelector('.destination-image img').style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            this.querySelector('.destination-image img').style.transform = 'scale(1)';
        });
    });

    // Offer cards hover effects
    const offerCards = document.querySelectorAll('.offer-card');

    offerCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.querySelector('.offer-image img').style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.querySelector('.offer-image img').style.transform = 'scale(1)';
        });
    });

    // Feature cards hover effects
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email && isValidEmail(email)) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success mt-3';
                successMessage.textContent = 'Thank you for subscribing to our newsletter!';

                newsletterForm.parentNode.appendChild(successMessage);
                emailInput.value = '';

                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            } else {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-danger mt-3';
                errorMessage.textContent = 'Please enter a valid email address.';

                newsletterForm.parentNode.appendChild(errorMessage);

                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            }
        });
    }

    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Animated typing effect for hero text
    const heroTitle = document.querySelector('.hero h1');

    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }

    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');

    if (testimonialSlider) {
        let currentSlide = 0;
        const slides = testimonialSlider.querySelectorAll('.testimonial-card');

        // Hide all slides except the first one
        slides.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });

        // Auto slide function
        function autoSlide() {
            slides[currentSlide].style.display = 'none';
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].style.display = 'block';
        }

        // Change slide every 5 seconds
        setInterval(autoSlide, 5000);
    }
});