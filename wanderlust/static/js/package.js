// static/js/packages.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Package card hover effects
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
            this.querySelector('.package-image img').style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
            this.querySelector('.package-image img').style.transform = 'scale(1)';
        });
    });
    
    // Filter form validation and submission
    const filterForm = document.querySelector('.filter-form');
    
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            // No need to validate, allow empty filters
            // This is just to add any custom logic before submitting
            
            // Get URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            
            // Preserve any additional parameters not in the form
            for (const [key, value] of urlParams.entries()) {
                if (!filterForm.elements[key] && key !== 'page') {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = key;
                    hiddenInput.value = value;
                    filterForm.appendChild(hiddenInput);
                }
            }
        });
    }
    
    // Calculate and display discount percentage
    const packageDiscounts = document.querySelectorAll('.package-discount');
    
    packageDiscounts.forEach(discount => {
        const card = discount.closest('.package-card');
        if (card) {
            const oldPrice = card.querySelector('.old-price');
            const currentPrice = card.querySelector('.current-price');
            
            if (oldPrice && currentPrice) {
                const oldPriceValue = parseFloat(oldPrice.textContent.replace('$', '').trim());
                const currentPriceValue = parseFloat(currentPrice.textContent.replace('$', '').trim());
                
                if (oldPriceValue > 0 && currentPriceValue > 0) {
                    const discountPercent = Math.round((1 - currentPriceValue / oldPriceValue) * 100);
                    discount.textContent = `${discountPercent}% OFF`;
                }
            }
        }
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
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