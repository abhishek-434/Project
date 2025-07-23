// static/js/destinations.js
document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Populate countries dropdown based on selected continent
    const continentSelect = document.querySelector('select[name="continent"]');
    const countrySelect = document.querySelector('select[name="country"]');

    if (continentSelect && countrySelect) {
        // This would be populated with real data from the backend
        const countriesByContinent = {
            'africa': [
                { slug: 'morocco', name: 'Morocco' },
                { slug: 'south-africa', name: 'South Africa' },
                { slug: 'kenya', name: 'Kenya' },
                { slug: 'egypt', name: 'Egypt' },
                { slug: 'tanzania', name: 'Tanzania' }
            ],
            'asia': [
                { slug: 'japan', name: 'Japan' },
                { slug: 'thailand', name: 'Thailand' },
                { slug: 'vietnam', name: 'Vietnam' },
                { slug: 'indonesia', name: 'Indonesia' },
                { slug: 'india', name: 'India' }
            ],
            'europe': [
                { slug: 'italy', name: 'Italy' },
                { slug: 'france', name: 'France' },
                { slug: 'spain', name: 'Spain' },
                { slug: 'greece', name: 'Greece' },
                { slug: 'uk', name: 'United Kingdom' }
            ],
            'northamerica': [
                { slug: 'usa', name: 'United States' },
                { slug: 'canada', name: 'Canada' },
                { slug: 'mexico', name: 'Mexico' },
                { slug: 'costa-rica', name: 'Costa Rica' },
                { slug: 'jamaica', name: 'Jamaica' }
            ],
            'southamerica': [
                { slug: 'brazil', name: 'Brazil' },
                { slug: 'peru', name: 'Peru' },
                { slug: 'argentina', name: 'Argentina' },
                { slug: 'colombia', name: 'Colombia' },
                { slug: 'chile', name: 'Chile' }
            ],
            'oceania': [
                { slug: 'australia', name: 'Australia' },
                { slug: 'new-zealand', name: 'New Zealand' },
                { slug: 'fiji', name: 'Fiji' },
                { slug: 'samoa', name: 'Samoa' },
                { slug: 'papua-new-guinea', name: 'Papua New Guinea' }
            ]
        };

        // Function to update countries dropdown
        function updateCountries() {
            const selectedContinent = continentSelect.value;
            const selectedCountry = new URLSearchParams(window.location.search).get('country');

            // Clear current options
            countrySelect.innerHTML = '<option value="">All Countries</option>';

            if (selectedContinent && countriesByContinent[selectedContinent]) {
                countriesByContinent[selectedContinent].forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.slug;
                    option.textContent = country.name;
                    if (country.slug === selectedCountry) {
                        option.selected = true;
                    }
                    countrySelect.appendChild(option);
                });
            }
        }

        // Initialize countries dropdown
        updateCountries();

        // Update countries when continent changes
        continentSelect.addEventListener('change', updateCountries);
    }

    // Destination card hover effects
    const destinationCards = document.querySelectorAll('.destination-card');

    destinationCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.querySelector('.destination-image img').style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.querySelector('.destination-image img').style.transform = 'scale(1)';
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
});