// Base JavaScript functionality
$(document).ready(function () {

    // Navbar scroll effect
    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

    // Newsletter subscription
    $('#newsletterForm').on('submit', function (e) {
        e.preventDefault();

        const email = $('#newsletterEmail').val();
        const button = $(this).find('button[type="submit"]');
        const originalHtml = button.html();

        // Show loading state
        button.html('<i class="fas fa-spinner fa-spin"></i>').prop('disabled', true);

        $.ajax({
            url: '/newsletter-signup/',
            method: 'POST',
            data: JSON.stringify({ email: email }),
            contentType: 'application/json',
            success: function (response) {
                if (response.success) {
                    showNotification('success', response.message);
                    $('#newsletterEmail').val('');
                } else {
                    showNotification('error', response.message);
                }
            },
            error: function () {
                showNotification('error', 'Something went wrong. Please try again.');
            },
            complete: function () {
                button.html(originalHtml).prop('disabled', false);
            }
        });
    });

    // Auto-hide messages after 5 seconds
    setTimeout(function () {
        $('.alert').fadeOut('slow');
    }, 5000);

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function (img) {
            imageObserver.observe(img);
        });
    }

    // Animate on scroll
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(function (element) {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-fadeInUp');
            }
        });
    };

    $(window).on('scroll', animateOnScroll);
    animateOnScroll(); // Run on load

    // Back to top button
    createBackToTopButton();

    // Search modal focus
    $('#searchModal').on('shown.bs.modal', function () {
        $(this).find('input[name="q"]').focus();
    });

    // Form validation enhancement
    $('form').on('submit', function () {
        const form = this;
        const submitButton = $(form).find('button[type="submit"]');

        if (form.checkValidity()) {
            submitButton.prop('disabled', true);
            const originalText = submitButton.text();
            submitButton.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...');

            // Re-enable after 3 seconds (fallback)
            setTimeout(function () {
                submitButton.prop('disabled', false).text(originalText);
            }, 3000);
        }
    });

    // Price formatter
    $('.price').each(function () {
        const price = parseFloat($(this).text().replace(/[^0-9.-]+/g, ''));
        if (!isNaN(price)) {
            $(this).text('$' + price.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));
        }
    });

    // Rating stars display
    $('.rating-stars').each(function () {
        const rating = parseFloat($(this).data('rating')) || 0;
        const starsHtml = generateStarRating(rating);
        $(this).html(starsHtml);
    });

    // Image gallery lightbox
    $('.gallery-image').on('click', function (e) {
        e.preventDefault();
        const imageSrc = $(this).attr('href') || $(this).find('img').attr('src');
        showImageLightbox(imageSrc);
    });

    // Mobile menu enhancement
    $('.navbar-toggler').on('click', function () {
        $(this).toggleClass('active');
    });

    // Parallax effect for hero sections
    $(window).scroll(function () {
        const scrolled = $(window).scrollTop();
        const parallax = $('.parallax-bg');
        const speed = 0.5;

        parallax.css('transform', 'translateY(' + (scrolled * speed) + 'px)');
    });
});

// Utility Functions
function showNotification(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

    const notification = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas ${icon} me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    if ($('.messages-container').length === 0) {
        $('body').append('<div class="messages-container"></div>');
    }

    $('.messages-container').append(notification);

    setTimeout(function () {
        $('.messages-container .alert').last().fadeOut('slow', function () {
            $(this).remove();
        });
    }, 5000);
}

function generateStarRating(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-warning"></i>';
    }

    // Half star
    if (hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-warning"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star text-warning"></i>';
    }

    return starsHtml;
}

function showImageLightbox(imageSrc) {
    const lightboxHtml = `
        <div class="image-lightbox" onclick="closeLightbox()">
            <div class="lightbox-content">
                <img src="${imageSrc}" alt="Lightbox Image">
                <button class="lightbox-close" onclick="closeLightbox()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;

    $('body').append(lightboxHtml);
    $('.image-lightbox').fadeIn(300);
    $('body').css('overflow', 'hidden');
}

function closeLightbox() {
    $('.image-lightbox').fadeOut(300, function () {
        $(this).remove();
        $('body').css('overflow', 'auto');
    });
}

function createBackToTopButton() {
    const backToTopButton = `
        <button id="backToTop" class="btn btn-primary rounded-circle position-fixed" 
                style="bottom: 30px; right: 30px; width: 50px; height: 50px; z-index: 1000; display: none;">
            <i class="fas fa-arrow-up"></i>
        </button>
    `;

    $('body').append(backToTopButton);

    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            $('#backToTop').fadeIn();
        } else {
            $('#backToTop').fadeOut();
        }
    });

    $('#backToTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
}

// Loading animation
function showPageLoader() {
    const loader = `
        <div id="pageLoader" class="position-fixed w-100 h-100 d-flex align-items-center justify-content-center" 
             style="top: 0; left: 0; background: rgba(255,255,255,0.9); z-index: 9999;">
            <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">Loading amazing destinations...</p>
            </div>
        </div>
    `;

    $('body').append(loader);
}

function hidePageLoader() {
    $('#pageLoader').fadeOut(500, function () {
        $(this).remove();
    });
}

// Custom CSS for lightbox
const lightboxCSS = `
    <style>
        .image-lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: none;
            cursor: pointer;
        }
        
        .lightbox-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 90%;
            max-height: 90%;
            cursor: default;
        }
        
        .lightbox-content img {
            width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .lightbox-close {
            position: absolute;
            top: -15px;
            right: -15px;
            background: #fff;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        
        .lightbox-close:hover {
            background: #f8f9fa;
            transform: scale(1.1);
        }
    </style>
`;

$('head').append(lightboxCSS);