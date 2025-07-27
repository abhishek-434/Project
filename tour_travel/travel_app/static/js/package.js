// Packages Page JavaScript

document.addEventListener('DOMContentLoaded', function () {

    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Initialize all functionality
    initializeSearch();
    initializeFilters();
    initializePackageCards();
    initializePagination();
    initializeScrollEffects();
    initializeMobileOptimizations();

    // Search functionality
    function initializeSearch() {
        const searchInput = document.querySelector('input[name="search"]');
        const filterForm = document.querySelector('.filter-form');

        if (searchInput && filterForm) {
            // Auto-submit on Enter key
            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    filterForm.submit();
                }
            });

            // Clear search with Escape key
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    this.value = '';
                    this.focus();
                }
            });

            // Add search suggestions (if you have a search API)
            let searchTimeout;
            searchInput.addEventListener('input', function () {
                clearTimeout(searchTimeout);
                const query = this.value.trim();

                if (query.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        // Implement search suggestions here
                        console.log('Searching for:', query);
                    }, 300);
                }
            });
        }
    }

    // Filter functionality
    function initializeFilters() {
        const filterForm = document.querySelector('.filter-form');
        const clearButton = document.querySelector('a[href*="packages"]');

        if (filterForm) {
            // Auto-submit on filter change
            const filterInputs = filterForm.querySelectorAll('select, input[type="number"]');
            filterInputs.forEach(input => {
                input.addEventListener('change', function () {
                    // Add small delay to allow user to see the change
                    setTimeout(() => {
                        filterForm.submit();
                    }, 100);
                });
            });

            // Price range validation
            const minPriceInput = document.querySelector('input[name="min_price"]');
            const maxPriceInput = document.querySelector('input[name="max_price"]');

            if (minPriceInput && maxPriceInput) {
                function validatePriceRange() {
                    const minPrice = parseFloat(minPriceInput.value) || 0;
                    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

                    if (maxPrice < minPrice && maxPrice > 0) {
                        maxPriceInput.value = minPrice;
                        showToast('Maximum price cannot be less than minimum price', 'warning');
                    }
                }

                minPriceInput.addEventListener('blur', validatePriceRange);
                maxPriceInput.addEventListener('blur', validatePriceRange);
            }
        }

        // Animate filter tags
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(20px)';
                tag.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    // Package cards functionality
    function initializePackageCards() {
        const packageCards = document.querySelectorAll('.package-card');

        packageCards.forEach(card => {
            // Enhanced hover effects
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

                // Animate the image
                const img = this.querySelector('.package-image img');
                if (img) {
                    img.style.transform = 'scale(1.1)';
                }
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';

                // Reset image
                const img = this.querySelector('.package-image img');
                if (img) {
                    img.style.transform = 'scale(1)';
                }
            });

            // Add click tracking
            const bookBtn = card.querySelector('.book-btn');
            if (bookBtn) {
                bookBtn.addEventListener('click', function (e) {
                    // Add loading state
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
                    this.disabled = true;

                    // Reset after a short delay (in real app, this would be after navigation)
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                });
            }
        });

        // Lazy loading for images
        const images = document.querySelectorAll('.package-image img');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // Trigger load
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Pagination functionality
    function initializePagination() {
        const paginationLinks = document.querySelectorAll('.pagination .page-link');

        paginationLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                if (!this.closest('.page-item').classList.contains('active')) {
                    // Add loading state
                    this.style.opacity = '0.5';
                    this.style.pointerEvents = 'none';

                    // Show loading indicator
                    showPageLoader();
                }
            });
        });
    }

    // Scroll effects
    function initializeScrollEffects() {
        // Smooth scroll for CTA button
        const scrollToPackagesBtn = document.querySelector('.scroll-to-packages');
        if (scrollToPackagesBtn) {
            scrollToPackagesBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector('#packagesGrid');
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.packages-hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.querySelector('.hero-background').style.transform = `translateY(${rate}px)`;
            });
        }

        // Floating icons animation
        const floatingIcons = document.querySelectorAll('.float-icon');
        floatingIcons.forEach((icon, index) => {
            setInterval(() => {
                const randomX = Math.random() * 20 - 10;
                const randomY = Math.random() * 20 - 10;
                icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
            }, 3000 + (index * 500));
        });

        // Sticky filter on scroll
        const filterSection = document.querySelector('.filter-section');
        if (filterSection) {
            const filterOffset = filterSection.offsetTop;

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > filterOffset + 100) {
                    filterSection.classList.add('sticky-filter');
                } else {
                    filterSection.classList.remove('sticky-filter');
                }
            });
        }
    }

    // Mobile optimizations
    function initializeMobileOptimizations() {
        // Touch gestures for package cards on mobile
        if ('ontouchstart' in window) {
            const packageCards = document.querySelectorAll('.package-card');

            packageCards.forEach(card => {
                let touchStartTime;
                let touchStartX;
                let touchStartY;

                card.addEventListener('touchstart', function (e) {
                    touchStartTime = Date.now();
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;

                    this.classList.add('touch-active');
                });

                card.addEventListener('touchend', function (e) {
                    const touchDuration = Date.now() - touchStartTime;
                    const touchEndX = e.changedTouches[0].clientX;
                    const touchEndY = e.changedTouches[0].clientY;

                    const deltaX = Math.abs(touchEndX - touchStartX);
                    const deltaY = Math.abs(touchEndY - touchStartY);

                    // If it's a tap (short duration, minimal movement)
                    if (touchDuration < 300 && deltaX < 10 && deltaY < 10) {
                        const bookBtn = this.querySelector('.book-btn');
                        if (bookBtn && !e.target.closest('.book-btn')) {
                            bookBtn.click();
                        }
                    }

                    this.classList.remove('touch-active');
                });
            });
        }

        // Responsive filter collapse
        const filterForm = document.querySelector('.filter-form');
        const filterToggle = createFilterToggle();

        if (window.innerWidth <= 768 && filterForm && filterToggle) {
            filterForm.parentNode.insertBefore(filterToggle, filterForm);
            filterForm.style.display = 'none';

            filterToggle.addEventListener('click', () => {
                const isVisible = filterForm.style.display !== 'none';
                filterForm.style.display = isVisible ? 'none' : 'block';
                filterToggle.querySelector('i').className = isVisible ? 'fas fa-filter' : 'fas fa-times';
                filterToggle.querySelector('span').textContent = isVisible ? 'Show Filters' : 'Hide Filters';
            });
        }

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate layouts
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 100);
        });
    }

    // Helper functions
    function createFilterToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'btn btn-outline-primary w-100 mb-3 filter-toggle';
        toggle.innerHTML = '<i class="fas fa-filter me-2"></i><span>Show Filters</span>';
        return toggle;
    }

    function showPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading packages...</p>
            </div>
        `;
        document.body.appendChild(loader);

        // Remove loader after 3 seconds (fallback)
        setTimeout(() => {
            if (document.body.contains(loader)) {
                document.body.removeChild(loader);
            }
        }, 3000);
    }

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

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
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

    // Package comparison functionality
    function initializeComparison() {
        const compareButtons = document.querySelectorAll('.compare-btn');
        const compareContainer = createCompareContainer();
        let selectedPackages = [];

        compareButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const packageId = this.dataset.packageId;
                const packageTitle = this.dataset.packageTitle;

                if (selectedPackages.includes(packageId)) {
                    selectedPackages = selectedPackages.filter(id => id !== packageId);
                    this.classList.remove('active');
                } else if (selectedPackages.length < 3) {
                    selectedPackages.push(packageId);
                    this.classList.add('active');
                } else {
                    showToast('You can compare up to 3 packages only', 'warning');
                    return;
                }

                updateCompareContainer();
            });
        });

        function updateCompareContainer() {
            if (selectedPackages.length > 0) {
                compareContainer.style.display = 'block';
                compareContainer.querySelector('.compare-count').textContent = selectedPackages.length;
            } else {
                compareContainer.style.display = 'none';
            }
        }
    }

    function createCompareContainer() {
        const container = document.createElement('div');
        container.className = 'compare-container';
        container.innerHTML = `
            <div class="compare-content">
                <span class="compare-text">
                    <i class="fas fa-balance-scale me-2"></i>
                    <span class="compare-count">0</span> packages selected
                </span>
                <div class="compare-actions">
                    <button class="btn btn-primary btn-sm compare-now">Compare Now</button>
                    <button class="btn btn-outline-secondary btn-sm clear-compare">Clear</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
        return container;
    }

    // Advanced search functionality
    function initializeAdvancedSearch() {
        const searchInput = document.querySelector('input[name="search"]');
        if (!searchInput) return;

        const suggestions = [
            'Beach destinations', 'Mountain adventures', 'Cultural tours',
            'Luxury packages', 'Budget trips', 'Family vacations',
            'Honeymoon packages', 'Wildlife safaris', 'City breaks',
            'Island hopping', 'Desert expeditions', 'Ski trips'
        ];

        const suggestionsContainer = createSuggestionsContainer();
        searchInput.parentNode.appendChild(suggestionsContainer);

        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();

            if (query.length >= 2) {
                const matches = suggestions.filter(s =>
                    s.toLowerCase().includes(query)
                ).slice(0, 5);

                showSuggestions(matches, query);
            } else {
                hideSuggestions();
            }
        });

        searchInput.addEventListener('blur', function () {
            setTimeout(hideSuggestions, 200);
        });

        function showSuggestions(matches, query) {
            if (matches.length === 0) {
                hideSuggestions();
                return;
            }

            suggestionsContainer.innerHTML = matches.map(match => {
                const highlighted = match.replace(
                    new RegExp(query, 'gi'),
                    `<strong>    // Pagination functionality</strong>`
                );
                return `<div class="suggestion-item" data-value="${match}">${highlighted}</div>`;
            }).join('');

            suggestionsContainer.style.display = 'block';

            // Add click handlers
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function () {
                    searchInput.value = this.dataset.value;
                    hideSuggestions();
                    searchInput.closest('form').submit();
                });
            });
        }

        function hideSuggestions() {
            suggestionsContainer.style.display = 'none';
        }
    }

    function createSuggestionsContainer() {
        const container = document.createElement('div');
        container.className = 'search-suggestions';
        return container;
    }

    // Initialize comparison and advanced search
    initializeComparison();
    initializeAdvancedSearch();

    // Loading states for form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function () {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Searching...';
                submitBtn.disabled = true;
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Escape to clear filters
        if (e.key === 'Escape') {
            const clearBtn = document.querySelector('a[href*="packages"]:not([href*="?"])');
            if (clearBtn && document.activeElement !== document.querySelector('input[name="search"]')) {
                window.location.href = clearBtn.href;
            }
        }
    });

    // Performance monitoring
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    console.log('Page load time:', entry.duration);
                }
            }
        });
        observer.observe({ entryTypes: ['navigation'] });
    }

    // Add some additional CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loader-content {
            text-align: center;
            color: #495057;
        }
        
        .toast-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: opacity 0.3s ease;
        }
        
        .toast-success { border-left: 4px solid #28a745; }
        .toast-error { border-left: 4px solid #dc3545; }
        .toast-warning { border-left: 4px solid #ffc107; }
        .toast-info { border-left: 4px solid #17a2b8; }
        
        .toast-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            margin-left: 1rem;
        }
        
        .compare-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: none;
        }
        
        .compare-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e9ecef;
            border-top: none;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 100;
            display: none;
        }
        
        .suggestion-item {
            padding: 0.75rem;
            cursor: pointer;
            border-bottom: 1px solid #f8f9fa;
        }
        
        .suggestion-item:hover {
            background: #f8f9fa;
        }
        
        .suggestion-item:last-child {
            border-bottom: none;
        }
        
        .sticky-filter {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .touch-active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
        }
        
        @media (max-width: 768px) {
            .toast-notification {
                left: 20px;
                right: 20px;
            }
            
            .compare-container {
                left: 20px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export functions for external use
window.PackagesApp = {
    showToast: function (message, type) {
        // Implementation would be here
        console.log(`Toast: ${message} (${type})`);
    },

    refreshPackages: function () {
        window.location.reload();
    },

    filterByPrice: function (min, max) {
        const url = new URL(window.location);
        if (min !== undefined) url.searchParams.set('min_price', min);
        if (max !== undefined) url.searchParams.set('max_price', max);
        window.location.href = url.toString();
    }
};