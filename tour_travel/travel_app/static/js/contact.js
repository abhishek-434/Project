// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (letters and spaces only, minimum 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 5,
            message: 'Subject must be at least 5 characters long'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Message must be at least 10 characters long'
        }
    };

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(`id_${fieldName}`);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => clearError(fieldName));
        }
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            showLoading();

            // Submit the form
            const formData = new FormData(form);

            fetch(form.action || window.location.href, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('Network response was not ok');
                })
                .then(html => {
                    // If the response contains success message, redirect or update page
                    if (html.includes('Message sent successfully')) {
                        showSuccess();
                        form.reset();
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        // Handle form errors by replacing form content
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const newForm = doc.getElementById('contactForm');
                        if (newForm) {
                            form.innerHTML = newForm.innerHTML;
                            reinitializeForm();
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showError('An error occurred. Please try again.');
                })
                .finally(() => {
                    hideLoading();
                });
        } else {
            // Shake the form if validation fails
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        }
    });

    // Validate individual field
    function validateField(fieldName) {
        const field = document.getElementById(`id_${fieldName}`);
        const rule = validationRules[fieldName];
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);

        // Clear previous error state
        formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }

        // Required field check
        if (rule.required && !value) {
            showFieldError(formGroup, errorElement, 'This field is required');
            return false;
        }

        // Minimum length check
        if (rule.minLength && value.length < rule.minLength) {
            showFieldError(formGroup, errorElement, rule.message);
            return false;
        }

        // Pattern check
        if (rule.pattern && value && !rule.pattern.test(value)) {
            showFieldError(formGroup, errorElement, rule.message);
            return false;
        }

        return true;
    }

    // Show field error
    function showFieldError(formGroup, errorElement, message) {
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Clear field error
    function clearError(fieldName) {
        const field = document.getElementById(`id_${fieldName}`);
        const formGroup = field.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);

        formGroup.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Show loading state
    function showLoading() {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
    }

    // Hide loading state
    function hideLoading() {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
    }

    // Show success message
    function showSuccess() {
        const messagesDiv = document.querySelector('.messages') || createMessagesDiv();
        messagesDiv.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                Message sent successfully! We will get back to you soon.
                <button type="button" class="close-btn" onclick="this.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        messagesDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // Show error message
    function showError(message) {
        const messagesDiv = document.querySelector('.messages') || createMessagesDiv();
        messagesDiv.innerHTML = `
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
                <button type="button" class="close-btn" onclick="this.parentElement.style.display='none'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        messagesDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // Create messages div if it doesn't exist
    function createMessagesDiv() {
        const messagesDiv = document.createElement('div');
        messagesDiv.className = 'messages';
        const formTitle = document.querySelector('.contact-form h2');
        formTitle.parentNode.insertBefore(messagesDiv, formTitle.nextSibling);
        return messagesDiv;
    }

    // Reinitialize form after AJAX update
    function reinitializeForm() {
        // Re-attach event listeners to new form elements
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(`id_${fieldName}`);
            if (field) {
                field.addEventListener('blur', () => validateField(fieldName));
                field.addEventListener('input', () => clearError(fieldName));
            }
        });
    }

    // Auto-hide messages after 5 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert.classList.contains('alert-success')) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        });
    }, 5000);

    // Smooth scrolling for form focus
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    });

    // Character counter for textarea
    const messageTextarea = document.getElementById('id_message');
    if (messageTextarea) {
        const maxLength = 1000; // Adjust based on your model field
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.85rem;
            color: #666;
            margin-top: 5px;
        `;
        messageTextarea.parentNode.appendChild(counter);

        function updateCounter() {
            const remaining = maxLength - messageTextarea.value.length;
            counter.textContent = `${messageTextarea.value.length}/${maxLength} characters`;

            if (remaining < 50) {
                counter.style.color = '#e74c3c';
            } else if (remaining < 100) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#666';
            }
        }

        messageTextarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }
});