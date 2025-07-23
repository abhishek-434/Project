// static/js/contact.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const newsletter = document.getElementById('newsletter').checked;
            
            // Validate form
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage += 'Please enter your name.\n';
            }
            
            if (!email) {
                isValid = false;
                errorMessage += 'Please enter your email address.\n';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }
            
            if (phone && !isValidPhone(phone)) {
                isValid = false;
                errorMessage += 'Please enter a valid phone number.\n';
            }
            
            if (!subject) {
                isValid = false;
                errorMessage += 'Please enter a subject.\n';
            }
            
            if (!message) {
                isValid = false;
                errorMessage += 'Please enter your message.\n';
            }
            
            if (!isValid) {
                alert(errorMessage);
                return;
            }
            
            // In a real application, you would send this data to the server
            // For demo purposes, we'll just show a success message
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-4';
            successMessage.innerHTML = `
                <h4 class="alert-heading">Message Sent!</h4>
                <p>Thank you for contacting us, ${name}! We have received your message and will get back to you soon.</p>
                ${newsletter ? '<p>You have been added to our newsletter subscription.</p>' : ''}
            `;
            
            // Clear form
            contactForm.reset();
            
            // Add success message after form
            contactForm.parentNode.appendChild(successMessage);
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove success message after 10 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 10000);
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to validate phone number
    function isValidPhone(phone) {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }
    
    // FAQ accordion animation
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const collapse = item.querySelector('.accordion-collapse');
        
        header.addEventListener('click', function() {
            // Add a class to the active accordion item for styling
            if (collapse.classList.contains('show')) {
                item.classList.remove('active');
            } else {
                // Remove active class from all items
                accordionItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to current item
                item.classList.add('active');
            }
        });
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
});